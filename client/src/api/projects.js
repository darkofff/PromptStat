import { API_BASE } from "./config";

export async function fetchProjects() {
  const res = await fetch(`${API_BASE}/projects`);
  if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
  return res.json();
}

export async function createProject({ title, description }) {
  const res = await fetch(`${API_BASE}/projects`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description }),
  });
  if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
  return res.json();
}
