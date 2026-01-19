
require('dotenv').config();
const express = require('express');
const Database = require('better-sqlite3');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const crypto = require('crypto'); // Native Node crypto for hashing
const { GoogleGenAI } = require("@google/genai"); // Server-side import
const validator = require('validator'); // OWASP-recommended validation
const createDOMPurify = require('isomorphic-dompurify'); // XSS prevention
const helmet = require('helmet'); // Security headers

const app = express();

// --- CONSTANTS ---
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const BACKEND_URL = process.env.BACKEND_URL || `http://localhost:${PORT}`;
const API_KEY = process.env.API_KEY;

// Security & Rate Limiting
const AUTH_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const AUTH_RATE_LIMIT_MAX = 5;
const CHAT_RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const CHAT_RATE_LIMIT_MAX = 10;
const GENERAL_RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const GENERAL_RATE_LIMIT_MAX = 100; // 100 requests per minute
const FILE_UPLOAD_RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const FILE_UPLOAD_RATE_LIMIT_MAX = 5; // 5 uploads per minute
const SESSION_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours
const PASSWORD_HASH_ITERATIONS = 100000; // SECURITY: Increased from 1000 to 100000
const REFERRAL_CODE_MIN = 1000;
const REFERRAL_CODE_MAX = 9000;
const TEAM_CHAT_MESSAGE_LIMIT = 50;

// CORS Hardening
app.use(cors({
    origin: FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// SECURITY: Enhanced HTTP Headers with Helmet
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
            fontSrc: ["'self'", "data:"],
            connectSrc: ["'self'"],
            frameAncestors: ["'none'"],
            objectSrc: ["'none'"],
            baseUri: ["'self'"],
            formAction: ["'self'"],
        }
    },
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
}));

// Additional security headers
app.use((req, res, next) => {
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=(), payment=()');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
    next();
});

// Default limit for JSON/URL-encoded
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ limit: '1mb', extended: true }));

const db = new Database('database.db');
// Enable WAL mode for better concurrency handling & Foreign Keys
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

const OAUTH_CONFIG = {
    github: {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: `${BACKEND_URL}/api/auth/github/callback`
    },
    google: {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${BACKEND_URL}/api/auth/google/callback`
    }
};

// --- RATE LIMITER (Simple In-Memory) ---
/**
 * Creates a rate limiting middleware function with enhanced security
 * @param {number} windowMs - Time window in milliseconds
 * @param {number} maxRequests - Maximum number of requests allowed in the window
 * @returns {Function} Express middleware function
 */
const rateLimit = (windowMs, maxRequests) => {
    const requests = new Map();
    return (req, res, next) => {
        const ip = req.ip;
        const now = Date.now();

        if (!requests.has(ip)) {
            requests.set(ip, []);
        }

        const timestamps = requests.get(ip);
        const validTimestamps = timestamps.filter(time => now - time < windowMs);

        if (validTimestamps.length >= maxRequests) {
            // SECURITY: Add Retry-After header to prevent brute force
            const oldestTimestamp = validTimestamps[0];
            const retryAfter = Math.ceil((oldestTimestamp + windowMs - now) / 1000);
            res.setHeader('Retry-After', retryAfter.toString());
            return res.status(429).json({
                error: "Too many requests, please try again later.",
                retryAfter: retryAfter
            });
        }

        validTimestamps.push(now);
        requests.set(ip, validTimestamps);
        next();
    };
};

// Apply general rate limiting to all routes
app.use(rateLimit(GENERAL_RATE_LIMIT_WINDOW_MS, GENERAL_RATE_LIMIT_MAX));

// --- HELPERS ---

/**
 * SECURITY: Zero-Trust Input Validation & Sanitization
 * OWASP recommendations implementation
 */

/**
 * Validates and sanitizes email address
 * @param {string} email - Email to validate
 * @returns {object} { valid: boolean, sanitized: string, error: string }
 */
const validateEmail = (email) => {
    if (!email || typeof email !== 'string') {
        return { valid: false, error: 'Email is required' };
    }
    if (email.length > 254) {
        return { valid: false, error: 'Email too long' };
    }
    const trimmed = email.trim().toLowerCase();
    if (!validator.isEmail(trimmed)) {
        return { valid: false, error: 'Invalid email format' };
    }
    return { valid: true, sanitized: trimmed };
};

/**
 * Validates password strength (OWASP recommendations)
 * @param {string} password - Password to validate
 * @returns {object} { valid: boolean, error: string }
 */
const validatePassword = (password) => {
    if (!password || typeof password !== 'string') {
        return { valid: false, error: 'Password is required' };
    }
    if (password.length < 12) {
        return { valid: false, error: 'Password must be at least 12 characters' };
    }
    if (password.length > 128) {
        return { valid: false, error: 'Password too long' };
    }
    // Check for character variety (at least 3 of 4 types)
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    const varietyCount = [hasLower, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;

    if (varietyCount < 3) {
        return { valid: false, error: 'Password must contain at least 3 of: lowercase, uppercase, numbers, special characters' };
    }
    return { valid: true };
};

/**
 * Sanitizes text input to prevent XSS (stored XSS protection)
 * @param {string} text - Text to sanitize
 * @param {number} maxLength - Maximum allowed length
 * @returns {string} Sanitized text
 */
const sanitizeText = (text, maxLength = 10000) => {
    if (!text || typeof text !== 'string') return '';
    let sanitized = createDOMPurify.sanitize(text, {
        ALLOWED_TAGS: [],
        KEEP_CONTENT: true
    });
    // Remove null bytes and control characters
    sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
    // Trim to max length
    return sanitized.substring(0, maxLength).trim();
};

/**
 * Validates and sanitizes person names (OWASP recommendations)
 * @param {string} name - Name to validate
 * @returns {object} { valid: boolean, sanitized: string, error: string }
 */
const validateName = (name) => {
    if (!name || typeof name !== 'string') {
        return { valid: false, error: 'Name is required' };
    }
    if (name.length > 100) {
        return { valid: false, error: 'Name too long' };
    }
    const sanitized = sanitizeText(name.trim(), 100);
    // Allow letters, spaces, hyphens, apostrophes, and common name characters
    if (!/^[\p{L}\s\-'.]{1,100}$/u.test(sanitized)) {
        return { valid: false, error: 'Name contains invalid characters' };
    }
    return { valid: true, sanitized };
};

/**
 * Validates URL (for blog posts, image URLs, etc.)
 * @param {string} url - URL to validate
 * @returns {object} { valid: boolean, sanitized: string, error: string }
 */
const validateUrl = (url) => {
    if (!url || typeof url !== 'string') {
        return { valid: false, error: 'URL is required' };
    }
    if (url.length > 2048) {
        return { valid: false, error: 'URL too long' };
    }
    const trimmed = url.trim();
    if (!validator.isURL(trimmed, {
        protocols: ['http', 'https'],
        require_protocol: true,
        allow_underscores: false
    })) {
        return { valid: false, error: 'Invalid URL format' };
    }
    return { valid: true, sanitized: trimmed };
};

/**
 * Hashes a password using PBKDF2
 * @param {string} password - The password to hash
 * @param {string} [salt] - Optional salt, generates new one if not provided
 * @returns {{hash: string, salt: string}} The hashed password and salt
 */
const hashPassword = (password, salt) => {
    if (!salt) salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, PASSWORD_HASH_ITERATIONS, 64, 'sha512').toString('hex');
    return { hash, salt };
};

/**
 * SECURITY: Timing-safe password verification (prevents timing attacks)
 * @param {string} password - The password to verify
 * @param {string} hash - The stored hash
 * @param {string} salt - The stored salt
 * @returns {boolean} True if password matches
 */
const verifyPassword = (password, hash, salt) => {
    const verifyHash = crypto.pbkdf2Sync(password, salt, PASSWORD_HASH_ITERATIONS, 64, 'sha512');
    const storedHash = Buffer.from(hash, 'hex');

    // SECURITY: Use timingSafeEqual to prevent timing attacks
    if (verifyHash.length !== storedHash.length) {
        return false;
    }

    try {
        return crypto.timingSafeEqual(verifyHash, storedHash);
    } catch (e) {
        return false;
    }
};

/**
 * SECURITY: Audit logging for security events
 * @param {string} eventType - Type of security event
 * @param {string} userId - User ID (if applicable)
 * @param {object} metadata - Additional event data
 */
const auditLog = (eventType, userId = null, metadata = {}) => {
    const logEntry = {
        timestamp: new Date().toISOString(),
        event_type: eventType,
        user_id: userId,
        ip: metadata.ip || null,
        details: metadata
    };

    console.log('[AUDIT]', JSON.stringify(logEntry));

    // Store in database for compliance
    try {
        db.exec(`
            CREATE TABLE IF NOT EXISTS audit_logs (
                id TEXT PRIMARY KEY,
                event_type TEXT,
                user_id TEXT,
                ip_address TEXT,
                details TEXT,
                created_at TEXT
            );

            CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
            CREATE INDEX IF NOT EXISTS idx_audit_logs_event_type ON audit_logs(event_type);
            CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
        `);

        db.prepare('INSERT INTO audit_logs (id, event_type, user_id, ip_address, details, created_at) VALUES (?, ?, ?, ?, ?, ?)').run(
            uuidv4(),
            eventType,
            userId,
            metadata.ip || null,
            JSON.stringify(metadata),
            new Date().toISOString()
        );
    } catch (e) {
        console.error('[AUDIT] Failed to write log:', e.message);
    }
};

// --- DATENBANK INITIALISIERUNG ---
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT, -- Now stores hash
    salt TEXT,     -- Password salt
    role TEXT,
    company TEXT,
    referral_code TEXT UNIQUE,
    created_at TEXT
  );

  CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY,
    user_id TEXT,
    created_at TEXT,
    expires_at TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    name_en TEXT,
    description TEXT,
    description_en TEXT,
    price REAL,
    sale_price REAL,
    price_details TEXT,
    price_details_en TEXT
  );

  CREATE TABLE IF NOT EXISTS user_services (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    service_id INTEGER,
    status TEXT,
    progress INTEGER,
    created_at TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  );
  
  CREATE TABLE IF NOT EXISTS service_updates (
    id TEXT PRIMARY KEY,
    user_service_id TEXT,
    message TEXT,
    author_id TEXT,
    created_at TEXT,
    FOREIGN KEY(user_service_id) REFERENCES user_services(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    amount REAL,
    date TEXT,
    due_date TEXT,
    status TEXT,
    description TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS tickets (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    subject TEXT,
    status TEXT,
    priority TEXT,
    created_at TEXT,
    last_update TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS ticket_messages (
    id TEXT PRIMARY KEY,
    ticket_id TEXT,
    user_id TEXT,
    text TEXT,
    created_at TEXT,
    FOREIGN KEY(ticket_id) REFERENCES tickets(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS ticket_members (
    ticket_id TEXT,
    user_id TEXT,
    added_at TEXT,
    PRIMARY KEY (ticket_id, user_id),
    FOREIGN KEY(ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  );
  
  CREATE TABLE IF NOT EXISTS contact_messages (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT,
    subject TEXT,
    message TEXT,
    created_at TEXT
  );

  CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE,
    created_at TEXT
  );

  CREATE TABLE IF NOT EXISTS analytics_events (
    id TEXT PRIMARY KEY,
    session_id TEXT,
    type TEXT, 
    path TEXT,
    element TEXT,
    timestamp INTEGER
  );
  
  CREATE TABLE IF NOT EXISTS team_chat_messages (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    content TEXT,
    created_at TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE SET NULL
  );
  
  CREATE TABLE IF NOT EXISTS files (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    name TEXT,
    size INTEGER,
    type TEXT,
    data TEXT,
    created_at TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  );
  
  CREATE TABLE IF NOT EXISTS discounts (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE,
    type TEXT, -- 'percent' or 'fixed'
    value REAL,
    used_count INTEGER DEFAULT 0,
    created_at TEXT
  );
  
  -- Performance Indexes
  CREATE INDEX IF NOT EXISTS idx_tickets_user_id ON tickets(user_id);
  CREATE INDEX IF NOT EXISTS idx_user_services_user_id ON user_services(user_id);
  CREATE INDEX IF NOT EXISTS idx_team_chat_created_at ON team_chat_messages(created_at);
  CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
`);

// AUTH MIDDLEWARE (Secure Session Based)
/**
 * Middleware to authenticate JWT/session tokens
 * Verifies session exists and is not expired
 */
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.sendStatus(401);
    
    try {
        // Check session table
        const session = db.prepare('SELECT user_id, expires_at FROM sessions WHERE token = ?').get(token);
        
        if (!session) return res.sendStatus(403);
        
        // Check expiry
        if (new Date(session.expires_at) < new Date()) {
            db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
            return res.sendStatus(403);
        }

        const user = db.prepare('SELECT id, name, email, role, company, referral_code FROM users WHERE id = ?').get(session.user_id);
        
        if (!user) return res.sendStatus(403);
        
        req.user = user;
        next();
    } catch (err) {
        console.error("Auth Error:", err);
        return res.sendStatus(500);
    }
};

