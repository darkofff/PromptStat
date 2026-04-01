import { API_BASE } from "./config";

export async function fetchDatasets(projectId) {
  const res = await fetch(`${API_BASE}/projects/${projectId}/datasets`);
  if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
  return res.json();
}

export async function uploadDataset(projectId, file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE}/projects/${projectId}/datasets`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
  return res.json();
}

export async function deleteDataset(datasetId) {
  const res = await fetch(`${API_BASE}/datasets/${datasetId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
  return res.json();
}
