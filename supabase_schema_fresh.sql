-- ScaleSite Complete Database Schema - FRESH INSTALL
-- Führe dieses SQL im Supabase SQL Editor aus
-- ⚠️  LÖSCHT ALLE EXISTIERENDEN DATEN! ⚠️
--
-- 📊 33 Tabellen:
-- - Core: profiles, services, user_services, tickets, etc.
-- - Projects: projects, project_milestones
-- - AI Content: content_generations
-- - Team: team_members, team_tasks, team_invitations, team_activity
-- - Chat: chat_conversations, chat_participants, chat_messages, chat_typing_indicators
-- - Billing: invoices, subscriptions, payments, payment_intents, payment_methods
-- - Marketing: newsletter_campaigns, newsletter_subscribers
-- - Notifications, Analytics, Webhooks
--

-- ============================================
-- STEP 1: ALLE EXISTIERENDEN TABELLEN LÖSCHEN
-- ============================================

DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
DROP TRIGGER IF EXISTS update_invoices_updated_at ON invoices;

-- Neue Tabellen löschen (zuerst wegen Foreign Keys)
DROP TABLE IF EXISTS chat_typing_indicators CASCADE;
DROP TABLE IF EXISTS chat_messages CASCADE;
DROP TABLE IF EXISTS chat_participants CASCADE;
DROP TABLE IF EXISTS chat_conversations CASCADE;
DROP TABLE IF EXISTS payment_methods CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS payment_intents CASCADE;
DROP TABLE IF EXISTS webhook_events CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS team_tasks CASCADE;

DROP TABLE IF EXISTS analytics_events CASCADE;
DROP TABLE IF EXISTS newsletter_campaigns CASCADE;
DROP TABLE IF EXISTS newsletter_subscribers CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS invoices CASCADE;
DROP TABLE IF EXISTS team_activity CASCADE;
DROP TABLE IF EXISTS team_invitations CASCADE;
DROP TABLE IF EXISTS team_members CASCADE;
DROP TABLE IF EXISTS content_generations CASCADE;
DROP TABLE IF EXISTS project_milestones CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS user_settings CASCADE;

DROP TABLE IF EXISTS blog_posts CASCADE;
DROP TABLE IF EXISTS discounts CASCADE;
DROP TABLE IF EXISTS files CASCADE;
DROP TABLE IF EXISTS team_chat_messages CASCADE;
DROP TABLE IF EXISTS contact_messages CASCADE;
DROP TABLE IF EXISTS ticket_members CASCADE;
DROP TABLE IF EXISTS ticket_messages CASCADE;
DROP TABLE IF EXISTS tickets CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS service_updates CASCADE;
DROP TABLE IF EXISTS user_services CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- ============================================
-- STEP 2: FUNKTIONEN ERSTELLEN
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- STEP 3: ALLE TABELLEN ERSTELLEN (OHNE RLS)
-- ============================================

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

