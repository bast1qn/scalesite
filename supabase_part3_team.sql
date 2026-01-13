-- ScaleSite Database - PART 3: Team & Tasks
-- Führe dieses SQL als DRITTES aus

DROP TABLE IF EXISTS team_members CASCADE;
DROP TABLE IF EXISTS team_invitations CASCADE;
DROP TABLE IF EXISTS team_activity CASCADE;
DROP TABLE IF EXISTS team_tasks CASCADE;

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

-- Indizes
CREATE INDEX idx_team_members_team_id ON team_members(team_id);
CREATE INDEX idx_team_members_member_id ON team_members(member_id);
CREATE INDEX idx_team_invitations_email ON team_invitations(email);
CREATE INDEX idx_team_activity_user_id ON team_activity(user_id);
CREATE INDEX idx_team_activity_created_at ON team_activity(created_at DESC);
CREATE INDEX idx_team_tasks_team_id ON team_tasks(team_id);
CREATE INDEX idx_team_tasks_assigned_to ON team_tasks(assigned_to);
CREATE INDEX idx_team_tasks_status ON team_tasks(status);

SELECT '✅ Part 3 erfolgreich!' as status;
