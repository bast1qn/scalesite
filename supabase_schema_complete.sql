-- ScaleSite Complete Database Schema
-- Führe dieses SQL im Supabase SQL Editor aus
-- Dieses File enthält ALLE Tabellen für die 32-Wochen Implementierung

-- ============================================
-- PROJECTS (Woche 4)
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

CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);

-- ============================================
-- PROJECT MILESTONES (Woche 10)
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

CREATE INDEX IF NOT EXISTS idx_project_milestones_project_id ON project_milestones(project_id);

-- ============================================
-- CONTENT GENERATIONS (Woche 11-12)
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
    is_favorite BOOLEAN DEFAULT FALSE,
    variations JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_content_generations_user_id ON content_generations(user_id);
CREATE INDEX IF NOT EXISTS idx_content_generations_project_id ON content_generations(project_id);

-- ============================================
-- TEAM MEMBERS (Woche 19-20)
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

CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_member_id ON team_members(member_id);

-- ============================================
-- TEAM INVITATIONS (Woche 20)
-- ============================================
CREATE TABLE IF NOT EXISTS team_invitations (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    invited_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member',
    status TEXT DEFAULT 'pending',
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_team_invitations_email ON team_invitations(email);

-- ============================================
-- TEAM ACTIVITY (Woche 20)
-- ============================================
CREATE TABLE IF NOT EXISTS team_activity (
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

CREATE INDEX IF NOT EXISTS idx_team_activity_user_id ON team_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_team_activity_created_at ON team_activity(created_at DESC);

-- ============================================
-- INVOICES (Woche 17-18)
-- ============================================
CREATE TABLE IF NOT EXISTS invoices (
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

CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_invoice_number ON invoices(invoice_number);

-- ============================================
-- NOTIFICATIONS (Woche 25-26)
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

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- ============================================
-- NEWSLETTER CAMPAIGNS (Woche 23-24)
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
    timezone TEXT,
    sent_count INTEGER DEFAULT 0,
    open_count INTEGER DEFAULT 0,
    click_count INTEGER DEFAULT 0,
    unsubscribe_count INTEGER DEFAULT 0,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    sent_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_newsletter_campaigns_status ON newsletter_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_newsletter_campaigns_created_by ON newsletter_campaigns(created_by);

-- ============================================
-- NEWSLETTER SUBSCRIBERS
-- ============================================
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
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

CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_status ON newsletter_subscribers(status);

-- ============================================
-- ANALYTICS EVENTS (Woche 13-14)
-- ============================================
CREATE TABLE IF NOT EXISTS analytics_events (
    id TEXT PRIMARY KEY,
    project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    event_type TEXT NOT NULL,
    event_data JSONB DEFAULT '{}',
    path TEXT,
    timestamp BIGINT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_analytics_project_id ON analytics_events(project_id);
CREATE INDEX IF NOT EXISTS idx_analytics_timestamp ON analytics_events(timestamp);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics_events(event_type);

-- ============================================
-- USER SETTINGS (für verschiedene Features)
-- ============================================
CREATE TABLE IF NOT EXISTS user_settings (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    key TEXT NOT NULL,
    value JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, key)
);

CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);

-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================

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
CREATE POLICY "Users can view milestones of own projects" ON project_milestones FOR SELECT USING (
    EXISTS (SELECT 1 FROM projects WHERE id = project_milestones.project_id AND user_id = auth.uid())
);
CREATE POLICY "Users can insert milestones for own projects" ON project_milestones FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM projects WHERE id = project_milestones.project_id AND user_id = auth.uid())
);
CREATE POLICY "Users can update milestones of own projects" ON project_milestones FOR UPDATE USING (
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

-- Newsletter Subscribers (public read, team write)
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

-- Team Activity
ALTER TABLE team_activity ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Team can view activity" ON team_activity FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('team', 'owner'))
);

-- User Settings
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own settings" ON user_settings FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- PROFILES ERWEITERN (falls nicht bereits geschehen)
-- ============================================

-- Neue Spalten zu profiles hinzufügen (falls noch nicht vorhanden)
DO $$
BEGIN
    -- Prüfen ob Spalte existiert, falls nicht hinzufügen
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'profiles' AND column_name = 'phone'
    ) THEN
        ALTER TABLE profiles ADD COLUMN phone TEXT;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'profiles' AND column_name = 'timezone'
    ) THEN
        ALTER TABLE profiles ADD COLUMN timezone TEXT DEFAULT 'Europe/Berlin';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'profiles' AND column_name = 'preferences'
    ) THEN
        ALTER TABLE profiles ADD COLUMN preferences JSONB DEFAULT '{}';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'profiles' AND column_name = 'onboarding_completed'
    ) THEN
        ALTER TABLE profiles ADD COLUMN onboarding_completed BOOLEAN DEFAULT FALSE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'profiles' AND column_name = 'avatar_url'
    ) THEN
        ALTER TABLE profiles ADD COLUMN avatar_url TEXT;
    END IF;
END $$;

-- ============================================
-- TICKETS ERWEITERN (falls nicht bereits geschehen)
-- ============================================

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'tickets' AND column_name = 'project_id'
    ) THEN
        ALTER TABLE tickets ADD COLUMN project_id TEXT REFERENCES projects(id) ON DELETE SET NULL;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'tickets' AND column_name = 'priority_order'
    ) THEN
        ALTER TABLE tickets ADD COLUMN priority_order INTEGER DEFAULT 0;
    END IF;
END $$;

-- ============================================
-- USER SERVICES ERWEITERN (falls nicht bereits geschehen)
-- ============================================

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'user_services' AND column_name = 'project_id'
    ) THEN
        ALTER TABLE user_services ADD COLUMN project_id TEXT REFERENCES projects(id) ON DELETE SET NULL;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'user_services' AND column_name = 'started_at'
    ) THEN
        ALTER TABLE user_services ADD COLUMN started_at TIMESTAMPTZ;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'user_services' AND column_name = 'completed_at'
    ) THEN
        ALTER TABLE user_services ADD COLUMN completed_at TIMESTAMPTZ;
    END IF;
END $$;

-- ============================================
-- TRIGGER FÜR UPDATED_AT
-- ============================================

-- Funktion für updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger für projects
DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger für invoices
DROP TRIGGER IF EXISTS update_invoices_updated_at ON invoices;
CREATE TRIGGER update_invoices_updated_at
    BEFORE UPDATE ON invoices
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- COMPLETED!
-- ============================================

COMMENT ON TABLE projects IS 'Website-Projekte mit Konfiguration und Status';
COMMENT ON TABLE project_milestones IS 'Meilensteine für Projekt-Tracking';
COMMENT ON TABLE content_generations IS 'AI-generierte Inhalte';
COMMENT ON TABLE team_members IS 'Team-Zusammenarbeit';
COMMENT ON TABLE team_invitations IS 'Team-Einladungen';
COMMENT ON TABLE team_activity IS 'Team-Aktivitäts-Feed';
COMMENT ON TABLE invoices IS 'Rechnungen';
COMMENT ON TABLE notifications IS 'Benachrichtigungen';
COMMENT ON TABLE newsletter_campaigns IS 'Newsletter-Kampagnen';
COMMENT ON TABLE newsletter_subscribers IS 'Newsletter-Abonnenten';
COMMENT ON TABLE analytics_events IS 'Analytics-Events';
COMMENT ON TABLE user_settings IS 'Benutzer-Einstellungen';
