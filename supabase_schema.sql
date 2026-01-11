-- ScaleSite Supabase Schema
-- Führe dieses SQL im Supabase SQL Editor aus

-- ============================================
-- SERVICES
-- ============================================
CREATE TABLE IF NOT EXISTS services (
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

-- Insert default services
INSERT INTO services (name, name_en, description, description_en, price, sale_price, price_details, price_details_en) VALUES
('Basic Website', 'Basic Website', 'Perfekte One-Page für kleine businesses', 'Perfect one-pager for small businesses', 99, 29, 'einmalig', 'one-time'),
('Starter Website', 'Starter Website', 'Mehrseitige Website mit allen wichtigen Sektionen', 'Multi-page website with all important sections', 199, 59, 'einmalig', 'one-time'),
('Business Website', 'Business Website', 'Umfangreiche Website mit Blog & Funktionen', 'Comprehensive website with blog & features', 399, 89, 'einmalig', 'one-time'),
('Starter Hosting', 'Starter Hosting', 'Hosting & Wartung für Starter Websites', 'Hosting & maintenance for starter websites', 9, 5, 'pro Monat', 'per month'),
('Business Hosting', 'Business Hosting', 'Hosting & Wartung für Business Websites', 'Hosting & maintenance for business websites', 19, 9, 'pro Monat', 'per month'),
('Pro Hosting', 'Pro Hosting', 'Premium Hosting mit priorisiertem Support', 'Premium hosting with priority support', 39, 15, 'pro Monat', 'per month')
ON CONFLICT DO NOTHING;

-- ============================================
-- USER SERVICES (bookings)
-- ============================================
CREATE TABLE IF NOT EXISTS user_services (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending',
    progress INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
);

-- ============================================
-- SERVICE UPDATES
-- ============================================
CREATE TABLE IF NOT EXISTS service_updates (
    id TEXT PRIMARY KEY,
    user_service_id TEXT REFERENCES user_services(id) ON DELETE CASCADE,
    message TEXT,
    author_id TEXT,
    created_at TEXT DEFAULT (datetime('now'))
);

-- ============================================
-- TICKETS
-- ============================================
CREATE TABLE IF NOT EXISTS tickets (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    subject TEXT,
    status TEXT DEFAULT 'Offen',
    priority TEXT DEFAULT 'Mittel',
    created_at TEXT DEFAULT (datetime('now')),
    last_update TEXT DEFAULT (datetime('now'))
);

-- ============================================
-- TICKET MESSAGES
-- ============================================
CREATE TABLE IF NOT EXISTS ticket_messages (
    id TEXT PRIMARY KEY,
    ticket_id TEXT REFERENCES tickets(id) ON DELETE CASCADE,
    user_id TEXT,
    text TEXT,
    created_at TEXT DEFAULT (datetime('now'))
);

-- ============================================
-- TICKET MEMBERS
-- ============================================
CREATE TABLE IF NOT EXISTS ticket_members (
    ticket_id TEXT REFERENCES tickets(id) ON DELETE CASCADE,
    user_id TEXT,
    added_at TEXT DEFAULT (datetime('now')),
    PRIMARY KEY (ticket_id, user_id)
);

-- ============================================
-- TRANSACTIONS
-- ============================================
CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    amount REAL,
    date TEXT DEFAULT (datetime('now')),
    due_date TEXT,
    status TEXT DEFAULT 'Offen',
    description TEXT
);

-- ============================================
-- CONTACT MESSAGES
-- ============================================
CREATE TABLE IF NOT EXISTS contact_messages (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT,
    subject TEXT,
    message TEXT,
    created_at TEXT DEFAULT (datetime('now'))
);

-- ============================================
-- NEWSLETTER SUBSCRIBERS
-- ============================================
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE,
    created_at TEXT DEFAULT (datetime('now'))
);

-- ============================================
-- ANALYTICS EVENTS
-- ============================================
CREATE TABLE IF NOT EXISTS analytics_events (
    id TEXT PRIMARY KEY,
    session_id TEXT,
    type TEXT,
    path TEXT,
    element TEXT,
    timestamp INTEGER
);

