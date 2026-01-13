-- ============================================
-- WOCHE 26: REAL-TIME CHAT SYSTEM
-- Database Schema for Live Chat Feature
-- ============================================

-- Enable Realtime for chat tables
ALTER PUBLICATION supabase_realtime ADD TABLE chat_conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE chat_participants;
ALTER PUBLICATION supabase_realtime ADD TABLE chat_typing_indicators;

-- ============================================
-- CHAT CONVERSATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS chat_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL CHECK (type IN ('direct', 'group', 'support')),
    name TEXT,
    avatar_url TEXT,

    -- Metadata
    created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_message_at TIMESTAMP WITH TIME ZONE,

    -- Additional metadata for group chats
    metadata JSONB DEFAULT '{}'::jsonb,

    -- Indexes
    CONSTRAINT chat_conversations_name_required_for_group
        CHECK (type != 'group' OR name IS NOT NULL)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_chat_conversations_type ON chat_conversations(type);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_created_by ON chat_conversations(created_by);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_last_message_at ON chat_conversations(last_message_at DESC);

-- ============================================
-- CHAT PARTICIPANTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS chat_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

    -- Role: owner, admin, member
    role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),

    -- Timestamps
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_read_at TIMESTAMP WITH TIME ZONE,

    -- User preferences
    is_muted BOOLEAN DEFAULT false,

    -- Unique constraint: one user can only be once per conversation
    UNIQUE(conversation_id, user_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_chat_participants_conversation ON chat_participants(conversation_id);
CREATE INDEX IF NOT EXISTS idx_chat_participants_user ON chat_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_participants_last_read_at ON chat_participants(last_read_at);

-- ============================================
-- CHAT MESSAGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

    -- Message content
    content TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'text' CHECK (type IN ('text', 'image', 'file', 'system')),

    -- Metadata (file attachments, replies, reactions, etc.)
    metadata JSONB DEFAULT '{}'::jsonb,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE,
    deleted_at TIMESTAMP WITH TIME ZONE,

    -- Edit flag
    is_edited BOOLEAN DEFAULT false,

    -- Constraints
    CONSTRAINT chat_messages_content_length CHECK (char_length(content) <= 5000)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation ON chat_messages(conversation_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_sender ON chat_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_deleted_at ON chat_messages(deleted_at) WHERE deleted_at IS NOT NULL;

-- ============================================
-- CHAT TYPING INDICATORS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS chat_typing_indicators (
    conversation_id UUID NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    is_typing BOOLEAN DEFAULT true,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    PRIMARY KEY (conversation_id, user_id)
);

-- Index for cleanup of old typing indicators
CREATE INDEX IF NOT EXISTS idx_chat_typing_timestamp ON chat_typing_indicators(timestamp);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all chat tables
ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_typing_indicators ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES FOR chat_conversations
-- ============================================

-- Users can view conversations they participate in
CREATE POLICY "Users can view conversations they participate in"
    ON chat_conversations
    FOR SELECT
    USING (
        id IN (
            SELECT conversation_id
            FROM chat_participants
            WHERE user_id = auth.uid()
        )
    );

-- Users can create conversations (they will be added as participants separately)
CREATE POLICY "Users can create conversations"
    ON chat_conversations
    FOR INSERT
    WITH CHECK (created_by = auth.uid());

-- Users can update conversations they own
CREATE POLICY "Users can update conversations they own"
    ON chat_conversations
    FOR UPDATE
    USING (
        created_by = auth.uid() OR
        id IN (
            SELECT conversation_id
            FROM chat_participants
            WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
        )
    );

-- ============================================
-- RLS POLICIES FOR chat_participants
-- ============================================

-- Users can view participants in conversations they participate in
CREATE POLICY "Users can view participants in their conversations"
    ON chat_participants
    FOR SELECT
    USING (
        user_id = auth.uid() OR
        conversation_id IN (
            SELECT conversation_id
            FROM chat_participants
            WHERE user_id = auth.uid()
        )
    );

-- Users can add participants to conversations they own/admin
CREATE POLICY "Users can add participants to owned conversations"
    ON chat_participants
    FOR INSERT
    WITH CHECK (
        conversation_id IN (
            SELECT conversation_id
            FROM chat_participants
            WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
        )
    );

-- Users can update their own participant record or in conversations they own/admin
CREATE POLICY "Users can update own participant record"
    ON chat_participants
    FOR UPDATE
    USING (
        user_id = auth.uid() OR
        conversation_id IN (
            SELECT conversation_id
            FROM chat_participants
            WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
        )
    );

-- Users can remove themselves from conversations
CREATE POLICY "Users can leave conversations"
    ON chat_participants
    FOR DELETE
    USING (user_id = auth.uid());

-- ============================================
-- RLS POLICIES FOR chat_messages
-- ============================================

-- Users can view messages in conversations they participate in
CREATE POLICY "Users can view messages in their conversations"
    ON chat_messages
    FOR SELECT
    USING (
        conversation_id IN (
            SELECT conversation_id
            FROM chat_participants
            WHERE user_id = auth.uid()
        )
    );

-- Users can insert messages in conversations they participate in
CREATE POLICY "Users can send messages in their conversations"
    ON chat_messages
    FOR INSERT
    WITH CHECK (
        sender_id = auth.uid() AND
        conversation_id IN (
            SELECT conversation_id
            FROM chat_participants
            WHERE user_id = auth.uid()
        )
    );

-- Users can update their own messages
CREATE POLICY "Users can update own messages"
    ON chat_messages
    FOR UPDATE
    USING (sender_id = auth.uid());

-- Users can delete their own messages (soft delete)
CREATE POLICY "Users can delete own messages"
    ON chat_messages
    FOR UPDATE
    USING (sender_id = auth.uid() AND deleted_at IS NOT NULL);

-- ============================================
-- RLS POLICIES FOR chat_typing_indicators
-- ============================================

-- Users can view typing indicators in their conversations
CREATE POLICY "Users can view typing indicators in their conversations"
    ON chat_typing_indicators
    FOR SELECT
    USING (
        conversation_id IN (
            SELECT conversation_id
            FROM chat_participants
            WHERE user_id = auth.uid()
        )
    );

-- Users can update typing indicators for themselves
CREATE POLICY "Users can update own typing indicators"
    ON chat_typing_indicators
    FOR ALL
    USING (user_id = auth.uid());

-- ============================================
-- FUNCTIONS AND TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_chat_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for chat_conversations
CREATE TRIGGER chat_conversations_updated_at
    BEFORE UPDATE ON chat_conversations
    FOR EACH ROW
    EXECUTE FUNCTION update_chat_updated_at();

-- Function to update conversation's last_message_at
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE chat_conversations
    SET last_message_at = NOW()
    WHERE id = NEW.conversation_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for chat_messages
CREATE TRIGGER chat_messages_last_message_at
    AFTER INSERT ON chat_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_conversation_last_message();

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to get unread message count for a user
CREATE OR REPLACE FUNCTION get_unread_count(user_id_param UUID)
RETURNS TABLE (
    conversation_id UUID,
    unread_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.conversation_id,
        COUNT(m.id) AS unread_count
    FROM chat_participants p
    LEFT JOIN chat_messages m ON
        m.conversation_id = p.conversation_id AND
        m.created_at > COALESCE(p.last_read_at, '1970-01-01'::timestamp) AND
        m.sender_id != user_id_param AND
        m.deleted_at IS NULL
    WHERE p.user_id = user_id_param
    GROUP BY p.conversation_id;
END;
$$ LANGUAGE plpgsql;

-- Function to mark all messages in a conversation as read
CREATE OR REPLACE FUNCTION mark_conversation_read(
    conversation_id_param UUID,
    user_id_param UUID
)
RETURNS void AS $$
BEGIN
    UPDATE chat_participants
    SET last_read_at = NOW()
    WHERE conversation_id = conversation_id_param
    AND user_id = user_id_param;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- CLEANUP JOB FOR OLD TYPING INDICATORS
-- ============================================

-- Create a function to clean up old typing indicators
CREATE OR REPLACE FUNCTION cleanup_old_typing_indicators()
RETURNS void AS $$
BEGIN
    DELETE FROM chat_typing_indicators
    WHERE timestamp < NOW() - INTERVAL '5 minutes';
END;
$$ LANGUAGE plpgsql;

-- Note: This should be called by a cron job or pg_cron extension
-- SELECT cron.schedule('cleanup-typing-indicators', '*/5 * * * *', 'SELECT cleanup_old_typing_indicators();');

-- ============================================
-- GRANTS
-- ============================================

-- Grant usage on sequences
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Grant select on tables for authenticated users
GRANT SELECT ON ALL TABLES IN SCHEMA public TO authenticated;

-- Grant necessary permissions
GRANT INSERT, UPDATE ON chat_conversations TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON chat_participants TO authenticated;
GRANT SELECT, INSERT, UPDATE ON chat_messages TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON chat_typing_indicators TO authenticated;

-- ============================================
-- SAMPLE DATA (OPTIONAL - FOR TESTING)
-- ============================================

-- This would be populated by the application, not in the schema

-- ============================================
-- END OF CHAT SCHEMA
-- ============================================

COMMIT;