const requireTeam = (req, res, next) => {
    if (req.user.role !== 'team' && req.user.role !== 'owner') return res.sendStatus(403);
    next();
};

// --- AUTH ENDPOINTS ---

// Rate Limit: 5 attempts per 15 minutes for login/register
const authLimiter = rateLimit(AUTH_RATE_LIMIT_WINDOW_MS, AUTH_RATE_LIMIT_MAX);

app.post('/api/auth/register', authLimiter, (req, res) => {
    const { name, company, email, password } = req.body;

    // SECURITY: Zero-Trust validation
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
        auditLog('AUTH_REGISTER_FAILED', null, { ip: req.ip, reason: emailValidation.error });
        return res.status(400).json({ error: emailValidation.error });
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
        auditLog('AUTH_REGISTER_FAILED', null, { ip: req.ip, reason: passwordValidation.error });
        return res.status(400).json({ error: passwordValidation.error });
    }

    const nameValidation = validateName(name);
    if (!nameValidation.valid) {
        auditLog('AUTH_REGISTER_FAILED', null, { ip: req.ip, reason: nameValidation.error });
        return res.status(400).json({ error: nameValidation.error });
    }

    try {
        const id = uuidv4();
        const sanitizedName = nameValidation.sanitized;
        const sanitizedEmail = emailValidation.sanitized;
        const sanitizedCompany = company ? sanitizeText(company.trim(), 100) : null;

        const referralCode = sanitizedName.substring(0, 3).toUpperCase() + Math.floor(REFERRAL_CODE_MIN + Math.random() * REFERRAL_CODE_MAX);

        // Hash Password
        const { hash, salt } = hashPassword(password);

        const stmt = db.prepare('INSERT INTO users (id, name, email, password, salt, role, company, referral_code, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
        stmt.run(id, sanitizedName, sanitizedEmail, hash, salt, 'user', sanitizedCompany, referralCode, new Date().toISOString());

        // Create Session
        const token = uuidv4();
        const expiresAt = new Date(Date.now() + SESSION_EXPIRY_MS).toISOString();
        db.prepare('INSERT INTO sessions (token, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)').run(token, id, new Date().toISOString(), expiresAt);

        auditLog('AUTH_REGISTER_SUCCESS', id, { ip: req.ip });

        res.json({
            token: token,
            user: { id, name: sanitizedName, email: sanitizedEmail, role: 'user', company: sanitizedCompany, referral_code: referralCode }
        });
    } catch (e) {
        // SECURITY: Log detailed error server-side, return generic message
        console.error('[AUTH] Registration error:', e.message);
        auditLog('AUTH_REGISTER_ERROR', null, { ip: req.ip, error: e.message });

        if (e.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            // SECURITY: Don't reveal which field caused the constraint violation
            return res.status(400).json({ error: 'User already exists' });
        }
        res.status(500).json({ error: 'Registration failed' });
    }
});

