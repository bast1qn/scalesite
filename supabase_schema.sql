-- ScaleSite Supabase Schema (PostgreSQL)
-- Führe dieses SQL im Supabase SQL Editor aus

-- ============================================
-- USER PROFILES (extends Supabase Auth)
-- Muss zuerst erstellt werden, da andere Tabellen referenzieren
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT,
    email TEXT,
    company TEXT,
    role TEXT DEFAULT 'user',
    referral_code TEXT UNIQUE,
    referred_by TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

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
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending',
    progress INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- SERVICE UPDATES
-- ============================================
CREATE TABLE IF NOT EXISTS service_updates (
    id TEXT PRIMARY KEY,
    user_service_id TEXT REFERENCES user_services(id) ON DELETE CASCADE,
    message TEXT,
    author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TICKETS
-- ============================================
CREATE TABLE IF NOT EXISTS tickets (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    subject TEXT,
    status TEXT DEFAULT 'Offen',
    priority TEXT DEFAULT 'Mittel',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    last_update TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TICKET MESSAGES
-- ============================================
CREATE TABLE IF NOT EXISTS ticket_messages (
    id TEXT PRIMARY KEY,
    ticket_id TEXT REFERENCES tickets(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    text TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TICKET MEMBERS
-- ============================================
CREATE TABLE IF NOT EXISTS ticket_members (
    ticket_id TEXT REFERENCES tickets(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    added_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (ticket_id, user_id)
);

-- ============================================
-- TRANSACTIONS
-- ============================================
CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE SET NULL,
    amount REAL,
    date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    due_date TIMESTAMPTZ,
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
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- NEWSLETTER SUBSCRIBERS
-- ============================================
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
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
    timestamp BIGINT
);

-- ============================================
-- TEAM CHAT MESSAGES
-- ============================================
CREATE TABLE IF NOT EXISTS team_chat_messages (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    content TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- FILES
-- ============================================
CREATE TABLE IF NOT EXISTS files (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT,
    size BIGINT,
    type TEXT,
    data TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
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
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
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
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
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
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- INDEXES for performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_tickets_user_id ON tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_user_services_user_id ON user_services(user_id);
CREATE INDEX IF NOT EXISTS idx_team_chat_created_at ON team_chat_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_ticket_messages_ticket_id ON ticket_messages(ticket_id);
CREATE INDEX IF NOT EXISTS idx_service_updates_user_service_id ON service_updates(user_service_id);
CREATE INDEX IF NOT EXISTS idx_ticket_members_ticket_id ON ticket_members(ticket_id);
CREATE INDEX IF NOT EXISTS idx_ticket_members_user_id ON ticket_members(user_id);

-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE discounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES
-- ============================================

-- Profiles: Users can read their own profile, team can read all
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Team can view all profiles" ON profiles;
CREATE POLICY "Team can view all profiles" ON profiles
    FOR SELECT USING (
        -- Check auth.users metadata directly to avoid infinite recursion
        (
            SELECT 1 FROM auth.users
            WHERE id = auth.uid()
            AND (
                raw_user_meta_data->>'role' IN ('team', 'owner')
                OR raw_app_meta_data->>'role' IN ('team', 'owner')
            )
        ) IS NOT NULL
    );

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Services (public read-only)
DROP POLICY IF EXISTS "Public can view services" ON services;
CREATE POLICY "Public can view services" ON services
    FOR SELECT USING (true);

-- User Services
DROP POLICY IF EXISTS "Users can view own services" ON user_services;
CREATE POLICY "Users can view own services" ON user_services
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own services" ON user_services;
CREATE POLICY "Users can insert own services" ON user_services
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Team can view all services" ON user_services;
CREATE POLICY "Team can view all services" ON user_services
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('team', 'owner'))
    );

DROP POLICY IF EXISTS "Team can update services" ON user_services;
CREATE POLICY "Team can update services" ON user_services
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('team', 'owner'))
    );

-- Tickets
DROP POLICY IF EXISTS "Users can view own tickets" ON tickets;
CREATE POLICY "Users can view own tickets" ON tickets
    FOR SELECT USING (
        auth.uid() = user_id OR
        id IN (SELECT ticket_id FROM ticket_members WHERE user_id = auth.uid())
    );

DROP POLICY IF EXISTS "Users can create tickets" ON tickets;
CREATE POLICY "Users can create tickets" ON tickets
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Team can view all tickets" ON tickets;
CREATE POLICY "Team can view all tickets" ON tickets
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('team', 'owner'))
    );

DROP POLICY IF EXISTS "Team can update all tickets" ON tickets;
CREATE POLICY "Team can update all tickets" ON tickets
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('team', 'owner'))
    );

-- Ticket Messages
DROP POLICY IF EXISTS "Users can view messages for own tickets" ON ticket_messages;
CREATE POLICY "Users can view messages for own tickets" ON ticket_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM tickets t
            WHERE t.id = ticket_messages.ticket_id
            AND (t.user_id = auth.uid() OR t.id IN (SELECT ticket_id FROM ticket_members WHERE user_id = auth.uid()))
        )
    );

DROP POLICY IF EXISTS "Users can insert messages for own tickets" ON ticket_messages;
CREATE POLICY "Users can insert messages for own tickets" ON ticket_messages
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM tickets t
            WHERE t.id = ticket_messages.ticket_id
            AND (t.user_id = auth.uid() OR t.id IN (SELECT ticket_id FROM ticket_members WHERE user_id = auth.uid()))
        )
    );

DROP POLICY IF EXISTS "Team can view all messages" ON ticket_messages;
CREATE POLICY "Team can view all messages" ON ticket_messages
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('team', 'owner'))
    );

