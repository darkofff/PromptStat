import { API_BASE } from "./config";

export async function fetchChats(projectId) {
  const res = await fetch(`${API_BASE}/projects/${projectId}/chats`);
  if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
  return res.json();
}

export async function createChat(projectId, title) {
  const res = await fetch(`${API_BASE}/projects/${projectId}/chats`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
  return res.json();
}

export async function fetchChat(chatId) {
  const res = await fetch(`${API_BASE}/chats/${chatId}`);
  if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
  return res.json();
}

/* Exchanges */
export async function fetchExchanges(chatId) {
  const res = await fetch(`${API_BASE}/chats/${chatId}/exchanges`);
  if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
  return res.json();
}

export async function createExchange(chatId, prompt) {
  const res = await fetch(`${API_BASE}/chats/${chatId}/exchanges`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });
  if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
  return res.json();
}
