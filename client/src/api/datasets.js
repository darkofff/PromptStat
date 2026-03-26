export async function fetchDatasets(projectId) {
  const res = await fetch(
    `http://localhost:8000/projects/${projectId}/datasets`
  );
  if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
  return res.json();
}

export async function uploadDataset(projectId, file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(
    `http://localhost:8000/projects/${projectId}/datasets`,
    { method: "POST", body: formData }
  );
  if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
  return res.json();
}
