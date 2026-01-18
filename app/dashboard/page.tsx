"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Project,
  CreateProjectInput,
  ProjectStatusFilter,
  ProjectView,
} from "@/types/project";
import ProjectTable from "@/components/ProjectTable";
import ProjectModal from "@/components/ProjectModal";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import FilterBar from "@/components/FilterBar";

export default function DashboardPage() {
  const [projects, setProjects] = useState<ProjectView[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProjectStatusFilter>(
    ProjectStatusFilter.ALL,
  );
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== ProjectStatusFilter.ALL)
        params.set("status", statusFilter);
      if (search) params.set("search", search);

      const response = await fetch(`/api/projects?${params}`);
      if (!response.ok) throw new Error("Failed to fetch projects");
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error("Error fetching details:", error);
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, search]);

  const fetchUsers = useCallback(async () => {
    try {
      const getUser = await fetch("/api/user/getCurrent");
      if (!getUser.ok) throw new Error("Failed to fetch user.");

      const user = await getUser.json();
      setCurrentUserId(user.id);
    } catch (error) {
      console.error("Error fetching details:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProjects();
      if (!currentUserId) {
        fetchUsers();
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [search, fetchProjects, fetchUsers, currentUserId]);

  const handleCreate = async (data: CreateProjectInput) => {
    const response = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create project");
    }

    fetchProjects();
  };

  const handleUpdate = async (data: CreateProjectInput) => {
    if (!editingProject) return;

    const response = await fetch(`/api/projects/${editingProject.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update project");
    }

    fetchProjects();
  };

  const handleDelete = async () => {
    if (!deletingProject) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/projects/${deletingProject.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete project");
      }

      setDeletingProject(null);
      fetchProjects();
    } catch (error) {
      console.error("Error deleting project:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Modal handlers
  const openAddModal = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage and track all your projects in one place
              </p>
            </div>
            <div className="text-sm text-gray-500">
              {projects.length} project{projects.length !== 1 ? "s" : ""}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          status={statusFilter}
          onStatusChange={setStatusFilter}
          onAddClick={openAddModal}
        />

        <ProjectTable
          projects={projects}
          currentUserId={currentUserId}
          onEdit={openEditModal}
          onDelete={setDeletingProject}
          isLoading={isLoading}
        />
      </main>

      <ProjectModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={editingProject ? handleUpdate : handleCreate}
        project={editingProject}
      />

      <DeleteConfirmModal
        isOpen={!!deletingProject}
        project={deletingProject}
        onClose={() => setDeletingProject(null)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}
