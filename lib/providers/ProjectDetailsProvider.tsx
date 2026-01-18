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
import type { CreateProjectInput, ProjectView } from "@/types/project";
import {
  deleteProject,
  getCurrentUserId,
  getProject,
  updateProject,
} from "@/lib/apis/projectDetails.api";

type ProjectDetailsContextType = {
  id: string;

  project: ProjectView | null;
  isLoading: boolean;

  currentUserId: string;

  // edit modal
  isModalOpen: boolean;
  openEditModal: () => void;
  closeModal: () => void;

  // delete modal
  deletingProject: ProjectView | null;
  isDeleting: boolean;
  setDeletingProject: React.Dispatch<React.SetStateAction<ProjectView | null>>;

  // actions
  refetch: () => Promise<void>;
  handleUpdate: (data: CreateProjectInput) => Promise<void>;
  handleDelete: () => Promise<void>;
};

const ProjectDetailsContext = createContext<ProjectDetailsContextType | undefined>(
  undefined,
);

export function ProjectDetailsProvider({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) {
  const [project, setProject] = useState<ProjectView | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [currentUserId, setCurrentUserId] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [deletingProject, setDeletingProject] = useState<ProjectView | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getProject(id);
      setProject(data);
    } catch (e) {
      console.error(e);
      setProject(null);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const uid = await getCurrentUserId();
        if (!cancelled) setCurrentUserId(uid);
      } catch (e) {
        console.error(e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const openEditModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  const handleUpdate = useCallback(
    async (data: CreateProjectInput) => {
      if (!project) return;

      await updateProject(project.id, data);
      setIsModalOpen(false);
      await refetch();
    },
    [project, refetch],
  );

  const handleDelete = useCallback(async () => {
    if (!deletingProject) return;

    setIsDeleting(true);
    try {
      await deleteProject(deletingProject.id);
      // client will navigate back to /dashboard
    } finally {
      setIsDeleting(false);
    }
  }, [deletingProject]);

  const value = useMemo<ProjectDetailsContextType>(
    () => ({
      id,
      project,
      isLoading,
      currentUserId,
      isModalOpen,
      openEditModal,
      closeModal,
      deletingProject,
      isDeleting,
      setDeletingProject,
      refetch,
      handleUpdate,
      handleDelete,
    }),
    [
      id,
      project,
      isLoading,
      currentUserId,
      isModalOpen,
      openEditModal,
      closeModal,
      deletingProject,
      isDeleting,
      refetch,
      handleUpdate,
      handleDelete,
    ],
  );

  return (
    <ProjectDetailsContext.Provider value={value}>
      {children}
    </ProjectDetailsContext.Provider>
  );
}

export function useProjectDetails() {
  const ctx = useContext(ProjectDetailsContext);
  if (!ctx)
    throw new Error("useProjectDetails must be used within ProjectDetailsProvider");
  return ctx;
}
