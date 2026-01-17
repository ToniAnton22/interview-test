export type ProjectStatus = 'active' | 'on_hold' | 'completed';

export interface Project {
  id: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  deadline: string;
  assigned_to: string;
  budget: number;
  created_at: string;
  updated_at: string;
}

export interface CreateProjectInput {
  name: string;
  description?: string;
  status?: ProjectStatus;
  deadline: string;
  assigned_to: string;
  budget: number;
}

export type UpdateProjectInput = Partial<CreateProjectInput>

export interface ProjectFilters {
  status?: ProjectStatus;
  search?: string;
  assigned_to?: string;
}