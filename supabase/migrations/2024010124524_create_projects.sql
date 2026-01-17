CREATE TYPE project_status AS ENUM ('active', 'on_hold', 'completed');

CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  status project_status DEFAULT 'active' NOT NULL,
  deadline DATE NOT NULL,
  assigned_to TEXT NOT NULL,
  budget DECIMAL(12, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_assigned_to ON projects(assigned_to);
CREATE INDEX idx_projects_deadline ON projects(deadline);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations for now" ON projects
  FOR ALL
  USING (true)
  WITH CHECK (true);