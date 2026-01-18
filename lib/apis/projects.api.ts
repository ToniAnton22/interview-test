import type { CreateProjectInput } from "@/types/project";

export async function getProjects(params: URLSearchParams) {
  const res = await fetch(`/api/projects?${params}`);
  if (!res.ok) throw new Error("Failed to fetch projects");
  return res.json();
}

export async function createProject(data: CreateProjectInput) {
  const res = await fetch("/api/projects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error((await res.json())?.message ?? "Failed to create project");
}

export async function updateProject(id: string, data: CreateProjectInput) {
  const res = await fetch(`/api/projects/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error((await res.json())?.message ?? "Failed to update project");
}

export async function deleteProject(id: string) {
  const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete project");
}
