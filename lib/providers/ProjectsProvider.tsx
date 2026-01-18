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

interface ProjectsContextType {
  projects: ProjectView[];
  isLoading: boolean;
  currentUserId: string;
  search: string;
  statusFilter: ProjectStatusFilter;
  pagination: PaginationInfo;

  isModalOpen: boolean;
  editingProject: Project | null;

  deletingProject: Project | null;
  isDeleting: boolean;

  setSearch: React.Dispatch<React.SetStateAction<string>>;
  setStatusFilter: React.Dispatch<React.SetStateAction<ProjectStatusFilter>>;
  handlePageChange: (page: number) => void;

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
  undefined,
);

export function ProjectsProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<ProjectView[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProjectStatusFilter>(
    ProjectStatusFilter.ALL,
  );

  const [currentUserId, setCurrentUserId] = useState("");
  const [pagination, setPagination] =
    useState<PaginationInfo>(DEFAULT_PAGINATION);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const [deletingProject, setDeletingProject] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

        const result = await getProjects(params);
        setProjects(result.data);
        setPagination(result.pagination);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [pagination.limit, search, statusFilter],
  );

  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch("/api/user/getCurrent");
      if (!res.ok) throw new Error("Failed to fetch user.");
      const user = await res.json();
      setCurrentUserId(user.id);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  }, []);

  // Refetch when filters change (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProjects(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, statusFilter, fetchProjects]);

  // Get current user once
  useEffect(() => {
    if (!currentUserId) fetchUser();
  }, [currentUserId, fetchUser]);

  const handlePageChange = useCallback(
    (page: number) => {
      fetchProjects(page);
    },
    [fetchProjects],
  );

  const handleCreate = useCallback(
    async (data: CreateProjectInput) => {
      await createProject(data);
      await fetchProjects(1);
    },
    [fetchProjects],
  );

  const handleUpdate = useCallback(
    async (data: CreateProjectInput) => {
      if (!editingProject) return;
      await updateProject(editingProject.id, data);
      await fetchProjects(pagination.page);
    },
    [editingProject, fetchProjects, pagination.page],
  );

  const handleDelete = useCallback(async () => {
    if (!deletingProject) return;

    setIsDeleting(true);
    try {
      await deleteProject(deletingProject.id);
      setDeletingProject(null);

      if (projects.length === 1 && pagination.page > 1) {
        await fetchProjects(pagination.page - 1);
      } else {
        await fetchProjects(pagination.page);
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    } finally {
      setIsDeleting(false);
    }
  }, [deletingProject, fetchProjects, pagination.page, projects.length]);

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

  const value = useMemo<ProjectsContextType>(
    () => ({
      projects,
      isLoading,
      currentUserId,
      search,
      statusFilter,
      pagination,

      isModalOpen,
      editingProject,

      deletingProject,
      isDeleting,

      setSearch,
      setStatusFilter,
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
      search,
      statusFilter,
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
    ],
  );

  return (
    <ProjectsContext.Provider value={value}>
      {children}
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
