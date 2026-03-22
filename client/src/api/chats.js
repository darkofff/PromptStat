const chatStore = new Map();

function getProjectChats(projectName) {
  if (!chatStore.has(projectName)) {
    chatStore.set(projectName, []);
  }
  return chatStore.get(projectName);
}

export async function fetchChats(projectName) {
  const chats = getProjectChats(projectName);
  return chats.map(({ id, title, createdAt }) => ({ id, title, createdAt }));
}

export async function fetchChat(projectName, chatId) {
  const chats = getProjectChats(projectName);
  const chat = chats.find((c) => c.id === chatId);
  if (!chat) throw new Error("Chat not found");
  return chat;
}

export async function createChat(projectName) {
  const chats = getProjectChats(projectName);
  const chat = {
    id: crypto.randomUUID(),
    title: `Chat ${chats.length + 1}`,
    createdAt: new Date().toISOString(),
  };
  chats.push(chat);
  return chat;
}