DROP POLICY IF EXISTS "Team can insert any messages" ON ticket_messages;
CREATE POLICY "Team can insert any messages" ON ticket_messages
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('team', 'owner'))
    );

-- Ticket Members
DROP POLICY IF EXISTS "Users can view members for own tickets" ON ticket_members;
CREATE POLICY "Users can view members for own tickets" ON ticket_members
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM tickets t
            WHERE t.id = ticket_members.ticket_id
            AND (t.user_id = auth.uid() OR t.id IN (SELECT ticket_id FROM ticket_members WHERE user_id = auth.uid()))
        )
    );

DROP POLICY IF EXISTS "Team can view all members" ON ticket_members;
CREATE POLICY "Team can view all members" ON ticket_members
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('team', 'owner'))
    );

DROP POLICY IF EXISTS "Team can insert members" ON ticket_members;
CREATE POLICY "Team can insert members" ON ticket_members
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('team', 'owner'))
    );

DROP POLICY IF EXISTS "Team can delete members" ON ticket_members;
CREATE POLICY "Team can delete members" ON ticket_members
    FOR DELETE USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('team', 'owner'))
    );

-- Transactions
DROP POLICY IF EXISTS "Users can view own transactions" ON transactions;
CREATE POLICY "Users can view own transactions" ON transactions
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Team can view all transactions" ON transactions;
CREATE POLICY "Team can view all transactions" ON transactions
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('team', 'owner'))
    );

-- Files
DROP POLICY IF EXISTS "Users can manage own files" ON files;
CREATE POLICY "Users can manage own files" ON files
    FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Team can view all files" ON files;
CREATE POLICY "Team can view all files" ON files
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('team', 'owner'))
    );

-- Public tables (no auth required)
DROP POLICY IF EXISTS "Public can view blog posts" ON blog_posts;
CREATE POLICY "Public can view blog posts" ON blog_posts
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Team can manage blog posts" ON blog_posts;
CREATE POLICY "Team can manage blog posts" ON blog_posts
    FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('team', 'owner'))
    );

DROP POLICY IF EXISTS "Anyone can insert contact messages" ON contact_messages;
CREATE POLICY "Anyone can insert contact messages" ON contact_messages
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Team can view contact messages" ON contact_messages;
CREATE POLICY "Team can view contact messages" ON contact_messages
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('team', 'owner'))
    );

DROP POLICY IF EXISTS "Anyone can insert newsletter subscribers" ON newsletter_subscribers;
CREATE POLICY "Anyone can insert newsletter subscribers" ON newsletter_subscribers
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Team can view newsletter subscribers" ON newsletter_subscribers;
CREATE POLICY "Team can view newsletter subscribers" ON newsletter_subscribers
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('team', 'owner'))
    );

DROP POLICY IF EXISTS "Anyone can insert analytics events" ON analytics_events;
CREATE POLICY "Anyone can insert analytics events" ON analytics_events
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Team can view analytics events" ON analytics_events;
CREATE POLICY "Team can view analytics events" ON analytics_events
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('team', 'owner'))
    );

-- Team Chat (team only)
DROP POLICY IF EXISTS "Team can view chat" ON team_chat_messages;
CREATE POLICY "Team can view chat" ON team_chat_messages
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('team', 'owner'))
    );

DROP POLICY IF EXISTS "Team can insert chat" ON team_chat_messages;
CREATE POLICY "Team can insert chat" ON team_chat_messages
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('team', 'owner'))
    );

-- Team Tasks (team only)
DROP POLICY IF EXISTS "Team can view tasks" ON team_tasks;
CREATE POLICY "Team can view tasks" ON team_tasks
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('team', 'owner'))
    );

DROP POLICY IF EXISTS "Team can insert tasks" ON team_tasks;
CREATE POLICY "Team can insert tasks" ON team_tasks
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('team', 'owner'))
    );

DROP POLICY IF EXISTS "Team can update tasks" ON team_tasks;
CREATE POLICY "Team can update tasks" ON team_tasks
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('team', 'owner'))
    );

DROP POLICY IF EXISTS "Team can delete tasks" ON team_tasks;
CREATE POLICY "Team can delete tasks" ON team_tasks
    FOR DELETE USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('team', 'owner'))
    );

-- Discounts (team only)
DROP POLICY IF EXISTS "Team can view discounts" ON discounts;
CREATE POLICY "Team can view discounts" ON discounts
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('team', 'owner'))
    );

DROP POLICY IF EXISTS "Team can insert discounts" ON discounts;
CREATE POLICY "Team can insert discounts" ON discounts
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('team', 'owner'))
    );

DROP POLICY IF EXISTS "Team can delete discounts" ON discounts;
CREATE POLICY "Team can delete discounts" ON discounts
    FOR DELETE USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('team', 'owner'))
    );

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Create profile automatically on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, name, email, role, referral_code, referred_by)
    VALUES (
        NEW.id,
        COALESCE(
            NEW.raw_user_meta_data->>'name',
            NEW.user_metadata->>'name',
            'User'
        ),
        NEW.email,
        'user',
        UPPER(SUBSTR(COALESCE(
            NEW.raw_user_meta_data->>'name',
            NEW.user_metadata->>'name',
            'USR'
        ), 1, 3)) || (FLOOR(RANDOM() * 9000) + 1000)::TEXT,
        COALESCE(
            NEW.raw_user_meta_data->>'referred_by',
            NEW.user_metadata->>'referred_by'
        )
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- INITIAL ADMIN USER (optional)
-- ============================================
-- Um einen Admin zu erstellen, registriere dich zuerst normally,
-- dann führe dieses SQL aus und ersetze 'deine@email.de' mit deiner E-Mail:
-- UPDATE profiles SET role = 'owner' WHERE email = 'deine@email.de';
