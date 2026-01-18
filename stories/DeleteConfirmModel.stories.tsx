import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import { Project, ProjectStatus } from "@/types/project";


const meta: Meta<typeof DeleteConfirmModal> = {
  title: "Components/DeleteConfirmModal",
  component: DeleteConfirmModal,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof DeleteConfirmModal>;

const mockProject: Project = {
  id: "123",
  name: "Website Redesign",
  description: "Complete overhaul of the company website",
  status: ProjectStatus.ACTIVE,
  deadline: "2024-12-31",
  assigned_to: "user-123",
  budget: 25000,
  created_at: "2024-01-01",
  updated_at: "2024-01-01",
};

export const Default: Story = {
  args: {
    isOpen: true,
    project: mockProject,
    isLoading: false,
    onClose: () => console.log("Close"),
    onConfirm: async () => {
      console.log("Confirm delete");
      await new Promise((r) => setTimeout(r, 1000));
    },
  },
};

export const Loading: Story = {
  args: {
    isOpen: true,
    project: mockProject,
    isLoading: true,
    onClose: () => console.log("Close"),
    onConfirm: async () => console.log("Confirm delete"),
  },
};

export const LongProjectName: Story = {
  args: {
    isOpen: true,
    project: {
      ...mockProject,
      name: "This is a very long project name that might wrap to multiple lines in the modal",
    },
    isLoading: false,
    onClose: () => console.log("Close"),
    onConfirm: async () => console.log("Confirm delete"),
  },
};

export const Closed: Story = {
  args: {
    isOpen: false,
    project: mockProject,
    isLoading: false,
    onClose: () => console.log("Close"),
    onConfirm: async () => console.log("Confirm delete"),
  },
};

// Interactive example
const InteractiveDeleteModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    setIsLoading(false);
    setIsOpen(false);
    alert("Project deleted!");
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-red-600 text-white rounded-lg"
      >
        Delete Project
      </button>

      <DeleteConfirmModal
        isOpen={isOpen}
        project={mockProject}
        isLoading={isLoading}
        onClose={() => setIsOpen(false)}
        onConfirm={handleConfirm}
      />
    </div>
  );
};

export const Interactive: Story = {
  render: () => <InteractiveDeleteModal />,
};
