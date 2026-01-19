// components/project/ProjectModal/ProjectModal.tsx
"use client";

import { Project, CreateProjectInput } from "@/types/project";
import { useProjectModalVM } from "@/lib/hooks/useProjectModal";
import { ProjectModalView } from "./ProjectModalViews";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateProjectInput) => Promise<void>;
  project?: Project | null;
};

export default function ProjectModal(props: Props) {
  const vm = useProjectModalVM({
    isOpen: props.isOpen,
    project: props.project,
    onSave: props.onSave,
    onClose: props.onClose,
  });

  return (
    <ProjectModalView
      isOpen={props.isOpen}
      isEditing={vm.isEditing}
      formData={vm.formData}
      errors={vm.errors}
      isLoading={vm.isLoading}
      onClose={props.onClose}
      onFieldChange={vm.setField}
      onSubmit={vm.handleSubmit}
    />
  );
}
