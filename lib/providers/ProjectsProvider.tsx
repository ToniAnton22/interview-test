"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { PaginationInfo } from "@/components/Pagination";
import { AlertContainer } from "@/components/Alert";
import {
  CreateProjectInput,
  Project,
  ProjectStatusFilter,
  ProjectView,
} from "@/types/project";

import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "@/lib/apis/projects.api";
import { UserOwner } from "@/types/users";
import { getCurrentUser, getOwners } from "@/lib/apis/users.api";
import { useProjectsRealtime } from "@/lib/hooks/useProjectsRealtime";
import { useAlerts } from "../hooks/useAlert";

interface ProjectsContextType {
  projects: ProjectView[];
  isLoading: boolean;
  owners: UserOwner[];
  currentUserId: string;
  search: string;
  statusFilter: ProjectStatusFilter;
  pagination: PaginationInfo;
  assignee: string;

  isModalOpen: boolean;
  editingProject: Project | null;

  deletingProject: Project | null;
  isDeleting: boolean;

  setSearch: React.Dispatch<React.SetStateAction<string>>;
  setStatusFilter: React.Dispatch<React.SetStateAction<ProjectStatusFilter>>;
  handlePageChange: (page: number) => void;
  setAssignee: React.Dispatch<React.SetStateAction<string>>;

  handleCreate: (data: CreateProjectInput) => Promise<void>;
  handleUpdate: (data: CreateProjectInput) => Promise<void>;
  handleDelete: () => Promise<void>;

  openAddModal: () => void;
  openEditModal: (project: ProjectView) => void;
  closeModal: () => void;

  setDeletingProject: React.Dispatch<React.SetStateAction<Project | null>>;
}

const DEFAULT_PAGINATION: PaginationInfo = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
  hasNext: false,
  hasPrev: false,
};

const ProjectsContext = createContext<ProjectsContextType | undefined>(
  undefined
);

export function ProjectsProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<ProjectView[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [owners, setOwners] = useState<UserOwner[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProjectStatusFilter>(
    ProjectStatusFilter.ALL
  );
  const [assignee, setAssignee] = useState<string>("");

  const [currentUserId, setCurrentUserId] = useState("");
  const [pagination, setPagination] =
    useState<PaginationInfo>(DEFAULT_PAGINATION);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const [deletingProject, setDeletingProject] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Alerts
  const { alerts, showSuccess, showError, dismissAlert } = useAlerts();

  // Track if we're actively filtering (disables realtime auto-refresh)
  const isFiltering = Boolean(
    search || assignee || statusFilter !== ProjectStatusFilter.ALL
  );

  const fetchProjects = useCallback(
    async (page: number = 1) => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        params.set("page", String(page));
        params.set("limit", String(pagination.limit));

        if (statusFilter !== ProjectStatusFilter.ALL) {
          params.set("status", statusFilter);
        }
        if (search) {
          params.set("search", search);
        }
        if (assignee) {
          params.set("assignee", assignee);
        }

        const result = await getProjects(params);
        setProjects(result.data);
        setPagination(result.pagination);
      } catch (error) {
        console.error("Error fetching projects:", error);
        showError("Failed to load projects. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [pagination.limit, search, statusFilter, assignee, showError]
  );

  const fetchUser = useCallback(async () => {
    try {
      const user = await getCurrentUser();
      setCurrentUserId(user.id);

      const owners = await getOwners();
      setOwners(owners);
    } catch (error) {
      console.error("Error fetching user:", error);
      showError("Failed to load user data.");
    }
  }, [showError]);

  // ============================================
  // REALTIME SUBSCRIPTION
  // ============================================
  const handleRealtimeChange = useCallback(() => {
    if (!isFiltering) {
      fetchProjects(pagination.page);
    }
  }, [isFiltering, fetchProjects, pagination.page]);

  useProjectsRealtime({
    onInsert: handleRealtimeChange,
    onUpdate: handleRealtimeChange,
    onDelete: handleRealtimeChange,
    enabled: !isFiltering,
  });

  // ============================================
  // EFFECTS
  // ============================================

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProjects(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, statusFilter, assignee, fetchProjects]);

  useEffect(() => {
    if (!currentUserId) fetchUser();
  }, [currentUserId, fetchUser]);

  // ============================================
  // HANDLERS
  // ============================================

  const handlePageChange = useCallback(
    (page: number) => {
      fetchProjects(page);
    },
    [fetchProjects]
  );

  const handleCreate = useCallback(
    async (data: CreateProjectInput) => {
      try {
        await createProject(data);
        showSuccess("Project created successfully!");
        if (isFiltering) {
          await fetchProjects(1);
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to create project";
        showError(message);
        throw error; // Re-throw so modal knows it failed
      }
    },
    [fetchProjects, isFiltering, showSuccess, showError]
  );

  const handleUpdate = useCallback(
    async (data: CreateProjectInput) => {
      if (!editingProject) return;
      try {
        await updateProject(editingProject.id, data);
        showSuccess("Project updated successfully!");
        if (isFiltering) {
          await fetchProjects(pagination.page);
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to update project";
        showError(message);
        throw error;
      }
    },
    [editingProject, fetchProjects, pagination.page, isFiltering, showSuccess, showError]
  );

  const handleDelete = useCallback(async () => {
    if (!deletingProject) return;

    setIsDeleting(true);
    try {
      await deleteProject(deletingProject.id);
      showSuccess("Project deleted successfully!");
      setDeletingProject(null);

      if (isFiltering) {
        if (projects.length === 1 && pagination.page > 1) {
          await fetchProjects(pagination.page - 1);
        } else {
          await fetchProjects(pagination.page);
        }
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete project";
      showError(message);
    } finally {
      setIsDeleting(false);
    }
  }, [
    deletingProject,
    fetchProjects,
    pagination.page,
    projects.length,
    isFiltering,
    showSuccess,
    showError,
  ]);

  // ============================================
  // MODAL HANDLERS
  // ============================================

  const openAddModal = useCallback(() => {
    setEditingProject(null);
    setIsModalOpen(true);
  }, []);

  const openEditModal = useCallback((project: ProjectView) => {
    setEditingProject(project);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingProject(null);
  }, []);

  // ============================================
  // CONTEXT VALUE
  // ============================================

  const value = useMemo<ProjectsContextType>(
    () => ({
      projects,
      isLoading,
      currentUserId,
      owners,

      search,
      statusFilter,
      assignee,

      pagination,
      isModalOpen,
      editingProject,
      deletingProject,
      isDeleting,

      setSearch,
      setStatusFilter,
      setAssignee,
      handlePageChange,

      handleCreate,
      handleUpdate,
      handleDelete,

      openAddModal,
      openEditModal,
      closeModal,

      setDeletingProject,
    }),
    [
      projects,
      isLoading,
      currentUserId,
      owners,
      search,
      statusFilter,
      assignee,
      pagination,
      isModalOpen,
      editingProject,
      deletingProject,
      isDeleting,
      handlePageChange,
      handleCreate,
      handleUpdate,
      handleDelete,
      openAddModal,
      openEditModal,
      closeModal,
    ]
  );

  return (
    <ProjectsContext.Provider value={value}>
      {children}
      <AlertContainer alerts={alerts} onDismiss={dismissAlert} />
    </ProjectsContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error("useProjects must be used within a ProjectsProvider");
  }
  return context;
}