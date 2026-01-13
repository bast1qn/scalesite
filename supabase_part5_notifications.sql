-- ScaleSite Database - PART 5: Notifications & Marketing
-- Führe dieses SQL als FÜNFTES aus

DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS newsletter_campaigns CASCADE;
DROP TABLE IF EXISTS newsletter_subscribers CASCADE;

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

-- Indizes
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX idx_newsletter_campaigns_status ON newsletter_campaigns(status);
CREATE INDEX idx_newsletter_campaigns_created_by ON newsletter_campaigns(created_by);
CREATE INDEX idx_newsletter_subscribers_email ON newsletter_subscribers(email);
CREATE INDEX idx_newsletter_subscribers_status ON newsletter_subscribers(status);

SELECT '✅ Part 5 erfolgreich!' as status;
