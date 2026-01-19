"use client";

import { useEffect, useMemo, useState } from "react";
import { CreateProjectInput, Project, ProjectStatus } from "@/types/project";

const initialFormData: CreateProjectInput = {
  name: "",
  description: "",
  status: ProjectStatus.ACTIVE,
  deadline: "",
  budget: 0,
};

export type ProjectFormErrors = Partial<
  Record<keyof CreateProjectInput, string>
>;

type Params = {
  isOpen: boolean;
  project?: Project | null;
  onSave: (data: CreateProjectInput) => Promise<void>;
  onClose: () => void;
};

export function useProjectModalVM({ isOpen, project, onSave, onClose }: Params) {
  const [formData, setFormData] = useState<CreateProjectInput>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<ProjectFormErrors>({});

  const isEditing = useMemo(() => !!project, [project]);

  useEffect(() => {
    if (!isOpen) return;

    if (project) {
      setFormData({
        name: project.name,
        description: project.description || "",
        status: project.status,
        deadline: project.deadline,
        budget: project.budget,
      });
    } else {
      setFormData(initialFormData);
    }
    setErrors({});
  }, [project, isOpen]);

  const validate = (): boolean => {
    const newErrors: ProjectFormErrors = {};

    if (!formData.name.trim()) newErrors.name = "Project name is required";
    if (!formData.deadline) newErrors.deadline = "Deadline is required";
    if (formData.budget < 0) newErrors.budget = "Budget cannot be negative";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const setField = <K extends keyof CreateProjectInput>(
    name: K,
    value: CreateProjectInput[K]
  ) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch {
      // Error is handled by the provider (shows alert)
      // Don't close the modal so user can retry
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isEditing,
    formData,
    errors,
    isLoading,
    setField,
    handleSubmit,
  };
}