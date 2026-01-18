export enum ProjectStatus {
  ACTIVE = "active",
  ON_HOLD = "on_hold",
  COMPLETED = "completed",
}

export enum ProjectStatusFilter {
  ALL = "all",
  ACTIVE = "active",
  ON_HOLD = "on_hold",
  COMPLETED = "completed",
}

export interface ProjectWithUser extends Project {
  assigned_user?: {
    id: string;
    name: string;
    email: string;
    avatar_url: string | null;
  };
}

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

export type UpdateProjectInput = Partial<CreateProjectInput>;

export interface ProjectFilters {
  status?: ProjectStatus;
  search?: string;
  assigned_to?: string;
}
