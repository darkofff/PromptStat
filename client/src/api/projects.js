export async function fetchProjects() {
  const res = await fetch("http://localhost:8000/projects");
  if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
  return res.json();
}
