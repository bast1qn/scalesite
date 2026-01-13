-- ScaleSite Database - PART 2: Projects & Content
-- Führe dieses SQL als ZWEITES aus

DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS project_milestones CASCADE;
DROP TABLE IF EXISTS content_generations CASCADE;

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

-- Indizes
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_project_milestones_project_id ON project_milestones(project_id);
CREATE INDEX idx_content_generations_user_id ON content_generations(user_id);
CREATE INDEX idx_content_generations_project_id ON content_generations(project_id);

SELECT '✅ Part 2 erfolgreich!' as status;