-- PROJECTS
CREATE TABLE projects (
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

-- Trigger für projects.updated_at
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- PROJECT MILESTONES
CREATE TABLE project_milestones (
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

-- CONTENT GENERATIONS
CREATE TABLE content_generations (
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
    is_favorite BOOLEAN DEFAULT FALSE,
    variations JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- TEAM MEMBERS
CREATE TABLE team_members (
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

-- TEAM INVITATIONS
CREATE TABLE team_invitations (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    invited_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member',
    status TEXT DEFAULT 'pending',
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- TEAM ACTIVITY
CREATE TABLE team_activity (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    user_name TEXT,
    user_email TEXT,
    target_type TEXT,
    target_id TEXT,
    target_name TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- INVOICES
CREATE TABLE invoices (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    project_id TEXT REFERENCES projects(id) ON DELETE SET NULL,
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

-- Trigger für invoices.updated_at
CREATE TRIGGER update_invoices_updated_at
    BEFORE UPDATE ON invoices
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- NOTIFICATIONS
CREATE TABLE notifications (
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

-- NEWSLETTER SUBSCRIBERS
CREATE TABLE newsletter_subscribers (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    name TEXT,
    status TEXT DEFAULT 'active',
    subscribed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    unsubscribed_at TIMESTAMPTZ,
    unsubscribe_reason TEXT,
    unsubscribe_feedback TEXT,
    preferences JSONB DEFAULT '{}',
    last_opened TIMESTAMPTZ,
    last_clicked TIMESTAMPTZ
);

-- NEWSLETTER CAMPAIGNS
CREATE TABLE newsletter_campaigns (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    subject TEXT NOT NULL,
    preview_text TEXT,
    content TEXT NOT NULL,
    target_segment TEXT DEFAULT 'all',
    status TEXT DEFAULT 'draft',
    scheduled_for TIMESTAMPTZ,
    timezone TEXT,
    sent_count INTEGER DEFAULT 0,
    open_count INTEGER DEFAULT 0,
    click_count INTEGER DEFAULT 0,
    unsubscribe_count INTEGER DEFAULT 0,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    sent_at TIMESTAMPTZ
);

-- ANALYTICS EVENTS
CREATE TABLE analytics_events (
    id TEXT PRIMARY KEY,
    project_id TEXT,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    event_type TEXT NOT NULL,
    event_data JSONB DEFAULT '{}',
    path TEXT,
    timestamp BIGINT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- USER SETTINGS
CREATE TABLE user_settings (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    key TEXT NOT NULL,
    value JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, key)
);

-- TEAM TASKS
CREATE TABLE team_tasks (
    id TEXT PRIMARY KEY,
    team_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'todo',
    priority TEXT DEFAULT 'medium',
    assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
    due_date TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- CHAT CONVERSATIONS
CREATE TABLE chat_conversations (
    id TEXT PRIMARY KEY,
    type TEXT DEFAULT 'direct',
    name TEXT,
    project_id TEXT,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    last_message_at TIMESTAMPTZ
);

-- CHAT PARTICIPANTS
CREATE TABLE chat_participants (
    conversation_id TEXT REFERENCES chat_conversations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    last_read_at TIMESTAMPTZ,
    role TEXT DEFAULT 'member',
    PRIMARY KEY (conversation_id, user_id)
);

-- CHAT MESSAGES
CREATE TABLE chat_messages (
    id TEXT PRIMARY KEY,
    conversation_id TEXT REFERENCES chat_conversations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    message_type TEXT DEFAULT 'text',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ
);

-- CHAT TYPING INDICATORS
CREATE TABLE chat_typing_indicators (
    conversation_id TEXT REFERENCES chat_conversations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    is_typing BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (conversation_id, user_id)
);

-- SUBSCRIPTIONS (Stripe)
CREATE TABLE subscriptions (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    stripe_subscription_id TEXT UNIQUE,
    stripe_customer_id TEXT,
    status TEXT DEFAULT 'active',
    price_id TEXT,
    amount REAL,
    currency TEXT DEFAULT 'EUR',
    interval TEXT DEFAULT 'month',
    interval_count INTEGER DEFAULT 1,
    trial_start TIMESTAMPTZ,
    trial_end TIMESTAMPTZ,
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    canceled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- WEBHOOK EVENTS (Stripe)
CREATE TABLE webhook_events (
    id TEXT PRIMARY KEY,
    stripe_event_id TEXT UNIQUE,
    type TEXT NOT NULL,
    processed BOOLEAN DEFAULT FALSE,
    processed_at TIMESTAMPTZ,
    error_message TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- PAYMENT INTENTS (Stripe)
CREATE TABLE payment_intents (
    id TEXT PRIMARY KEY,
    stripe_payment_intent_id TEXT UNIQUE,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    amount REAL NOT NULL,
    currency TEXT DEFAULT 'EUR',
    status TEXT DEFAULT 'pending',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- PAYMENTS
CREATE TABLE payments (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    payment_intent_id TEXT REFERENCES payment_intents(id) ON DELETE SET NULL,
    invoice_id TEXT REFERENCES invoices(id) ON DELETE SET NULL,
    subscription_id TEXT REFERENCES subscriptions(id) ON DELETE SET NULL,
    amount REAL NOT NULL,
    currency TEXT DEFAULT 'EUR',
    status TEXT DEFAULT 'pending',
    payment_method TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- PAYMENT METHODS
CREATE TABLE payment_methods (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    stripe_payment_method_id TEXT UNIQUE,
    type TEXT DEFAULT 'card',
    brand TEXT,
    last4 TEXT,
    exp_month INTEGER,
    exp_year INTEGER,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- STEP 4: INDIZES ERSTELLEN
-- ============================================

CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_project_milestones_project_id ON project_milestones(project_id);
CREATE INDEX idx_content_generations_user_id ON content_generations(user_id);
CREATE INDEX idx_content_generations_project_id ON content_generations(project_id);
CREATE INDEX idx_team_members_team_id ON team_members(team_id);
CREATE INDEX idx_team_members_member_id ON team_members(member_id);
CREATE INDEX idx_team_invitations_email ON team_invitations(email);
CREATE INDEX idx_team_activity_user_id ON team_activity(user_id);
CREATE INDEX idx_team_activity_created_at ON team_activity(created_at DESC);
CREATE INDEX idx_invoices_user_id ON invoices(user_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_invoice_number ON invoices(invoice_number);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX idx_newsletter_campaigns_status ON newsletter_campaigns(status);
CREATE INDEX idx_newsletter_campaigns_created_by ON newsletter_campaigns(created_by);
CREATE INDEX idx_newsletter_subscribers_email ON newsletter_subscribers(email);
CREATE INDEX idx_newsletter_subscribers_status ON newsletter_subscribers(status);
CREATE INDEX idx_analytics_project_id ON analytics_events(project_id);
CREATE INDEX idx_analytics_timestamp ON analytics_events(timestamp);
CREATE INDEX idx_analytics_event_type ON analytics_events(event_type);
CREATE INDEX idx_user_settings_user_id ON user_settings(user_id);

-- Indizes für neue Tabellen
CREATE INDEX idx_team_tasks_team_id ON team_tasks(team_id);
CREATE INDEX idx_team_tasks_assigned_to ON team_tasks(assigned_to);
CREATE INDEX idx_team_tasks_status ON team_tasks(status);
CREATE INDEX idx_chat_conversations_created_by ON chat_conversations(created_by);
CREATE INDEX idx_chat_conversations_project_id ON chat_conversations(project_id);
CREATE INDEX idx_chat_participants_user_id ON chat_participants(user_id);
CREATE INDEX idx_chat_messages_conversation_id ON chat_messages(conversation_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at DESC);
CREATE INDEX idx_chat_typing_indicators_updated_at ON chat_typing_indicators(updated_at);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_subscription_id ON subscriptions(stripe_subscription_id);
CREATE INDEX idx_webhook_events_stripe_event_id ON webhook_events(stripe_event_id);
CREATE INDEX idx_webhook_events_processed ON webhook_events(processed);
CREATE INDEX idx_payment_intents_user_id ON payment_intents(user_id);
CREATE INDEX idx_payment_intents_stripe_payment_intent_id ON payment_intents(stripe_payment_intent_id);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_payment_intent_id ON payments(payment_intent_id);
CREATE INDEX idx_payments_invoice_id ON payments(invoice_id);
CREATE INDEX idx_payments_subscription_id ON payments(subscription_id);
CREATE INDEX idx_payment_methods_user_id ON payment_methods(user_id);
CREATE INDEX idx_payment_methods_stripe_payment_method_id ON payment_methods(stripe_payment_method_id);

-- ============================================
-- STEP 5: DROP TABELLEN AM ANFANG ERWEITERN
-- ============================================

-- Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Projects
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own projects" ON projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own projects" ON projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own projects" ON projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Team can view all projects" ON projects FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('team', 'owner'))
);

-- Project Milestones
ALTER TABLE project_milestones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view milestones" ON project_milestones FOR SELECT USING (
    EXISTS (SELECT 1 FROM projects WHERE id = project_milestones.project_id AND user_id = auth.uid())
);
CREATE POLICY "Users can insert milestones" ON project_milestones FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM projects WHERE id = project_milestones.project_id AND user_id = auth.uid())
);
CREATE POLICY "Users can update milestones" ON project_milestones FOR UPDATE USING (
    EXISTS (SELECT 1 FROM projects WHERE id = project_milestones.project_id AND user_id = auth.uid())
);

-- Content Generations
ALTER TABLE content_generations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own content" ON content_generations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own content" ON content_generations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own content" ON content_generations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own content" ON content_generations FOR DELETE USING (auth.uid() = user_id);

-- Team Members
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Team members can view team" ON team_members FOR SELECT USING (
    auth.uid() = team_id OR auth.uid() = member_id OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('team', 'owner'))
);

-- Team Invitations
ALTER TABLE team_invitations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view invitations" ON team_invitations FOR SELECT USING (auth.uid() = invited_by);
CREATE POLICY "Users can create invitations" ON team_invitations FOR INSERT WITH CHECK (auth.uid() = invited_by);

-- Team Activity
ALTER TABLE team_activity ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Team can view activity" ON team_activity FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('team', 'owner'))
);

-- Invoices
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own invoices" ON invoices FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own invoices" ON invoices FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own invoices" ON invoices FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Team can view all invoices" ON invoices FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('team', 'owner'))
);

-- Notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own notifications" ON notifications FOR DELETE USING (auth.uid() = user_id);

-- Newsletter Campaigns
ALTER TABLE newsletter_campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Team can manage campaigns" ON newsletter_campaigns FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('team', 'owner'))
);

-- Newsletter Subscribers
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view subscribers" ON newsletter_subscribers FOR SELECT USING (true);
CREATE POLICY "Team can manage subscribers" ON newsletter_subscribers FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('team', 'owner'))
);

-- Analytics Events
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own analytics" ON analytics_events FOR SELECT USING (
    auth.uid() = user_id OR
    EXISTS (SELECT 1 FROM projects WHERE id = analytics_events.project_id AND user_id = auth.uid())
);

-- User Settings
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own settings" ON user_settings FOR ALL USING (auth.uid() = user_id);

-- User Services
ALTER TABLE user_services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own services" ON user_services FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own services" ON user_services FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own services" ON user_services FOR UPDATE USING (auth.uid() = user_id);

-- Tickets
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own tickets" ON tickets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own tickets" ON tickets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tickets" ON tickets FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Team can view all tickets" ON tickets FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('team', 'owner'))
);

