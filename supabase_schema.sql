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
-- ANALYTICS EVENTS (enhanced for new features)
-- ============================================
CREATE TABLE IF NOT EXISTS analytics_events (
    id TEXT PRIMARY KEY,
    session_id TEXT,
    type TEXT,
    path TEXT,
    element TEXT,
    timestamp BIGINT,
    -- New fields for enhanced analytics
    project_id TEXT,
    user_id UUID REFERENCES profiles(id),
    event_data JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
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
-- PROJECTS (for Live Preview & Status Tracking)
-- ============================================
CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    service_id INTEGER REFERENCES services(id),
    name TEXT NOT NULL,
    description TEXT,
    industry TEXT,
    config JSONB DEFAULT '{}',
    content JSONB DEFAULT '{}',
    status TEXT DEFAULT 'konzeption',
    progress INTEGER DEFAULT 0,
    estimated_launch_date TIMESTAMPTZ,
    actual_launch_date TIMESTAMPTZ,
    preview_url TEXT,
    is_live BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- PROJECT MILESTONES
-- ============================================
CREATE TABLE IF NOT EXISTS project_milestones (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending',
    due_date TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- CONTENT GENERATIONS (AI)
-- ============================================
CREATE TABLE IF NOT EXISTS content_generations (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    project_id TEXT REFERENCES projects(id) ON DELETE SET NULL,
    type TEXT NOT NULL,
    industry TEXT,
    keywords TEXT[],
    tone TEXT DEFAULT 'professional',
    prompt TEXT,
    generated_content TEXT,
    selected_content TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TEAM MEMBERS
-- ============================================
CREATE TABLE IF NOT EXISTS team_members (
    id TEXT PRIMARY KEY,
    team_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member',
    permissions JSONB DEFAULT '{}',
    status TEXT DEFAULT 'pending',
    invited_by UUID REFERENCES profiles(id),
    invited_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(team_id, member_id)
);

-- ============================================
-- INVOICES
-- ============================================
CREATE TABLE IF NOT EXISTS invoices (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    project_id TEXT REFERENCES projects(id),
    invoice_number TEXT UNIQUE NOT NULL,
    amount REAL NOT NULL,
    currency TEXT DEFAULT 'EUR',
    status TEXT DEFAULT 'draft',
    issue_date TIMESTAMPTZ NOT NULL,
    due_date TIMESTAMPTZ NOT NULL,
    paid_at TIMESTAMPTZ,
    payment_method TEXT,
    payment_id TEXT,
    download_url TEXT,
    line_items JSONB DEFAULT '[]',
    discount_code TEXT,
    discount_amount REAL DEFAULT 0,
    tax_amount REAL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- NOTIFICATIONS
-- ============================================
CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT,
    link TEXT,
    read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    related_entity_type TEXT,
    related_entity_id TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMPTZ
);

-- ============================================
-- NEWSLETTER CAMPAIGNS
-- ============================================
CREATE TABLE IF NOT EXISTS newsletter_campaigns (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    subject TEXT NOT NULL,
    preview_text TEXT,
    content TEXT NOT NULL,
    target_segment TEXT DEFAULT 'all',
    status TEXT DEFAULT 'draft',
    scheduled_for TIMESTAMPTZ,
    sent_count INTEGER DEFAULT 0,
    open_count INTEGER DEFAULT 0,
    click_count INTEGER DEFAULT 0,
    unsubscribe_count INTEGER DEFAULT 0,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    sent_at TIMESTAMPTZ
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

-- New indexes for enhanced features
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_project_milestones_project_id ON project_milestones(project_id);
CREATE INDEX IF NOT EXISTS idx_content_generations_user_id ON content_generations(user_id);
CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_member_id ON team_members(member_id);
CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_analytics_project_id ON analytics_events(project_id);
CREATE INDEX IF NOT EXISTS idx_analytics_timestamp ON analytics_events(timestamp);

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

-- Enable RLS for new tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_campaigns ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES
-- ============================================

-- Profiles: Users can read their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

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
-- RLS POLICIES FOR NEW TABLES
-- ============================================

-- Projects
DROP POLICY IF EXISTS "Users can view own projects" ON projects;
CREATE POLICY "Users can view own projects" ON projects
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own projects" ON projects;
CREATE POLICY "Users can insert own projects" ON projects
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own projects" ON projects;
CREATE POLICY "Users can update own projects" ON projects
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Team can view all projects" ON projects;
CREATE POLICY "Team can view all projects" ON projects
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('team', 'owner'))
    );

DROP POLICY IF EXISTS "Team can update all projects" ON projects;
CREATE POLICY "Team can update all projects" ON projects
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('team', 'owner'))
    );

-- Project Milestones
DROP POLICY IF EXISTS "Users can view own project milestones" ON project_milestones;
CREATE POLICY "Users can view own project milestones" ON project_milestones
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM projects p
            WHERE p.id = project_milestones.project_id
            AND p.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can insert own project milestones" ON project_milestones;
CREATE POLICY "Users can insert own project milestones" ON project_milestones
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM projects p
            WHERE p.id = project_milestones.project_id
            AND p.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can update own project milestones" ON project_milestones;
CREATE POLICY "Users can update own project milestones" ON project_milestones
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM projects p
            WHERE p.id = project_milestones.project_id
            AND p.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Team can view all milestones" ON project_milestones;
