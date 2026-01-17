import { ProjectStatus } from "@/types/project";

interface StatusBadgeProps {
  status: ProjectStatus;
}

const statusConfig: Record<
  ProjectStatus,
  { label: string; className: string }
> = {
  active: {
    label: "Active",
    className: "bg-green-100 text-green-800 border-green-200",
  },
  on_hold: {
    label: "On Hold",
    className: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  completed: {
    label: "Completed",
    className: "bg-blue-100 text-blue-800 border-blue-200",
  },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.className}`}
    >
      {config.label}
    </span>
  );
}
