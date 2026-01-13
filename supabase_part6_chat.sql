-- ScaleSite Database - PART 6: Chat & Analytics
-- Führe dieses SQL als SECHSTES aus

DROP TABLE IF EXISTS analytics_events CASCADE;
DROP TABLE IF EXISTS user_settings CASCADE;
DROP TABLE IF EXISTS chat_conversations CASCADE;
DROP TABLE IF EXISTS chat_participants CASCADE;
DROP TABLE IF EXISTS chat_messages CASCADE;
DROP TABLE IF EXISTS chat_typing_indicators CASCADE;

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

-- Indizes
CREATE INDEX idx_analytics_project_id ON analytics_events(project_id);
CREATE INDEX idx_analytics_timestamp ON analytics_events(timestamp);
CREATE INDEX idx_analytics_event_type ON analytics_events(event_type);
CREATE INDEX idx_user_settings_user_id ON user_settings(user_id);
CREATE INDEX idx_chat_conversations_created_by ON chat_conversations(created_by);
CREATE INDEX idx_chat_conversations_project_id ON chat_conversations(project_id);
CREATE INDEX idx_chat_participants_user_id ON chat_participants(user_id);
CREATE INDEX idx_chat_messages_conversation_id ON chat_messages(conversation_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at DESC);
CREATE INDEX idx_chat_typing_indicators_updated_at ON chat_typing_indicators(updated_at);

SELECT '✅ Part 6 erfolgreich!' as status;