-- ============================================
-- TEAM CHAT MESSAGES
-- ============================================
CREATE TABLE IF NOT EXISTS team_chat_messages (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    content TEXT,
    created_at TEXT DEFAULT (datetime('now'))
);

-- ============================================
-- FILES
-- ============================================
CREATE TABLE IF NOT EXISTS files (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    name TEXT,
    size INTEGER,
    type TEXT,
    data TEXT,
    created_at TEXT DEFAULT (datetime('now'))
);

-- ============================================
-- DISCOUNTS
-- ============================================
CREATE TABLE IF NOT EXISTS discounts (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE,
    type TEXT DEFAULT 'percent',
    value REAL,
    used_count INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
);

-- ============================================
-- BLOG POSTS
-- ============================================
CREATE TABLE IF NOT EXISTS blog_posts (
    id TEXT PRIMARY KEY,
    title TEXT,
    excerpt TEXT,
    content TEXT,
    category TEXT,
    image_url TEXT,
    author_name TEXT,
    created_at TEXT DEFAULT (datetime('now'))
);

-- ============================================
-- TEAM TASKS
-- ============================================
CREATE TABLE IF NOT EXISTS team_tasks (
    id TEXT PRIMARY KEY,
    column_id TEXT DEFAULT 'todo',
    title TEXT,
    client_name TEXT,
    priority TEXT,
    created_at TEXT DEFAULT (datetime('now'))
);

-- ============================================
-- USER PROFILES (extends Supabase Auth)
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
    id TEXT PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT,
    email TEXT,
    company TEXT,
    role TEXT DEFAULT 'user',
    referral_code TEXT UNIQUE,
    created_at TEXT DEFAULT (datetime('now'))
);

-- ============================================
-- INDEXES for performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_tickets_user_id ON tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_user_services_user_id ON user_services(user_id);
CREATE INDEX IF NOT EXISTS idx_team_chat_created_at ON team_chat_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_ticket_messages_ticket_id ON ticket_messages(ticket_id);
CREATE INDEX IF NOT EXISTS idx_service_updates_user_service_id ON service_updates(user_service_id);

-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES
-- ============================================

-- Profiles: Users can read their own profile, team can read all
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Team can view all profiles" ON profiles
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('team', 'owner'))
    );

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- User Services
CREATE POLICY "Users can view own services" ON user_services
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Team can view all services" ON user_services
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('team', 'owner'))
    );

-- Tickets
CREATE POLICY "Users can view own tickets" ON tickets
    FOR SELECT USING (
        auth.uid() = user_id OR
        id IN (SELECT ticket_id FROM ticket_members WHERE user_id = auth.uid())
    );

CREATE POLICY "Team can view all tickets" ON tickets
    FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('team', 'owner'))
    );

-- Ticket Messages
CREATE POLICY "Users can view messages for own tickets" ON ticket_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM tickets t
            WHERE t.id = ticket_messages.ticket_id
            AND (t.user_id = auth.uid() OR t.id IN (SELECT ticket_id FROM ticket_members WHERE user_id = auth.uid()))
        )
    );

CREATE POLICY "Team can view all messages" ON ticket_messages
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('team', 'owner'))
    );

-- Transactions
CREATE POLICY "Users can view own transactions" ON transactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Team can view all transactions" ON transactions
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('team', 'owner'))
    );

-- Files
CREATE POLICY "Users can manage own files" ON files
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Team can view all files" ON files
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('team', 'owner'))
    );

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Create profile automatically on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, name, email, role, referral_code)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
        NEW.email,
        'user',
        UPPER(SUBSTR(COALESCE(NEW.raw_user_meta_data->>'name', 'USR'), 1, 3)) || (ABS(RANDOM()) % 9000 + 1000)::TEXT
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- INITIAL ADMIN USER (optional)
-- ============================================
-- Um einen Admin zu erstellen, registriere dich zuerst normally,
-- dann führe dieses SQL aus und ersetze 'user_id' mit deiner ID:
-- UPDATE profiles SET role = 'owner' WHERE id = 'user_id';
