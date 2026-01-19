import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import ProjectModal from "@/components/ProjectModal/ProjectModal";
import { Project, CreateProjectInput, ProjectStatus } from "@/types/project";

const meta: Meta<typeof ProjectModal> = {
  title: "Components/ProjectModal",
  component: ProjectModal,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof ProjectModal>;

const mockProject: Project = {
  id: "123",
  name: "Website Redesign",
  description: "Complete overhaul of the company website with modern design",
  status: ProjectStatus.ACTIVE,
  deadline: "2024-12-31",
  assigned_to: "user-123",
  budget: 25000,
  created_at: "2024-01-01",
  updated_at: "2024-01-01",
};

export const CreateNew: Story = {
  args: {
    isOpen: true,
    project: null,
    onClose: () => console.log("Close"),
    onSave: async (data) => {
      console.log("Save:", data);
      await new Promise((r) => setTimeout(r, 1000));
    },
  },
};

export const EditExisting: Story = {
  args: {
    isOpen: true,
    project: mockProject,
    onClose: () => console.log("Close"),
    onSave: async (data) => {
      console.log("Save:", data);
      await new Promise((r) => setTimeout(r, 1000));
    },
  },
};

export const Closed: Story = {
  args: {
    isOpen: false,
    project: null,
    onClose: () => console.log("Close"),
    onSave: async (data) => console.log("Save:", data),
  },
};

// Interactive example with toggle
const InteractiveModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);

  const handleSave = async (data: CreateProjectInput) => {
    console.log("Saved:", data);
    await new Promise((r) => setTimeout(r, 1000));
    alert(`Project "${data.name}" saved!`);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <button
          onClick={() => {
            setEditProject(null);
            setIsOpen(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Create New Project
        </button>
        <button
          onClick={() => {
            setEditProject(mockProject);
            setIsOpen(true);
          }}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg"
        >
          Edit Existing Project
        </button>
      </div>

      <ProjectModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSave={handleSave}
        project={editProject}
      />
    </div>
  );
};

export const Interactive: Story = {
  render: () => <InteractiveModal />,
};
