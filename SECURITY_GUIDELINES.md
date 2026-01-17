# 🔒 SECURITY GUIDELINES
## Best Practices for ScaleSite Development

**Last Updated:** 2026-01-17
**Version:** 1.0
**Compliance:** OWASP Top 10 2021

---

## 🚨 CRITICAL RULES (NEVER VIOLATE)

### 1. NEVER Commit API Keys or Secrets
```bash
# ❌ WRONG - This will be committed to git
GEMINI_API_KEY=AIzaSyActualApiKeyHere

# ✅ CORRECT - Use environment variables
const apiKey = Deno.env.get('GEMINI_API_KEY'); // Server-side
const pubKey = import.meta.env.VITE_PUBLIC_KEY; // Client-side
```

**Why:** Committed secrets are visible to anyone with repository access and cannot be fully removed from git history.

**What to do instead:**
1. Create `.env.local` for local development (already in `.gitignore`)
2. Use environment variables in production (Vercel/Supabase secrets)
3. Never write secrets in code or documentation

---

### 2. ALWAYS Validate User Input
```typescript
// ❌ WRONG - Unvalidated user input
const email = formData.get('email') as string;
await api.sendEmail(email);

// ✅ CORRECT - Validate before using
const emailValidation = validateEmail(rawEmail);
if (!emailValidation.isValid) {
    setError('Invalid email');
    return;
}
await api.sendEmail(emailValidation.sanitized);
```

**Available validators in `lib/validation.ts`:**
- `validateEmail()` - RFC 5322 compliant
- `validateURL()` - Blocks javascript:, data:, etc.
- `validateString()` - Length limits + dangerous content
- `validateNumber()` - Min/max constraints
- `validateContent()` - HTML sanitization

**Why:** Input validation prevents XSS, SQL injection, and injection attacks (OWASP A03:2021).

---

### 3. NEVER Use User Input Directly in HTML
```typescript
// ❌ WRONG - XSS vulnerability
<div>{userInput}</div>
<a href={userUrl}>Click</a>

// ✅ CORRECT - Use safe rendering
<div>{sanitizeString(userInput)}</div>
<a href={getSafeURL(userUrl)}>Click</a>

// ⚠️ ONLY WITH SANITIZATION
<div dangerouslySetInnerHTML={{
    __html: validateContent(userInput, {
        allowHTML: true,
        sanitizeHTML: true
    }).sanitized
}} />
```

**Why:** Unsanitized user input can execute malicious JavaScript (XSS attacks).

**Exception:** Newsletter preview in `components/newsletter/EmailPreview.tsx` - properly sanitized.

---

### 4. ALWAYS Use Safe URL Validation
```typescript
// ❌ WRONG - javascript: URLs can execute code
<a href={userProvidedUrl}>Click</a>

// ✅ CORRECT - Use getSafeURL wrapper
<a href={getSafeURL(userProvidedUrl)}>Click</a>
```

**What `getSafeURL()` blocks:**
- `javascript:`, `vbscript:`, `data:` protocols
- URLs with embedded credentials (`user:pass@host`)
- URLs with event handlers (`onclick=`, `onload=`)

**Why:** Prevents XSS via `javascript:` URLs (OWASP A03:2021).

---

## 📋 DAILY SECURITY CHECKLIST

### Before Committing Code
- [ ] No API keys, secrets, or passwords in code
- [ ] All user inputs validated using `lib/validation.ts`
- [ ] No new `dangerouslySetInnerHTML` usage (unless absolutely necessary)
- [ ] All URLs validated with `getSafeURL()`
- [ ] Error messages don't leak sensitive information
- [ ] No hardcoded credentials or paths

### Before Deploying
- [ ] Environment variables configured in Vercel/Supabase
- [ ] No `.env` files committed to git
- [ ] API keys rotated if leaked
- [ ] Dependencies updated (`npm audit`)
- [ ] Security tests pass

---

## 🔐 API KEY MANAGEMENT

### Client-Side Keys (VITE_*)
```bash
# .env.local (local development only - never commit)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your-key
```

**Rules:**
- ✅ Safe to expose (public keys)
- ✅ Use `VITE_` prefix
- ✅ Limited scope (anon keys, publishable keys)
- ❌ Never include secret keys

### Server-Side Keys (Edge Functions)
```bash
# Set via Supabase CLI (never in .env files)
supabase secrets set GEMINI_API_KEY=your-secret-key
supabase secrets set STRIPE_SECRET_KEY=sk_live_your-key
```

**Rules:**
- ✅ Use `Deno.env.get()` in Edge Functions
- ✅ Never log or expose to client
- ✅ Rotate quarterly or if leaked
- ❌ Never commit to git

---

## 🛡️ INPUT VALIDATION PATTERNS

### Form Submission
```typescript
const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Extract raw input
    const rawEmail = formData.get('email') as string;
    const rawMessage = formData.get('message') as string;

    // 2. Validate using lib/validation.ts
    const emailValidation = validateEmail(rawEmail);
    const messageValidation = validateString(rawMessage, {
        minLength: 10,
        maxLength: 5000
    });

    // 3. Check validation results
    if (!emailValidation.isValid || !messageValidation.isValid) {
        setError('Invalid input');
        return;
    }

    // 4. Use SANITIZED values
    await api.sendContact(
        emailValidation.sanitized,
        messageValidation.sanitized
    );
};
```

