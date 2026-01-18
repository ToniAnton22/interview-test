import type { CreateProjectInput, ProjectView } from "@/types/project";

export async function getProject(id: string): Promise<ProjectView> {
  const res = await fetch(`/api/projects/${id}`);
  if (!res.ok) throw new Error("Failed to fetch project");
  return res.json();
}

export async function updateProject(id: string, data: CreateProjectInput) {
  const res = await fetch(`/api/projects/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message ?? "Failed to update project");
  }
}

export async function deleteProject(id: string) {
  const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete project");
}

export async function getCurrentUserId(): Promise<string> {
  const res = await fetch("/api/user/getCurrent");
  if (!res.ok) throw new Error("Failed to fetch user");
  const user = await res.json();
  return user.id;
}
