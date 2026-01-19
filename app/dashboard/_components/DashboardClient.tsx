"use client";
import ProjectTable from "@/components/ProjectTable";
import ProjectModal from "@/components/ProjectModal/ProjectModal";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import FilterBar from "@/components/FilterBar";
import Pagination from "@/components/Pagination";
import { useProjects } from "@/lib/providers/ProjectsProvider";

export default function DashboardPage() {
  const {
    projects,
    isLoading,
    currentUserId,
    search,
    statusFilter,
    pagination,
    editingProject,
    deletingProject,
    isDeleting,
    owners,
    assignee,
    isModalOpen,
    setAssignee,
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
    handleLogout
  } = useProjects();
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage and track all your projects in one place
              </p>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition mt-2"
              >
                Logout
              </button>
            </div>
            <div className="invisible sm:visible text-sm text-gray-500 my-2">
              {pagination.total} project{pagination.total !== 1 ? "s" : ""}
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
          owners={owners}
          assignee={assignee}
          currentUserId={currentUserId}
          onAssigneeChange={setAssignee}
          onAddClick={openAddModal}
        />

        <ProjectTable
          projects={projects}
          currentUserId={currentUserId}
          onEdit={openEditModal}
          onDelete={setDeletingProject}
          isLoading={isLoading}
        />
        <Pagination pagination={pagination} onPageChange={handlePageChange} />
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