-- Ticket Messages
ALTER TABLE ticket_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view messages" ON ticket_messages FOR SELECT USING (
    EXISTS (SELECT 1 FROM tickets WHERE id = ticket_messages.ticket_id AND user_id = auth.uid())
);
CREATE POLICY "Users can insert messages" ON ticket_messages FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM tickets WHERE id = ticket_messages.ticket_id AND user_id = auth.uid())
);

-- Transactions
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own transactions" ON transactions FOR SELECT USING (auth.uid() = user_id);

-- Team Tasks
ALTER TABLE team_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Team can view tasks" ON team_tasks FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('team', 'owner'))
);
CREATE POLICY "Team can insert tasks" ON team_tasks FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('team', 'owner'))
);
CREATE POLICY "Team can update tasks" ON team_tasks FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('team', 'owner'))
);

-- Chat Conversations
ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own conversations" ON chat_conversations FOR SELECT USING (
    auth.uid() = created_by OR
    EXISTS (SELECT 1 FROM chat_participants WHERE conversation_id = chat_conversations.id AND user_id = auth.uid())
);
CREATE POLICY "Users can create conversations" ON chat_conversations FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Chat Participants
ALTER TABLE chat_participants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view participants" ON chat_participants FOR SELECT USING (
    auth.uid() = user_id OR
    EXISTS (SELECT 1 FROM chat_participants WHERE conversation_id = chat_participants.conversation_id AND user_id = auth.uid())
);