app.post('/api/auth/login', authLimiter, (req, res) => {
    const { email, password } = req.body;

    // SECURITY: Zero-Trust validation
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
        auditLog('AUTH_LOGIN_FAILED', null, { ip: req.ip, reason: 'Invalid email format' });
        return res.status(400).json({ error: 'Invalid email format' });
    }

    if (!password || typeof password !== 'string' || password.length > 128) {
        auditLog('AUTH_LOGIN_FAILED', null, { ip: req.ip, reason: 'Invalid password format' });
        return res.status(400).json({ error: 'Invalid request format' });
    }

    try {
        const sanitizedEmail = emailValidation.sanitized;
        const user = db.prepare('SELECT * FROM users WHERE email = ?').get(sanitizedEmail);

        if (user && verifyPassword(password, user.password, user.salt)) {
            // Create Session
            const token = uuidv4();
            const expiresAt = new Date(Date.now() + SESSION_EXPIRY_MS).toISOString();
            db.prepare('DELETE FROM sessions WHERE user_id = ?').run(user.id); // Single session for demo simplicity
            db.prepare('INSERT INTO sessions (token, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)').run(token, user.id, new Date().toISOString(), expiresAt);

            auditLog('AUTH_LOGIN_SUCCESS', user.id, { ip: req.ip });

            const { password: _, salt: __, ...safeUser } = user;
            res.json({
                token: token,
                user: safeUser
            });
        } else {
            // SECURITY: Generic error message (no information disclosure)
            auditLog('AUTH_LOGIN_FAILED', null, { ip: req.ip, email: sanitizedEmail, reason: 'Invalid credentials' });
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (e) {
        // SECURITY: Log actual error server-side, return generic message to client
        console.error('[AUTH] Login error:', e.message);
        auditLog('AUTH_LOGIN_ERROR', null, { ip: req.ip, error: e.message });
        res.status(500).json({ error: 'Authentication failed' });
    }
});

// --- SECURITY: Validate redirect URLs to prevent Open Redirect attacks ---
/**
 * Validates if a redirect URL is safe
 * Prevents open redirect vulnerabilities by checking against allowed domains
 */
function isValidRedirectUrl(url) {
    try {
        if (!url) return false;

        const parsedUrl = new URL(url);

        // Check against allowed domains (including localhost for development)
        const allowedDomains = [
            'localhost:5173',
            'localhost:3000',
            'localhost',
            'scalesite.app',
            'www.scalesite.app'
        ];

        // Allow if it matches one of the allowed domains
        return allowedDomains.some(domain =>
            parsedUrl.hostname === domain ||
            parsedUrl.hostname.endsWith(`.${domain}`)
        );
    } catch (e) {
        return false;
    }
}

// --- REAL OAUTH IMPLEMENTATION ---

const processOAuthUser = (email, name, provider) => {
    let user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    
    if (!user) {
        const id = uuidv4();
        const company = `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`;
        const referralCode = name.replace(/[^a-zA-Z]/g, '').substring(0, 3).toUpperCase() + Math.floor(REFERRAL_CODE_MIN + Math.random() * REFERRAL_CODE_MAX);
        const randomPass = uuidv4();
        const { hash, salt } = hashPassword(randomPass);

        const stmt = db.prepare('INSERT INTO users (id, name, email, password, salt, role, company, referral_code, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
        stmt.run(id, name, email, hash, salt, 'user', company, referralCode, new Date().toISOString());
        
        user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    }

    // Create Session for OAuth User
    const token = uuidv4();
    const expiresAt = new Date(Date.now() + SESSION_EXPIRY_MS).toISOString();
    db.prepare('DELETE FROM sessions WHERE user_id = ?').run(user.id);
    db.prepare('INSERT INTO sessions (token, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)').run(token, user.id, new Date().toISOString(), expiresAt);

    return { user, token };
};

// 1. Get Auth URLs
app.get('/api/auth/github/url', (req, res) => {
    if (!OAUTH_CONFIG.github.clientID) return res.status(500).json({ error: 'GitHub Client ID missing' });
    const rootUrl = 'https://github.com/login/oauth/authorize';
    const options = {
        client_id: OAUTH_CONFIG.github.clientID,
        redirect_uri: OAUTH_CONFIG.github.callbackURL,
        scope: 'user:email',
    };
    res.json({ url: `${rootUrl}?${new URLSearchParams(options).toString()}` });
});

app.get('/api/auth/google/url', (req, res) => {
    if (!OAUTH_CONFIG.google.clientID) return res.status(500).json({ error: 'Google Client ID missing' });
    const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
    const options = {
        redirect_uri: OAUTH_CONFIG.google.callbackURL,
        client_id: OAUTH_CONFIG.google.clientID,
        access_type: 'offline',
        response_type: 'code',
        prompt: 'consent',
        scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
    };
    res.json({ url: `${rootUrl}?${new URLSearchParams(options).toString()}` });
});

// 2. Callbacks
app.get('/api/auth/github/callback', async (req, res) => {
    const code = req.query.code;
    try {
        const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({
                client_id: OAUTH_CONFIG.github.clientID,
                client_secret: OAUTH_CONFIG.github.clientSecret,
                code,
            }),
        });
        const tokenData = await tokenRes.json();
        if (tokenData.error) throw new Error(tokenData.error_description);

        const userRes = await fetch('https://api.github.com/user', {
            headers: { Authorization: `Bearer ${tokenData.access_token}` },
        });
        const userData = await userRes.json();
        
        let email = userData.email;
        if (!email) {
            const emailRes = await fetch('https://api.github.com/user/emails', {
                headers: { Authorization: `Bearer ${tokenData.access_token}` },
            });
            const emailData = await emailRes.json();
            if (Array.isArray(emailData) && emailData.length > 0) {
                // Safe array access - check if array has elements before accessing index 0
                email = emailData.find(e => e.primary && e.verified)?.email || emailData[0]?.email;
            }
        }
        if (!email) throw new Error("No email found from GitHub");

        const { token } = processOAuthUser(email, userData.name || userData.login, 'github');

        // ✅ SECURITY: Validate redirect URL to prevent open redirect
        const redirectUrl = `${FRONTEND_URL}/login?token=${token}`;
        if (!isValidRedirectUrl(redirectUrl)) {
            console.error('[SECURITY] Invalid redirect URL detected:', redirectUrl);
            return res.status(400).json({ error: 'Invalid redirect' });
        }

        res.redirect(redirectUrl);
    } catch (err) {
        console.error(err);
        res.redirect(`${FRONTEND_URL}/login?error=GitHubAuthFailed`);
    }
});

