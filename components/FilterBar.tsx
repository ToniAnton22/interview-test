"use client";

import { ProjectStatusFilter } from "@/types/project";
import { UserOwner } from "@/types/users";
import { Search, Plus } from "lucide-react";

interface FilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;

  status: ProjectStatusFilter;
  onStatusChange: (value: ProjectStatusFilter) => void;

  assignee: string; // "" = all
  owners: UserOwner[];
  currentUserId: string;
  onAssigneeChange: (value: string) => void;

  onAddClick: () => void;
}

export default function FilterBar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  assignee,
  owners,
  currentUserId,
  onAssigneeChange,
  onAddClick,
}: FilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search projects..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 text-zinc-700 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
        />
      </div>

      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value as ProjectStatusFilter)}
        className="px-4 py-2 text-zinc-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white"
      >
        <option value={ProjectStatusFilter.ALL}>All Status</option>
        <option value={ProjectStatusFilter.ACTIVE}>Active</option>
        <option value={ProjectStatusFilter.ON_HOLD}>On Hold</option>
        <option value={ProjectStatusFilter.COMPLETED}>Completed</option>
      </select>

      <select
        value={assignee}
        onChange={(e) => onAssigneeChange(e.target.value)}
        className="px-4 py-2 text-zinc-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white"
      >
        <option value="">All Owners</option>
        {owners.map((owner) => (
          <option key={owner.id} value={owner.id}>
            {owner.id === currentUserId ? "Me" : owner.name}
          </option>
        ))}
      </select>

      <button
        onClick={onAddClick}
        className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
      >
        <Plus className="w-5 h-5" />
        <span>Add Project</span>
      </button>
    </div>
  );
}