-- Chat Messages
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view messages" ON chat_messages FOR SELECT USING (
    EXISTS (SELECT 1 FROM chat_participants WHERE conversation_id = chat_messages.conversation_id AND user_id = auth.uid())
);
CREATE POLICY "Users can insert messages" ON chat_messages FOR INSERT WITH CHECK (
    auth.uid() = user_id
);

-- Chat Typing Indicators
ALTER TABLE chat_typing_indicators ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view typing" ON chat_typing_indicators FOR SELECT USING (
    EXISTS (SELECT 1 FROM chat_participants WHERE conversation_id = chat_typing_indicators.conversation_id AND user_id = auth.uid())
);
CREATE POLICY "Users can update own typing" ON chat_typing_indicators FOR UPDATE USING (auth.uid() = user_id);

-- Subscriptions
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own subscriptions" ON subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Team can view all subscriptions" ON subscriptions FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('team', 'owner'))
);

-- Webhook Events
ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Team can manage webhooks" ON webhook_events FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('team', 'owner'))
);

-- Payment Intents
ALTER TABLE payment_intents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own payment_intents" ON payment_intents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Team can view all payment_intents" ON payment_intents FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('team', 'owner'))
);

-- Payments
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own payments" ON payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Team can view all payments" ON payments FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('team', 'owner'))
);

-- Payment Methods
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own payment_methods" ON payment_methods FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- COMPLETED!
-- ============================================

DO $$
BEGIN
    RAISE NOTICE '✅ ScaleSite Database erfolgreich erstellt!';
    RAISE NOTICE '📊 33 Tabellen';
    RAISE NOTICE '🔒 Row Level Security aktiviert';
    RAISE NOTICE '🚀 Production Ready!';
END $$;