app.get('/api/auth/google/callback', async (req, res) => {
    const code = req.query.code;
    try {
        const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                client_id: OAUTH_CONFIG.google.clientID,
                client_secret: OAUTH_CONFIG.google.clientSecret,
                code,
                grant_type: 'authorization_code',
                redirect_uri: OAUTH_CONFIG.google.callbackURL,
            }),
        });
        const tokenData = await tokenRes.json();
        if (tokenData.error) throw new Error(tokenData.error_description);

        const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: { Authorization: `Bearer ${tokenData.access_token}` },
        });
        const userData = await userRes.json();

        const { token } = processOAuthUser(userData.email, userData.name, 'google');

        // ✅ SECURITY: Validate redirect URL to prevent open redirect
        const redirectUrl = `${FRONTEND_URL}/login?token=${token}`;
        if (!isValidRedirectUrl(redirectUrl)) {
            console.error('[SECURITY] Invalid redirect URL detected:', redirectUrl);
            return res.status(400).json({ error: 'Invalid redirect' });
        }

        res.redirect(redirectUrl);
    } catch (err) {
        console.error(err);
        res.redirect(`${FRONTEND_URL}/login?error=GoogleAuthFailed`);
    }
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
    const { password: _, salt: __, ...safeUser } = req.user;
    res.json({ user: safeUser });
});