CREATE POLICY "Team can view all milestones" ON project_milestones
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('team', 'owner'))
    );

DROP POLICY IF EXISTS "Team can manage all milestones" ON project_milestones;
CREATE POLICY "Team can manage all milestones" ON project_milestones
    FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('team', 'owner'))
    );

-- Content Generations
DROP POLICY IF EXISTS "Users can view own content generations" ON content_generations;
CREATE POLICY "Users can view own content generations" ON content_generations
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own content generations" ON content_generations;
CREATE POLICY "Users can insert own content generations" ON content_generations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own content generations" ON content_generations;
CREATE POLICY "Users can update own content generations" ON content_generations
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Team can view all content generations" ON content_generations;
CREATE POLICY "Team can view all content generations" ON content_generations
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('team', 'owner'))
    );

-- Team Members
DROP POLICY IF EXISTS "Users can view own team" ON team_members;
CREATE POLICY "Users can view own team" ON team_members
    FOR SELECT USING (auth.uid() = team_id OR auth.uid() = member_id);

DROP POLICY IF EXISTS "Users can insert team members" ON team_members;
CREATE POLICY "Users can insert team members" ON team_members
    FOR INSERT WITH CHECK (auth.uid() = team_id);

DROP POLICY IF EXISTS "Users can update own team members" ON team_members;
CREATE POLICY "Users can update own team members" ON team_members
    FOR UPDATE USING (auth.uid() = team_id);

DROP POLICY IF EXISTS "Users can delete own team members" ON team_members;
CREATE POLICY "Users can delete own team members" ON team_members
    FOR DELETE USING (auth.uid() = team_id);

DROP POLICY IF EXISTS "Team can view all team members" ON team_members;
CREATE POLICY "Team can view all team members" ON team_members
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('team', 'owner'))
    );

-- Invoices
DROP POLICY IF EXISTS "Users can view own invoices" ON invoices;
CREATE POLICY "Users can view own invoices" ON invoices
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own invoices" ON invoices;
CREATE POLICY "Users can insert own invoices" ON invoices
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own invoices" ON invoices;
CREATE POLICY "Users can update own invoices" ON invoices
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Team can view all invoices" ON invoices;
CREATE POLICY "Team can view all invoices" ON invoices
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('team', 'owner'))
    );

DROP POLICY IF EXISTS "Team can manage all invoices" ON invoices;
CREATE POLICY "Team can manage all invoices" ON invoices
    FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('team', 'owner'))
    );

-- Notifications
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
CREATE POLICY "Users can view own notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own notifications" ON notifications;
CREATE POLICY "Users can insert own notifications" ON notifications
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
CREATE POLICY "Users can update own notifications" ON notifications
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Team can view all notifications" ON notifications;
CREATE POLICY "Team can view all notifications" ON notifications
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('team', 'owner'))
    );

DROP POLICY IF EXISTS "Team can insert any notifications" ON notifications;
CREATE POLICY "Team can insert any notifications" ON notifications
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('team', 'owner'))
    );

-- Newsletter Campaigns
DROP POLICY IF EXISTS "Team can view campaigns" ON newsletter_campaigns;
CREATE POLICY "Team can view campaigns" ON newsletter_campaigns
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('team', 'owner'))
    );

DROP POLICY IF EXISTS "Team can insert campaigns" ON newsletter_campaigns;
CREATE POLICY "Team can insert campaigns" ON newsletter_campaigns
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('team', 'owner'))
    );

DROP POLICY IF EXISTS "Team can update campaigns" ON newsletter_campaigns;
CREATE POLICY "Team can update campaigns" ON newsletter_campaigns
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('team', 'owner'))
    );

DROP POLICY IF EXISTS "Team can delete campaigns" ON newsletter_campaigns;
CREATE POLICY "Team can delete campaigns" ON newsletter_campaigns
    FOR DELETE USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('team', 'owner'))
    );

-- ============================================
-- ALTER EXISTING TABLES FOR NEW FEATURES
-- ============================================

-- Extend profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'Europe/Berlin';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Extend tickets table
ALTER TABLE tickets ADD COLUMN IF NOT EXISTS project_id TEXT REFERENCES projects(id);
ALTER TABLE tickets ADD COLUMN IF NOT EXISTS priority_order INTEGER DEFAULT 0;

-- Extend user_services table
ALTER TABLE user_services ADD COLUMN IF NOT EXISTS project_id TEXT REFERENCES projects(id);
ALTER TABLE user_services ADD COLUMN IF NOT EXISTS started_at TIMESTAMPTZ;
ALTER TABLE user_services ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;
ALTER TABLE user_services ADD COLUMN IF NOT EXISTS estimated_completion_date TIMESTAMPTZ;

-- Extend transactions table
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS invoice_id TEXT REFERENCES invoices(id);
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS payment_provider TEXT;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS provider_transaction_id TEXT;

-- Extend files table
ALTER TABLE files ADD COLUMN IF NOT EXISTS related_entity_type TEXT;
ALTER TABLE files ADD COLUMN IF NOT EXISTS related_entity_id TEXT;
ALTER TABLE files ADD COLUMN IF NOT EXISTS uploaded_by UUID REFERENCES profiles(id);
ALTER TABLE files ADD COLUMN IF NOT EXISTS storage_path TEXT;

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
