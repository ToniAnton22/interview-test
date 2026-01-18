import type { Meta, StoryObj } from "@storybook/react";
import ProjectTable from "@/components/ProjectTable";
import { ProjectStatus, ProjectView } from "@/types/project";

const meta: Meta<typeof ProjectTable> = {
  title: "Components/ProjectTable",
  component: ProjectTable,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="bg-gray-50 p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ProjectTable>;

const mockProjects: ProjectView[] = [
  {
    id: "1",
    name: "Website Redesign",
    description: "Complete overhaul of the company website with modern design",
    status: ProjectStatus.ACTIVE,
    deadline: "2024-12-31",
    assigned_to: "user-1",
    budget: 25000,
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
    assigned_user: { id: "user-1", name: "Alice Johnson" },
  },
  {
    id: "2",
    name: "Mobile App Development",
    description: "Build native iOS and Android apps",
    status: ProjectStatus.ACTIVE,
    deadline: "2024-09-30",
    assigned_to: "user-2",
    budget: 50000,
    created_at: "2024-01-15",
    updated_at: "2024-01-15",
    assigned_user: { id: "user-2", name: "Bob Smith" },
  },
  {
    id: "3",
    name: "Database Migration",
    description: null,
    status: ProjectStatus.ON_HOLD,
    deadline: "2024-06-30",
    assigned_to: "user-1",
    budget: 15000,
    created_at: "2024-02-01",
    updated_at: "2024-02-01",
    assigned_user: { id: "user-1", name: "Alice Johnson" },
  },
  {
    id: "4",
    name: "Security Audit",
    description: "Comprehensive security review and penetration testing",
    status: ProjectStatus.COMPLETED,
    deadline: "2024-03-31",
    assigned_to: "user-3",
    budget: 10000,
    created_at: "2024-01-01",
    updated_at: "2024-03-31",
    assigned_user: { id: "user-3", name: "Carol Williams" },
  },
  {
    id: "5",
    name: "API Integration",
    description: "Integrate third-party payment and shipping APIs",
    status: ProjectStatus.ACTIVE,
    deadline: "2024-08-15",
    assigned_to: "user-2",
    budget: 20000,
    created_at: "2024-02-15",
    updated_at: "2024-02-15",
    assigned_user: { id: "user-2", name: "Bob Smith" },
  },
];

export const Default: Story = {
  args: {
    projects: mockProjects,
    currentUserId: "user-1",
    isLoading: false,
    onEdit: (project) => console.log("Edit:", project),
    onDelete: (project) => console.log("Delete:", project),
  },
};

export const Loading: Story = {
  args: {
    projects: [],
    currentUserId: "user-1",
    isLoading: true,
    onEdit: (project) => console.log("Edit:", project),
    onDelete: (project) => console.log("Delete:", project),
  },
};

export const Empty: Story = {
  args: {
    projects: [],
    currentUserId: "user-1",
    isLoading: false,
    onEdit: (project) => console.log("Edit:", project),
    onDelete: (project) => console.log("Delete:", project),
  },
};

export const SingleProject: Story = {
  args: {
    projects: [mockProjects[0]],
    currentUserId: "user-1",
    isLoading: false,
    onEdit: (project) => console.log("Edit:", project),
    onDelete: (project) => console.log("Delete:", project),
  },
};

export const NoEditPermissions: Story = {
  args: {
    projects: mockProjects,
    currentUserId: "user-999", // User doesn't own any projects
    isLoading: false,
    onEdit: (project) => console.log("Edit:", project),
    onDelete: (project) => console.log("Delete:", project),
  },
};

export const NotLoggedIn: Story = {
  args: {
    projects: mockProjects,
    currentUserId: "",
    isLoading: false,
    onEdit: (project) => console.log("Edit:", project),
    onDelete: (project) => console.log("Delete:", project),
  },
};

export const ManyProjects: Story = {
  args: {
    projects: [
      ...mockProjects,
      ...mockProjects.map((p, i) => ({
        ...p,
        id: `${p.id}-copy-${i}`,
        name: `${p.name} (Copy ${i + 1})`,
      })),
    ],
    currentUserId: "user-1",
    isLoading: false,
    onEdit: (project) => console.log("Edit:", project),
    onDelete: (project) => console.log("Delete:", project),
  },
};