export async function fetchProjects() {
  const res = await fetch("http://localhost:8000/projects");
  if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
  return res.json();
}

export async function createProject({ title, description }) {
  const res = await fetch("http://localhost:8000/projects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description }),
  });
  if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
  return res.json();
}
