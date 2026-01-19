export async function getOwners() {
  const res = await fetch(`/api/users`);
  if (!res.ok) throw new Error("Failed to delete project");
  return await res.json();
}

export async function getCurrentUser() {
  const res = await fetch("/api/user/getCurrent");
  if (!res.ok) throw new Error("Failed to fetch user.");
  const user = await res.json();
  return user
}
