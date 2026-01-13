-- ScaleSite Database - PART 8: RLS Policies
-- Führe dieses SQL als LETZTES aus
-- Alle Tabellen müssen bereits existieren!

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