app.put('/api/auth/update', authenticateToken, (req, res) => {
    const { name, company, email, password } = req.body;
    try {
        // SECURITY: Invalidate all sessions when password changes
        if (password) {
            const passwordValidation = validatePassword(password);
            if (!passwordValidation.valid) {
                auditLog('AUTH_PASSWORD_CHANGE_FAILED', req.user.id, { ip: req.ip, reason: passwordValidation.error });
                return res.status(400).json({ error: passwordValidation.error });
            }

            const { hash, salt } = hashPassword(password);
            db.prepare('UPDATE users SET password = ?, salt = ? WHERE id = ?').run(hash, salt, req.user.id);

            // SECURITY: Invalidate all existing sessions when password changes
            db.prepare('DELETE FROM sessions WHERE user_id = ?').run(req.user.id);

            auditLog('AUTH_PASSWORD_CHANGED', req.user.id, { ip: req.ip });
        }

        if (name || company || email) {
             const updates = [];
             const values = [];

             if (name) {
                 const nameValidation = validateName(name);
                 if (!nameValidation.valid) {
                     return res.status(400).json({ error: nameValidation.error });
                 }
                 updates.push('name = ?');
                 values.push(nameValidation.sanitized);
             }

             if (company) {
                 const sanitizedCompany = sanitizeText(company.trim(), 100);
                 updates.push('company = ?');
                 values.push(sanitizedCompany);
             }

             if (email) {
                 const emailValidation = validateEmail(email);
                 if (!emailValidation.valid) {
                     return res.status(400).json({ error: emailValidation.error });
                 }
                 updates.push('email = ?');
                 values.push(emailValidation.sanitized);
             }

             if (updates.length > 0) {
                 values.push(req.user.id);
                 db.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`).run(...values);
                 auditLog('AUTH_PROFILE_UPDATED', req.user.id, { ip: req.ip, fields: updates.join(', ') });
             }
        }

        const updatedUser = db.prepare('SELECT id, name, email, role, company, referral_code FROM users WHERE id = ?').get(req.user.id);
        res.json({ user: updatedUser });
    } catch (e) {
        console.error('[AUTH] Update error:', e.message);
        auditLog('AUTH_UPDATE_ERROR', req.user.id, { ip: req.ip, error: e.message });
        res.status(500).json({ error: 'Update Failed' });
    }
});

// --- AI PROXY ENDPOINT ---
// Rate Limit: 10 chat messages per minute to conserve tokens/costs
const chatLimiter = rateLimit(CHAT_RATE_LIMIT_WINDOW_MS, CHAT_RATE_LIMIT_MAX);

app.post('/api/chat', chatLimiter, async (req, res) => {
    const { message, history } = req.body;
    
    if (!API_KEY) {
        return res.status(500).json({ error: "AI Service not configured" });
    }
    if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: "Invalid message" });
    }

    try {
        const ai = new GoogleGenAI({ apiKey: API_KEY });
        // Filter history to only include user and model roles
        const validHistory = history ? history.map(m => ({
            role: m.role,
            parts: [{ text: m.text }]
        })) : [];

        const chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: "Du bist der KI-Assistent für 'ScaleSite', ein Unternehmen für Webentwicklung von Bastian Giersch. Antworte kurz, professionell und freundlich. Dute den Nutzer. WICHTIGE FAKTEN: Preise (Projekt): Starter 99€, Business 199€, Enterprise Individuell. Preise (Service): Starter+ 19€/M, Business+ 39€/M. Tech: React, TypeScript (Kein WordPress). Kontakt: info.scalesite@gmail.com.",
            },
            history: validHistory
        });

        const result = await chat.sendMessage({ message: message });
        res.json({ text: result.text });
    } catch (error) {
        console.error("Gemini API Error:", error);
        res.status(500).json({ error: "Failed to generate response" });
    }
});

// --- SERVICE & DATA ENDPOINTS ---

app.get('/api/services', (req, res) => {
    try {
        const services = db.prepare('SELECT * FROM services').all();
        res.json(services);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.put('/api/admin/services/:id', authenticateToken, requireTeam, (req, res) => {
    const { id } = req.params;
    const { 
        name, name_en, 
        description, description_en, 
        price, sale_price, 
        price_details, price_details_en 
    } = req.body;
    
    try {
        const fields = [];
        const values = [];

        if (name !== undefined) { fields.push('name = ?'); values.push(name); }
        if (name_en !== undefined) { fields.push('name_en = ?'); values.push(name_en); }
        
        if (description !== undefined) { fields.push('description = ?'); values.push(description); }
        if (description_en !== undefined) { fields.push('description_en = ?'); values.push(description_en); }
        
        if (price !== undefined) { fields.push('price = ?'); values.push(price); }
        if (sale_price !== undefined) { fields.push('sale_price = ?'); values.push(sale_price); }
        
        if (price_details !== undefined) { fields.push('price_details = ?'); values.push(price_details); }
        if (price_details_en !== undefined) { fields.push('price_details_en = ?'); values.push(price_details_en); }

        if (fields.length === 0) return res.json({ success: true });

        values.push(id);
        const query = `UPDATE services SET ${fields.join(', ')} WHERE id = ?`;
        
        db.prepare(query).run(...values);
        
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.post('/api/user_services', authenticateToken, (req, res) => {
    const { service_id } = req.body;
    try {
        const id = uuidv4();
        db.prepare('INSERT INTO user_services (id, user_id, service_id, status, progress, created_at) VALUES (?, ?, ?, ?, ?, ?)').run(id, req.user.id, service_id, 'pending', 0, new Date().toISOString());
        
        const service = db.prepare('SELECT name FROM services WHERE id = ?').get(service_id);
        if (service) {
            const ticketId = uuidv4();
            db.prepare('INSERT INTO tickets (id, user_id, subject, status, priority, created_at, last_update) VALUES (?, ?, ?, ?, ?, ?, ?)').run(
                ticketId, req.user.id, `Buchungsanfrage: ${service.name}`, 'Offen', 'Mittel', new Date().toISOString(), new Date().toISOString()
            );
            db.prepare('INSERT INTO ticket_messages (id, ticket_id, user_id, text, created_at) VALUES (?, ?, ?, ?, ?)').run(
                uuidv4(), ticketId, 'system', `AUTOMATISCHE DIENSTANFRAGE: Der Nutzer hat das Paket "${service.name}" angefragt.`, new Date().toISOString()
            );
             db.prepare('INSERT INTO ticket_members (ticket_id, user_id, added_at) VALUES (?, ?, ?)').run(ticketId, req.user.id, new Date().toISOString());
        }

        res.json({ success: true, id });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/api/user_services', authenticateToken, (req, res) => {
    const rows = db.prepare(`
        SELECT us.*, s.name, s.description, s.price 
        FROM user_services us 
        JOIN services s ON us.service_id = s.id 
        WHERE us.user_id = ?
    `).all(req.user.id);
    
    const formatted = rows.map(row => ({
        id: row.id,
        service_id: row.service_id,
        status: row.status,
        progress: row.progress,
        created_at: row.created_at,
        services: {
            id: row.service_id,
            name: row.name,
            description: row.description,
            price: row.price
        }
    }));
    res.json(formatted);
});

// --- TICKET SYSTEM ---

app.get('/api/tickets', authenticateToken, (req, res) => {
    let query = 'SELECT * FROM tickets';
    let params = [];

    if (req.user.role !== 'team' && req.user.role !== 'owner') {
        query += ' WHERE user_id = ? OR id IN (SELECT ticket_id FROM ticket_members WHERE user_id = ?)';
        params = [req.user.id, req.user.id];
    }
    
    query += ' ORDER BY last_update DESC';
    
    const tickets = db.prepare(query).all(...params);
    
    const enrichedTickets = tickets.map(t => {
        const creator = db.prepare('SELECT name, role, company FROM users WHERE id = ?').get(t.user_id);
        return { ...t, profiles: creator };
    });

    res.json(enrichedTickets);
});

app.post('/api/tickets', authenticateToken, (req, res) => {
    const { subject, priority, message } = req.body;
    const id = uuidv4();
    const now = new Date().toISOString();

    // SECURITY: Validate and sanitize inputs
    if (!subject || typeof subject !== 'string' || subject.length > 200) {
        return res.status(400).json({ error: 'Invalid subject' });
    }

    if (!message || typeof message !== 'string' || message.length > 10000) {
        return res.status(400).json({ error: 'Invalid message' });
    }

    if (!priority || !['Niedrig', 'Mittel', 'Hoch'].includes(priority)) {
        return res.status(400).json({ error: 'Invalid priority' });
    }

    // SECURITY: Sanitize to prevent stored XSS
    const sanitizedSubject = sanitizeText(subject.trim(), 200);
    const sanitizedMessage = sanitizeText(message.trim(), 10000);

    if (!sanitizedSubject) {
        return res.status(400).json({ error: 'Subject cannot be empty' });
    }

    if (!sanitizedMessage) {
        return res.status(400).json({ error: 'Message cannot be empty' });
    }

    const createTicket = db.transaction(() => {
        db.prepare('INSERT INTO tickets (id, user_id, subject, status, priority, created_at, last_update) VALUES (?, ?, ?, ?, ?, ?, ?)').run(id, req.user.id, sanitizedSubject, 'Offen', priority, now, now);
        db.prepare('INSERT INTO ticket_messages (id, ticket_id, user_id, text, created_at) VALUES (?, ?, ?, ?, ?)').run(uuidv4(), id, req.user.id, sanitizedMessage, now);
        db.prepare('INSERT INTO ticket_members (ticket_id, user_id, added_at) VALUES (?, ?, ?)').run(id, req.user.id, now);
    });

    try {
        createTicket();
        auditLog('TICKET_CREATED', req.user.id, { ip: req.ip, ticket_id: id, subject: sanitizedSubject });
        res.json({ success: true, id });
    } catch (e) {
        console.error('[TICKET] Creation error:', e.message);
        auditLog('TICKET_CREATE_ERROR', req.user.id, { ip: req.ip, error: e.message });
        res.status(500).json({ error: 'Failed to create ticket' });
    }
});

app.get('/api/tickets/:id/messages', authenticateToken, (req, res) => {
    const ticket = db.prepare('SELECT * FROM tickets WHERE id = ?').get(req.params.id);
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
    
    const isMember = db.prepare('SELECT 1 FROM ticket_members WHERE ticket_id = ? AND user_id = ?').get(req.params.id, req.user.id);
    if (ticket.user_id !== req.user.id && !isMember && req.user.role === 'user') {
         return res.sendStatus(403);
    }

    const messages = db.prepare('SELECT * FROM ticket_messages WHERE ticket_id = ? ORDER BY created_at ASC').all(req.params.id);
    
    const enrichedMessages = messages.map(m => {
        const author = db.prepare('SELECT name, role FROM users WHERE id = ?').get(m.user_id);
        return { ...m, profiles: author };
    });
    
    res.json(enrichedMessages);
});

app.post('/api/tickets/:id/reply', authenticateToken, (req, res) => {
    const { text } = req.body;
    const now = new Date().toISOString();

    // SECURITY: Validate and sanitize input
    if (!text || typeof text !== 'string' || text.length > 10000) {
        return res.status(400).json({ error: 'Invalid message' });
    }

    const sanitizedText = sanitizeText(text.trim(), 10000);
    if (!sanitizedText) {
        return res.status(400).json({ error: 'Message cannot be empty' });
    }

    const reply = db.transaction(() => {
        db.prepare('INSERT INTO ticket_messages (id, ticket_id, user_id, text, created_at) VALUES (?, ?, ?, ?, ?)').run(uuidv4(), req.params.id, req.user.id, sanitizedText, now);
        db.prepare('UPDATE tickets SET last_update = ?, status = ? WHERE id = ?').run(now, req.user.role === 'team' || req.user.role === 'owner' ? 'In Bearbeitung' : 'Offen', req.params.id);
    });

    try {
        reply();
        auditLog('TICKET_REPLY', req.user.id, { ip: req.ip, ticket_id: req.params.id });
        res.json({ success: true });
    } catch (e) {
        console.error('[TICKET] Reply error:', e.message);
        auditLog('TICKET_REPLY_ERROR', req.user.id, { ip: req.ip, ticket_id: req.params.id, error: e.message });
        res.status(500).json({ error: 'Failed to post reply' });
    }
});

app.get('/api/tickets/:id/members', authenticateToken, (req, res) => {
     const members = db.prepare(`
        SELECT u.id, u.name, u.email, u.role, tm.added_at 
        FROM ticket_members tm
        JOIN users u ON tm.user_id = u.id
        WHERE tm.ticket_id = ?
    `).all(req.params.id);
    res.json(members);
});

app.post('/api/tickets/:id/invite', authenticateToken, (req, res) => {
    const { email } = req.body;
    try {
        const userToAdd = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
        if (!userToAdd) return res.status(404).json({ error: 'Nutzer nicht gefunden' });
        
        const existing = db.prepare('SELECT 1 FROM ticket_members WHERE ticket_id = ? AND user_id = ?').get(req.params.id, userToAdd.id);
        if (existing) return res.status(400).json({ error: 'Bereits Mitglied' });

        db.prepare('INSERT INTO ticket_members (ticket_id, user_id, added_at) VALUES (?, ?, ?)').run(req.params.id, userToAdd.id, new Date().toISOString());
        
        db.prepare('INSERT INTO ticket_messages (id, ticket_id, user_id, text, created_at) VALUES (?, ?, ?, ?, ?)').run(
            uuidv4(), req.params.id, 'system', `SYSTEM: ${req.user.name} hat ${email} hinzugefügt.`, new Date().toISOString()
        );

        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// --- ADMIN ENDPOINTS ---

app.get('/api/admin/users', authenticateToken, requireTeam, (req, res) => {
    const users = db.prepare('SELECT id, name, email, role, company, created_at FROM users').all();
    res.json(users);
});

app.put('/api/admin/users/:id/role', authenticateToken, requireTeam, (req, res) => {
    if (req.user.role !== 'owner') return res.sendStatus(403);
    const { role } = req.body;
    db.prepare('UPDATE users SET role = ? WHERE id = ?').run(role, req.params.id);
    res.json({ success: true });
});

app.get('/api/admin/user_services/:userId', authenticateToken, requireTeam, (req, res) => {
    // OPTIMIZED: Join updates directly in SQL or fetch in a batch to avoid N+1
    const rows = db.prepare(`
        SELECT us.*, s.name, s.description, s.price 
        FROM user_services us 
        JOIN services s ON us.service_id = s.id 
        WHERE us.user_id = ?
    `).all(req.params.userId);

    // Batch fetch updates for all these services
    const serviceIds = rows.map(r => r.id);
    let allUpdates = [];
    if (serviceIds.length > 0) {
        allUpdates = db.prepare(`
            SELECT * FROM service_updates 
            WHERE user_service_id IN (${serviceIds.map(() => '?').join(',')}) 
            ORDER BY created_at DESC
        `).all(...serviceIds);
    }

    // Map updates back to services in memory
    const services = rows.map(row => {
        const updates = allUpdates.filter(u => u.user_service_id === row.id);
        return { ...row, updates };
    });
    
    res.json(services);
});

app.put('/api/admin/user_services/:id', authenticateToken, requireTeam, (req, res) => {
    const { status, progress } = req.body;
    db.prepare('UPDATE user_services SET status = ?, progress = ? WHERE id = ?').run(status, progress, req.params.id);
    res.json({ success: true });
});

app.post('/api/admin/user_services/:id/updates', authenticateToken, requireTeam, (req, res) => {
    const { message } = req.body;
    db.prepare('INSERT INTO service_updates (id, user_service_id, message, author_id, created_at) VALUES (?, ?, ?, ?, ?)').run(
        uuidv4(), req.params.id, message, req.user.id, new Date().toISOString()
    );
    res.json({ success: true });
});

app.post('/api/admin/services/assign', authenticateToken, requireTeam, (req, res) => {
    const { userId, serviceId, customService } = req.body;
    
    try {
        let finalServiceId = serviceId;

        if (customService) {
             const result = db.prepare('INSERT INTO services (name, description, price, price_details) VALUES (?, ?, ?, ?)').run(
                 customService.name, customService.description, customService.price, customService.price_details || 'einmalig'
             );
             finalServiceId = result.lastInsertRowid; 
        }

        const id = uuidv4();
        db.prepare('INSERT INTO user_services (id, user_id, service_id, status, progress, created_at) VALUES (?, ?, ?, ?, ?, ?)').run(
            id, userId, finalServiceId, 'active', 0, new Date().toISOString()
        );
        
        const srv = db.prepare('SELECT name, price FROM services WHERE id = ?').get(finalServiceId);
        if (srv) {
             db.prepare('INSERT INTO transactions (id, user_id, amount, date, due_date, status, description) VALUES (?, ?, ?, ?, ?, ?, ?)').run(
                 uuidv4(), userId, srv.price, new Date().toISOString(), new Date(Date.now() + 14*24*60*60*1000).toISOString(), 'Offen', `Service: ${srv.name}`
             );
        }

        res.json({ success: true });
    } catch(e) {
        res.status(500).json({ error: e.message });
    }
});

app.post('/api/admin/tickets/:id/assign-service', authenticateToken, requireTeam, (req, res) => {
    const { serviceId } = req.body;
    const ticket = db.prepare('SELECT user_id FROM tickets WHERE id = ?').get(req.params.id);
    
    if (!ticket) return res.status(404).json({ error: "Ticket not found" });

    try {
         const id = uuidv4();
         db.prepare('INSERT INTO user_services (id, user_id, service_id, status, progress, created_at) VALUES (?, ?, ?, ?, ?, ?)').run(
            id, ticket.user_id, serviceId, 'active', 0, new Date().toISOString()
         );
         const srv = db.prepare('SELECT name, price FROM services WHERE id = ?').get(serviceId);
         if (srv) {
             db.prepare('INSERT INTO transactions (id, user_id, amount, date, due_date, status, description) VALUES (?, ?, ?, ?, ?, ?, ?)').run(
                 uuidv4(), ticket.user_id, srv.price, new Date().toISOString(), new Date(Date.now() + 14*24*60*60*1000).toISOString(), 'Offen', `Service: ${srv.name}`
             );
             
             db.prepare('INSERT INTO ticket_messages (id, ticket_id, user_id, text, created_at) VALUES (?, ?, ?, ?, ?)').run(
                 uuidv4(), req.params.id, 'system', `SYSTEM: Service "${srv.name}" wurde kostenpflichtig gebucht. Rechnung erstellt.`, new Date().toISOString()
             );
         }
         res.json({ success: true });
    } catch(e) {
         res.status(500).json({ error: e.message });
    }
});

// --- ANALYTICS & STATS ---

app.get('/api/stats', authenticateToken, (req, res) => {
    try {
        const ticketCount = db.prepare('SELECT COUNT(*) as count FROM tickets WHERE user_id = ? AND status != "Geschlossen"').get(req.user.id).count;
        const serviceCount = db.prepare('SELECT COUNT(*) as count FROM user_services WHERE user_id = ? AND status = "active"').get(req.user.id).count;
        res.json({ ticketCount, serviceCount });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/api/admin/analytics', authenticateToken, requireTeam, (req, res) => {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    
    const totalSessions = db.prepare('SELECT COUNT(DISTINCT session_id) as c FROM analytics_events').get().c;
    const sessionsToday = db.prepare('SELECT COUNT(DISTINCT session_id) as c FROM analytics_events WHERE timestamp > ?').get(now - oneDay).c;
    const sessionsYesterday = db.prepare('SELECT COUNT(DISTINCT session_id) as c FROM analytics_events WHERE timestamp > ? AND timestamp < ?').get(now - 2*oneDay, now - oneDay).c;
    const sessionsWeek = db.prepare('SELECT COUNT(DISTINCT session_id) as c FROM analytics_events WHERE timestamp > ?').get(now - 7*oneDay).c;

    const topPages = db.prepare('SELECT path, COUNT(*) as views FROM analytics_events WHERE type="pageview" GROUP BY path ORDER BY views DESC LIMIT 5').all();
    const clicks = db.prepare('SELECT element, path, COUNT(*) as clicks FROM analytics_events WHERE type="click" GROUP BY element, path ORDER BY clicks DESC LIMIT 10').all();

    const chartData = [];
    for (let i=6; i>=0; i--) {
        const dayStart = now - (i+1)*oneDay;
        const dayEnd = now - i*oneDay;
        const count = db.prepare('SELECT COUNT(*) as c FROM analytics_events WHERE type="pageview" AND timestamp > ? AND timestamp < ?').get(dayStart, dayEnd).c;
        chartData.push(count);
    }

    res.json({
        visitorStats: {
            today: sessionsToday,
            yesterday: sessionsYesterday,
            lastWeek: sessionsWeek,
            total: totalSessions
        },
        pageViews: topPages.map(p => ({ name: p.path === '/' ? 'Home' : p.path.replace('/',''), path: p.path, views: p.views })),
        clickHeatmap: clicks,
        chartData: chartData
    });
});

// SECURITY: Add rate limiting to analytics event endpoint to prevent abuse
const analyticsEventLimiter = rateLimit(60 * 1000, 50); // 50 events per minute per IP

app.post('/api/analytics/event', analyticsEventLimiter, (req, res) => {
    const { sessionId, type, path, element, timestamp } = req.body;
    try {
        db.prepare('INSERT INTO analytics_events (id, session_id, type, path, element, timestamp) VALUES (?, ?, ?, ?, ?, ?)').run(
            uuidv4(), sessionId, type, path, element || null, timestamp
        );
        res.json({ success: true });
    } catch(e) {
        res.json({ success: false });
    }
});

// --- OTHER FEATURES ---

app.post('/api/contact', (req, res) => {
    const { name, email, subject, message } = req.body;

    // SECURITY: Validate and sanitize all inputs
    const nameValidation = validateName(name);
    if (!nameValidation.valid) {
        return res.status(400).json({ error: nameValidation.error });
    }

    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
        return res.status(400).json({ error: emailValidation.error });
    }

    if (!subject || typeof subject !== 'string' || subject.length > 200) {
        return res.status(400).json({ error: 'Invalid subject' });
    }

    if (!message || typeof message !== 'string' || message.length > 5000) {
        return res.status(400).json({ error: 'Invalid message' });
    }

    const sanitizedSubject = sanitizeText(subject.trim(), 200);
    const sanitizedMessage = sanitizeText(message.trim(), 5000);

    if (!sanitizedSubject || !sanitizedMessage) {
        return res.status(400).json({ error: 'Subject and message are required' });
    }

    try {
        db.prepare('INSERT INTO contact_messages (id, name, email, subject, message, created_at) VALUES (?, ?, ?, ?, ?, ?)').run(
            uuidv4(), nameValidation.sanitized, emailValidation.sanitized, sanitizedSubject, sanitizedMessage, new Date().toISOString()
        );
        auditLog('CONTACT_FORM_SUBMITTED', null, { ip: req.ip, email: emailValidation.sanitized });
        res.json({ success: true });
    } catch (e) {
        console.error('[CONTACT] Submission error:', e.message);
        res.status(500).json({ error: 'Failed to submit message' });
    }
});

app.post('/api/newsletter/subscribe', (req, res) => {
    const { name, email } = req.body;

    // SECURITY: Validate inputs
    if (name) {
        const nameValidation = validateName(name);
        if (!nameValidation.valid) {
            return res.status(400).json({ error: nameValidation.error });
        }
    }

    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
        return res.status(400).json({ error: emailValidation.error });
    }

    try {
        db.prepare('INSERT INTO newsletter_subscribers (id, name, email, created_at) VALUES (?, ?, ?, ?)').run(
            uuidv4(), name ? validateName(name).sanitized : null, emailValidation.sanitized, new Date().toISOString()
        );
        auditLog('NEWSLETTER_SUBSCRIBE', null, { ip: req.ip, email: emailValidation.sanitized });
        res.json({ success: true });
    } catch (e) {
        if (e.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            return res.json({ success: true });
        }
        console.error('[NEWSLETTER] Subscribe error:', e.message);
        res.status(500).json({ error: 'Failed to subscribe' });
    }
});

app.get('/api/transactions', authenticateToken, (req, res) => {
    const trans = db.prepare('SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC').all(req.user.id);
    res.json(trans);
});

app.get('/api/team_chat', authenticateToken, requireTeam, (req, res) => {
    const msgs = db.prepare('SELECT m.*, u.name, u.role FROM team_chat_messages m JOIN users u ON m.user_id = u.id ORDER BY m.created_at ASC LIMIT ?').all(TEAM_CHAT_MESSAGE_LIMIT);
    const formatted = msgs.map(m => ({
        id: m.id, user_id: m.user_id, content: m.content, created_at: m.created_at, profiles: { name: m.name, role: m.role }
    }));
    res.json(formatted);
});

app.post('/api/team_chat', authenticateToken, requireTeam, (req, res) => {
    const { content } = req.body;

    // SECURITY: Validate and sanitize input
    if (!content || typeof content !== 'string' || content.length > 5000) {
        return res.status(400).json({ error: 'Invalid message' });
    }

    const sanitizedContent = sanitizeText(content.trim(), 5000);
    if (!sanitizedContent) {
        return res.status(400).json({ error: 'Message cannot be empty' });
    }

    try {
        db.prepare('INSERT INTO team_chat_messages (id, user_id, content, created_at) VALUES (?, ?, ?, ?)').run(
            uuidv4(), req.user.id, sanitizedContent, new Date().toISOString()
        );
        auditLog('TEAM_CHAT_MESSAGE', req.user.id, { ip: req.ip });
        res.json({ success: true });
    } catch (e) {
        console.error('[TEAM_CHAT] Post error:', e.message);
        res.status(500).json({ error: 'Failed to post message' });
    }
});

app.get('/api/admin/tables', authenticateToken, requireTeam, (req, res) => {
    if (req.user.role !== 'owner') return res.sendStatus(403);
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    const meta = tables.map(t => {
        const count = db.prepare(`SELECT COUNT(*) as c FROM ${t.name}`).get().c;
        const cols = db.prepare(`PRAGMA table_info(${t.name})`).all().length;
        return { name: t.name, rows: count, columns: cols, size: 'N/A' };
    });
    res.json(meta);
});

app.get('/api/admin/table/:name', authenticateToken, requireTeam, (req, res) => {
    if (req.user.role !== 'owner') return res.sendStatus(403);
    const { name } = req.params;

    // SECURITY: Whitelist of allowed tables to prevent SQL injection
    const allowedTables = ['users', 'services', 'user_services', 'tickets', 'subscriptions', 'invoices', 'payments', 'discounts', 'transactions'];

    if (!allowedTables.includes(name)) {
         return res.status(400).json({ error: "Invalid table name" });
    }

    try {
        const rows = db.prepare(`SELECT * FROM "${name}" LIMIT 50`).all();
        res.json(rows);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/api/admin/discounts', authenticateToken, requireTeam, (req, res) => {
    const codes = db.prepare('SELECT * FROM discounts').all();
    res.json(codes);
});

app.post('/api/admin/discounts', authenticateToken, requireTeam, (req, res) => {
    const { code, type, value } = req.body;
    try {
        db.prepare('INSERT INTO discounts (id, code, type, value, created_at) VALUES (?, ?, ?, ?, ?)').run(
            uuidv4(), code, type, value, new Date().toISOString()
        );
        res.json({ success: true });
    } catch(e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/admin/discounts/:id', authenticateToken, requireTeam, (req, res) => {
    db.prepare('DELETE FROM discounts WHERE id = ?').run(req.params.id);
    res.json({ success: true });
});

app.get('/api/blog', (req, res) => {
    db.exec(`CREATE TABLE IF NOT EXISTS blog_posts (
        id TEXT PRIMARY KEY,
        title TEXT,
        excerpt TEXT,
        content TEXT,
        category TEXT,
        image_url TEXT,
        author_name TEXT,
        created_at TEXT
    )`);
    const posts = db.prepare('SELECT * FROM blog_posts ORDER BY created_at DESC').all();
    res.json(posts);
});

app.post('/api/blog', authenticateToken, requireTeam, (req, res) => {
    const { title, excerpt, content, category, image_url } = req.body;

    // SECURITY: Validate and sanitize inputs
    if (!title || typeof title !== 'string' || title.length > 200) {
        return res.status(400).json({ error: 'Invalid title' });
    }

    if (!content || typeof content !== 'string' || content.length > 50000) {
        return res.status(400).json({ error: 'Invalid content' });
    }

    if (excerpt && (typeof excerpt !== 'string' || excerpt.length > 500)) {
        return res.status(400).json({ error: 'Invalid excerpt' });
    }

    if (category && (typeof category !== 'string' || category.length > 50)) {
        return res.status(400).json({ error: 'Invalid category' });
    }

    if (image_url) {
        const urlValidation = validateUrl(image_url);
        if (!urlValidation.valid) {
            return res.status(400).json({ error: urlValidation.error });
        }
    }

    const sanitizedTitle = sanitizeText(title.trim(), 200);
    const sanitizedContent = sanitizeText(content.trim(), 50000);
    const sanitizedExcerpt = excerpt ? sanitizeText(excerpt.trim(), 500) : null;
    const sanitizedCategory = category ? sanitizeText(category.trim(), 50) : null;
    const sanitizedImageUrl = image_url ? validateUrl(image_url).sanitized : null;

    if (!sanitizedTitle || !sanitizedContent) {
        return res.status(400).json({ error: 'Title and content are required' });
    }

    const id = uuidv4();
    try {
        db.prepare('INSERT INTO blog_posts (id, title, excerpt, content, category, image_url, author_name, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').run(
            id, sanitizedTitle, sanitizedExcerpt, sanitizedContent, sanitizedCategory, sanitizedImageUrl, req.user.name, new Date().toISOString()
        );
        auditLog('BLOG_POST_CREATED', req.user.id, { ip: req.ip, post_id: id, title: sanitizedTitle });
        res.json({ success: true });
    } catch (e) {
        console.error('[BLOG] Creation error:', e.message);
        auditLog('BLOG_CREATE_ERROR', req.user.id, { ip: req.ip, error: e.message });
        res.status(500).json({ error: 'Failed to create blog post' });
    }
});

app.put('/api/blog/:id', authenticateToken, requireTeam, (req, res) => {
    const { title, excerpt, content, category, image_url } = req.body;

    // SECURITY: Validate and sanitize inputs
    if (title && (typeof title !== 'string' || title.length > 200)) {
        return res.status(400).json({ error: 'Invalid title' });
    }

    if (content && (typeof content !== 'string' || content.length > 50000)) {
        return res.status(400).json({ error: 'Invalid content' });
    }

    if (excerpt && (typeof excerpt !== 'string' || excerpt.length > 500)) {
        return res.status(400).json({ error: 'Invalid excerpt' });
    }

    if (category && (typeof category !== 'string' || category.length > 50)) {
        return res.status(400).json({ error: 'Invalid category' });
    }

    if (image_url) {
        const urlValidation = validateUrl(image_url);
        if (!urlValidation.valid) {
            return res.status(400).json({ error: urlValidation.error });
        }
    }

    const sanitizedTitle = title ? sanitizeText(title.trim(), 200) : null;
    const sanitizedContent = content ? sanitizeText(content.trim(), 50000) : null;
    const sanitizedExcerpt = excerpt ? sanitizeText(excerpt.trim(), 500) : null;
    const sanitizedCategory = category ? sanitizeText(category.trim(), 50) : null;
    const sanitizedImageUrl = image_url ? validateUrl(image_url).sanitized : null;

    try {
        db.prepare('UPDATE blog_posts SET title=?, excerpt=?, content=?, category=?, image_url=? WHERE id=?').run(
            sanitizedTitle, sanitizedExcerpt, sanitizedContent, sanitizedCategory, sanitizedImageUrl, req.params.id
        );
        auditLog('BLOG_POST_UPDATED', req.user.id, { ip: req.ip, post_id: req.params.id });
        res.json({ success: true });
    } catch (e) {
        console.error('[BLOG] Update error:', e.message);
        auditLog('BLOG_UPDATE_ERROR', req.user.id, { ip: req.ip, post_id: req.params.id, error: e.message });
        res.status(500).json({ error: 'Failed to update blog post' });
    }
});

app.delete('/api/blog/:id', authenticateToken, requireTeam, (req, res) => {
    db.prepare('DELETE FROM blog_posts WHERE id=?').run(req.params.id);
    res.json({ success: true });
});

// Increase limit specifically for this route
app.post('/api/files', authenticateToken, express.json({ limit: '50mb' }), (req, res) => {
    const { name, size, type, data } = req.body;

    // SECURITY: Validate file upload
    if (!name || typeof name !== 'string') {
        return res.status(400).json({ error: 'Invalid file name' });
    }

    if (!size || typeof size !== 'number' || size <= 0 || size > 50 * 1024 * 1024) {
        return res.status(400).json({ error: 'Invalid file size' });
    }

    if (!type || typeof type !== 'string') {
        return res.status(400).json({ error: 'Invalid file type' });
    }

    // SECURITY: Block dangerous file types
    const dangerousTypes = [
        'application/x-msdownload',
        'application/x-msdos-program',
        'application/x-executable',
        'application/exe',
        'application/x-exe',
        'application/x-sh',
        'application/x-shellscript',
        'application/x-python',
        'text/x-php',
        'application/x-javascript'
    ];

    const normalizedType = type.toLowerCase();
    if (dangerousTypes.includes(normalizedType)) {
        return res.status(400).json({ error: 'Dangerous file type blocked' });
    }

    // SECURITY: Sanitize filename
    const sanitizedName = name
        .replace(/[<>:"|?*]/g, '')  // Remove dangerous chars
        .replace(/\.\./g, '')        // Remove path traversal
        .replace(/\\/g, '')          // Remove backslashes
        .replace(/\//g, '')          // Remove forward slashes
        .trim()
        .substring(0, 255);          // Limit length

    if (!sanitizedName) {
        return res.status(400).json({ error: 'Invalid file name after sanitization' });
    }

    const id = uuidv4();
    db.prepare('INSERT INTO files (id, user_id, name, size, type, data, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)').run(
        id, req.user.id, sanitizedName, size, type, data, new Date().toISOString()
    );
    res.json({ success: true });
});

app.get('/api/files', authenticateToken, (req, res) => {
    const files = db.prepare('SELECT id, user_id, name, size, type, created_at FROM files WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id);
    res.json(files);
});

app.get('/api/files/:id/content', authenticateToken, (req, res) => {
    const file = db.prepare('SELECT data FROM files WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
    if (!file) return res.status(404).json({ error: 'File not found' });
    res.json({ data: file.data });
});

app.delete('/api/files/:id', authenticateToken, (req, res) => {
    db.prepare('DELETE FROM files WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);
    res.json({ success: true });
});

app.get('/api/referrals/stats', authenticateToken, (req, res) => {
    if(!req.user.referral_code) return res.json({ count: 0 });
    res.json({ count: 0 }); 
});

app.get('/api/team/tasks', authenticateToken, requireTeam, (req, res) => {
    db.exec(`CREATE TABLE IF NOT EXISTS team_tasks (
        id TEXT PRIMARY KEY,
        column_id TEXT,
        title TEXT,
        client_name TEXT,
        priority TEXT,
        created_at TEXT
    )`);
    const tasks = db.prepare('SELECT * FROM team_tasks ORDER BY created_at DESC').all();
    res.json(tasks);
});

app.post('/api/team/tasks', authenticateToken, requireTeam, (req, res) => {
    const { title, client_name, priority } = req.body;
    const id = uuidv4();
    db.prepare('INSERT INTO team_tasks (id, column_id, title, client_name, priority, created_at) VALUES (?, ?, ?, ?, ?, ?)').run(
        id, 'todo', title, client_name, priority, new Date().toISOString()
    );
    res.json({ success: true });
});

app.put('/api/team/tasks/:id', authenticateToken, requireTeam, (req, res) => {
    const { column_id, title, client_name, priority } = req.body;
    const updates = [];
    const values = [];
    if (column_id) { updates.push('column_id = ?'); values.push(column_id); }
    if (title) { updates.push('title = ?'); values.push(title); }
    if (client_name) { updates.push('client_name = ?'); values.push(client_name); }
    if (priority) { updates.push('priority = ?'); values.push(priority); }
    
    if (updates.length > 0) {
        values.push(req.params.id);
        db.prepare(`UPDATE team_tasks SET ${updates.join(', ')} WHERE id = ?`).run(...values);
    }
    res.json({ success: true });
});

app.delete('/api/team/tasks/:id', authenticateToken, requireTeam, (req, res) => {
    db.prepare('DELETE FROM team_tasks WHERE id = ?').run(req.params.id);
    res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
