-- Migration: Create projects table
-- Created: 2024-01-01

-- Create enum for project status
CREATE TYPE project_status AS ENUM ('active', 'on_hold', 'completed');

-- Create projects table
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  status project_status DEFAULT 'active' NOT NULL,
  deadline DATE NOT NULL,
  assigned_to uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  budget DECIMAL(12, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes for common queries
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_assigned_to ON projects(assigned_to);
CREATE INDEX idx_projects_deadline ON projects(deadline);

-- Create index for text search on name and description
CREATE INDEX idx_projects_name_search ON projects USING gin(to_tsvector('english', name));
CREATE INDEX idx_projects_description_search ON projects USING gin(to_tsvector('english', coalesce(description, '')));

-- Attach trigger to projects table
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER PUBLICATION supabase_realtime ADD TABLE projects;
-- Everyone can view all projects
CREATE POLICY "Anyone can view projects" ON projects
  FOR SELECT
  USING (true);

-- Only authenticated users can insert (and it sets their assigned_to)
CREATE POLICY "Authenticated users can insert projects" ON projects
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = assigned_to);

-- Only owner can update their projects
CREATE POLICY "Users can update own projects" ON projects
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = assigned_to)
  WITH CHECK (auth.uid() = assigned_to);

-- Only owner can delete their projects
CREATE POLICY "Users can delete own projects" ON projects
  FOR DELETE
  TO authenticated
  USING (auth.uid() = assigned_to);