"use client";
import Link from "next/link";

import ProjectModal from "@/components/ProjectModal/ProjectModal";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import StatusBadge from "@/components/StatusBadge";
import { formatDate } from "@/lib/utils/formatters/formatDate";
import {
  ProjectDetailsProvider,
  useProjectDetails,
} from "@/lib/providers/ProjectDetailsProvider";
import { formatBudget } from "@/lib/utils/formatters/formatBudget";
import { useRouter } from "next/navigation";

function ProjectDetailsView() {
  const router = useRouter();
  const {
    project,
    isLoading,
    currentUserId,
    isModalOpen,
    openEditModal,
    closeModal,
    deletingProject,
    isDeleting,
    setDeletingProject,
    handleUpdate,
    handleDelete,
  } = useProjectDetails();

  const canEdit = !!project && currentUserId === project.assigned_user.id;
  
  const onConfirmDelete = async () => {
    try {
      await handleDelete();
      router.push("/dashboard");
      router.refresh();
    } catch {
      // Error is handled by the provider (shows alert)
      // Don't navigate - stay on page
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div>
              <Link
                href="/dashboard"
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                ← Back to Projects
              </Link>

              <h1 className="text-2xl font-bold text-gray-900 mt-2">
                {isLoading
                  ? "Loading..."
                  : (project?.name ?? "Project not found")}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                View and manage this project
              </p>
            </div>

            {canEdit && (
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
            )}
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
                    {project.assigned_user.name}
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
                    {formatBudget(project.budget)}
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
        onConfirm={onConfirmDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}

export default function ProjectDetailsClient({ id }: { id: string }) {
  return (
    <ProjectDetailsProvider id={id}>
      <ProjectDetailsView />
    </ProjectDetailsProvider>
  );
}