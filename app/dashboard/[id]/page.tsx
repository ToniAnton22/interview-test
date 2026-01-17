"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Project, CreateProjectInput } from "@/types/project";
import ProjectModal from "@/components/ProjectModal";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import StatusBadge from "@/components/StatusBadge";

export default function ProjectDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id;

  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);

  const fetchProject = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const response = await fetch(`/api/projects/${id}`);
      if (!response.ok) throw new Error("Failed to fetch project");
      const data = (await response.json()) as Project;

      setProject(data);
    } catch (error) {
      console.error("Error fetching project:", error);
      setProject(null);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  const handleUpdate = async (data: CreateProjectInput) => {
    if (!project) return;

    const response = await fetch(`/api/projects/${project.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update project");
    }

    setIsModalOpen(false);
    fetchProject();
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
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Error deleting project:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const openEditModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                ← Back to Projects
              </button>

              <h1 className="text-2xl font-bold text-gray-900 mt-2">
                {isLoading
                  ? "Loading..."
                  : (project?.name ?? "Project not found")}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                View and manage this project
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={openEditModal}
                disabled={!project || isLoading}
                className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Edit
              </button>

              <button
                type="button"
                onClick={() => project && setDeletingProject(project)}
                disabled={!project || isLoading}
                className="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-base font-semibold text-gray-900">Details</h2>
            <p className="text-sm text-gray-500 mt-1">
              Basic information about this project
            </p>
          </div>

          <div className="px-6 py-6">
            {isLoading ? (
              <div className="text-sm text-gray-500">Loading project…</div>
            ) : !project ? (
              <div className="text-sm text-gray-500">
                We couldn’t find that project. It may have been deleted.
              </div>
            ) : (
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <StatusBadge status={project.status} />
                  </dd>
                </div>

                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Assigned to
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {project.assigned_to}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Deadline
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {formatDate(project.deadline)}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm font-medium text-gray-500">Budget</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {typeof project.budget === "number"
                      ? `$${project.budget.toLocaleString()}`
                      : project.budget
                        ? `$${Number(project.budget).toLocaleString()}`
                        : "—"}
                  </dd>
                </div>

                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">
                    Description
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                    {project.description ?? "—"}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm font-medium text-gray-500">Created</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {formatDate(project.created_at as unknown as string)}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Last updated
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {formatDate(project.updated_at as unknown as string)}
                  </dd>
                </div>
              </dl>
            )}
          </div>
        </div>
      </main>

      <ProjectModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleUpdate}
        project={project}
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
