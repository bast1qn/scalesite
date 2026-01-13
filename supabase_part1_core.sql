-- ScaleSite Database - PART 1: Core Tables
-- Führe dieses SQL ZUERST aus

-- DROP TABLES
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS user_services CASCADE;
DROP TABLE IF EXISTS service_updates CASCADE;
DROP TABLE IF EXISTS tickets CASCADE;
DROP TABLE IF EXISTS ticket_messages CASCADE;
DROP TABLE IF EXISTS ticket_members CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS contact_messages CASCADE;
DROP TABLE IF EXISTS team_chat_messages CASCADE;
DROP TABLE IF EXISTS files CASCADE;
DROP TABLE IF EXISTS discounts CASCADE;
DROP TABLE IF EXISTS blog_posts CASCADE;

-- FUNCTION
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- PROFILES
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT,
    email TEXT,
    company TEXT,
    role TEXT DEFAULT 'user',
    referral_code TEXT UNIQUE,
    referred_by TEXT,
    phone TEXT,
    timezone TEXT DEFAULT 'Europe/Berlin',
    preferences JSONB DEFAULT '{}',
    onboarding_completed BOOLEAN DEFAULT FALSE,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- SERVICES
CREATE TABLE services (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT NOT NULL,
    name_en TEXT,
    description TEXT,
    description_en TEXT,
    price REAL,
    sale_price REAL,
    price_details TEXT,
    price_details_en TEXT
);

INSERT INTO services (name, name_en, description, description_en, price, sale_price, price_details, price_details_en) VALUES
('Basic Website', 'Basic Website', 'Perfekte One-Page für kleine businesses', 'Perfect one-pager for small businesses', 99, 29, 'einmalig', 'one-time'),
('Starter Website', 'Starter Website', 'Mehrseitige Website mit allen wichtigen Sektionen', 'Multi-page website with all important sections', 199, 59, 'einmalig', 'one-time'),
('Business Website', 'Business Website', 'Umfangreiche Website mit Blog & Funktionen', 'Comprehensive website with blog & features', 399, 89, 'einmalig', 'one-time'),
('Starter Hosting', 'Starter Hosting', 'Hosting & Wartung für Starter Websites', 'Hosting & maintenance for starter websites', 9, 5, 'pro Monat', 'per month'),
('Business Hosting', 'Business Hosting', 'Hosting & Wartung für Business Websites', 'Hosting & maintenance for business websites', 19, 9, 'pro Monat', 'per month'),
('Pro Hosting', 'Pro Hosting', 'Premium Hosting mit priorisiertem Support', 'Premium hosting with priority support', 39, 15, 'pro Monat', 'per month');

-- USER SERVICES
CREATE TABLE user_services (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending',
    progress INTEGER DEFAULT 0,
    project_id TEXT,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- SERVICE UPDATES
CREATE TABLE service_updates (
    id TEXT PRIMARY KEY,
    user_service_id TEXT REFERENCES user_services(id) ON DELETE CASCADE,
    message TEXT,
    author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- TICKETS
CREATE TABLE tickets (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    project_id TEXT,
    subject TEXT,
    status TEXT DEFAULT 'Offen',
    priority TEXT DEFAULT 'Mittel',
    priority_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    last_update TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- TICKET MESSAGES
CREATE TABLE ticket_messages (
    id TEXT PRIMARY KEY,
    ticket_id TEXT REFERENCES tickets(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    text TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- TICKET MEMBERS
CREATE TABLE ticket_members (
    ticket_id TEXT REFERENCES tickets(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    added_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (ticket_id, user_id)
);

-- TRANSACTIONS
CREATE TABLE transactions (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE SET NULL,
    amount REAL,
    date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    due_date TIMESTAMPTZ,
    status TEXT DEFAULT 'Offen',
    description TEXT
);

-- CONTACT MESSAGES
CREATE TABLE contact_messages (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT,
    subject TEXT,
    message TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- TEAM CHAT MESSAGES
CREATE TABLE team_chat_messages (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    content TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- FILES
CREATE TABLE files (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT,
    size BIGINT,
    type TEXT,
    data TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- DISCOUNTS
CREATE TABLE discounts (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE,
    type TEXT DEFAULT 'percent',
    value REAL,
    used_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- BLOG POSTS
CREATE TABLE blog_posts (
    id TEXT PRIMARY KEY,
    title TEXT,
    excerpt TEXT,
    content TEXT,
    category TEXT,
    image_url TEXT,
    author_name TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

SELECT '✅ Part 1 erfolgreich!' as status;