### URL Handling
```typescript
// ❌ WRONG
<a href={project.website}>Visit</a>

// ✅ CORRECT
<a href={getSafeURL(project.website)}>Visit</a>

// ✅ CORRECT with fallback
const safeUrl = getSafeURL(userUrl);
<a href={safeUrl || '#'}>
    {safeUrl ? 'Visit' : 'Invalid URL'}
</a>
```

---

## 🔒 SESSION SECURITY

### Inactivity Timeout
The application automatically logs out users after **30 minutes** of inactivity (OWASP recommendation).

**Configuration:** `lib/sessionSecurity.ts:13`
```typescript
const SESSION_CONFIG = {
  INACTIVITY_TIMEOUT_MS: 30 * 60 * 1000, // 30 minutes
  WARNING_TIMEOUT_MS: 25 * 60 * 1000,    // 5 min before logout
  CHECK_INTERVAL_MS: 30 * 1000,          // Check every 30s
};
```

**Manual reset** (if user performs activity):
```typescript
import { resetSessionSecurity } from '@/lib/sessionSecurity';

// Call after important user actions
resetSessionSecurity();
```

---

## 🚫 FORBIDDEN PATTERNS

### ❌ NEVER DO THIS
```typescript
// 1. Hardcoded secrets
const apiKey = 'AIzaSyActualKeyHere'; // ❌

// 2. Unvalidated user input
db.query(`SELECT * FROM users WHERE email = '${userInput}'`); // ❌

// 3. Direct HTML rendering
<div dangerouslySetInnerHTML={{ __html: userInput }} /> // ❌

// 4. Error messages with sensitive data
throw new Error(`Database error: ${err.message}`); // ❌

// 5. Storing tokens in localStorage
localStorage.setItem('token', userToken); // ❌

// 6. Disabled validation for "convenience"
const validateEmail = () => true; // ❌
```

### ✅ ALWAYS DO THIS INSTEAD
```typescript
// 1. Use environment variables
const apiKey = Deno.env.get('GEMINI_API_KEY'); // ✅

// 2. Use parameterized queries
db.query('SELECT * FROM users WHERE email = ?', [validatedEmail]); // ✅

// 3. Use React's safe rendering
<div>{escapeHtml(userInput)}</div> // ✅

// 4. Generic error messages
throw new Error('An error occurred. Please try again.'); // ✅

// 5. Use secure token storage (Supabase handles this)
await supabase.auth.setSession({ access_token, refresh_token }); // ✅

// 6. Never disable validation
const emailValidation = validateEmail(rawEmail); // ✅
```

---

## 🔍 SECURITY AUDIT CHECKLIST

Use this checklist when reviewing code or conducting security audits:

### Input Validation (OWASP A03:2021)
- [ ] All forms use validators from `lib/validation.ts`
- [ ] Email validation uses `validateEmail()`
- [ ] URLs use `getSafeURL()` or `validateURL()`
- [ ] String inputs have length limits
- [ ] Numbers have min/max constraints

### XSS Prevention (OWASP A03:2021)
- [ ] No `dangerouslySetInnerHTML` without sanitization
- [ ] User content never rendered directly as HTML
- [ ] HTML content sanitized with `validateContent()`
- [ ] No `javascript:` URLs in href/src attributes

### Authentication (OWASP A01:2021, A07:2021)
- [ ] Protected pages use `<ProtectedRoute>`
- [ ] Role-based access control (requireTeam, requireRole)
- [ ] Session timeout active (30 minutes)
- [ ] Security logging for unauthorized attempts

### API Security (OWASP A05:2021)
- [ ] API keys stored server-side (Deno.env)
- [ ] No secrets in client-side code
- [ ] Error messages don't leak information
- [ ] Rate limiting on expensive operations

### Secret Management (OWASP A05:2021)
- [ ] No `.env` files in git
- [ ] `.gitignore` blocks all `.env*` files
- [ ] Production secrets in Vercel/Supabase
- [ ] API keys rotated if leaked

---

## 🚨 INCIDENT RESPONSE

### If API Keys Are Leaked
1. **IMMEDIATE:** Revoke the leaked keys
2. **Generate new keys** with restricted scope
3. **Update environment variables** in Vercel/Supabase
4. **Clean git history** (BFG Repo-Cleaner or git-filter-repo)
5. **Rotate keys quarterly** or after any suspected leak

### If Security Vulnerability Found
1. **Stop deployment** if not yet released
2. **Assess severity** (CVSS score)
3. **Fix immediately** for critical/high severity
4. **Test thoroughly** before deploying
5. **Document the fix** in security audit reports

---

## 📚 RESOURCES

### Internal Documentation
- `lib/validation.ts` - Complete validation library
- `lib/ProtectedRoute.tsx` - Route protection
- `lib/sessionSecurity.ts` - Session management
- `PHASE4_LOOP1_SECURITY_AUDIT_FINAL.md` - Latest audit

### External Resources
- [OWASP Top 10 2021](https://owasp.org/Top10/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [CWE Top 25](https://cwe.mitre.org/top25/archive/2023/2023_top25_list.html)
- [Supabase Security](https://supabase.com/docs/guides/platform/security)

---

## ✅ SIGN-OFF

**Developer Acknowledgment:**
- I have read and understood these security guidelines
- I will follow these patterns in all code changes
- I will conduct security reviews before committing
- I will immediately report any security concerns

**Security Reviewer:**
- Code has been reviewed against these guidelines
- All validation patterns are correctly implemented
- No secrets or credentials are present
- Safe to deploy to production

---

**Last Updated:** 2026-01-17
**Next Review:** After Loop 2/200
