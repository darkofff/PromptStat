import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchChats, createChat } from "../api/chats";
import { fetchProjects } from "../api/projects";

function Navbar() {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { projectId, chatId } = useParams();

  const isDatasetActive = projectId && !chatId;
  const isChatActive = !!chatId;

  // Pobierz tytuł projektu z cache lub z API
  const { data: projects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
    enabled: !!projectId,
  });
  const project = projects.find((p) => p.id === Number(projectId));
  const displayName = project?.title ?? null;

  const { data: chats = [] } = useQuery({
    queryKey: ["chats", projectId],
    queryFn: () => fetchChats(projectId),
    enabled: !!projectId,
  });

  const { mutate: newChat } = useMutation({
    mutationFn: () => {
      const title = `Chat ${chats.length + 1}`;
      return createChat(projectId, title);
    },
    onSuccess: (chat) => {
      queryClient.invalidateQueries({ queryKey: ["chats", projectId] });
      navigate(`/project/${projectId}/chat/${chat.id}`);
    },
  });

  function handleChatClick() {
    if (chats.length === 0) {
      newChat();
    } else {
      navigate(`/project/${projectId}/chat/${chats[0].id}`);
    }
  }

  return (
    <aside
      className={`flex h-full flex-col border-r border-border bg-base transition-all duration-200 ${
        open ? "w-48" : "w-12"
      }`}>
      {displayName && open && (
        <div className="border-b border-border px-3 py-3">
          <h1 className="truncate text-sm font-semibold text-heading">
            {displayName}
          </h1>
        </div>
      )}
      <div className="flex items-center justify-between px-3 py-3">
        {open && (
          <button
            onClick={() => navigate("/")}
            className="cursor-pointer text-sm text-subtle transition hover:text-heading">
            &larr; Projects
          </button>
        )}
        <button
          onClick={() => setOpen(!open)}
          className="cursor-pointer text-lg text-subtle transition hover:text-heading">
          {open ? "\u2039" : "\u203A"}
        </button>
      </div>

      {projectId && (
        <nav className="flex flex-1 flex-col gap-1 overflow-hidden px-2">
          <button
            onClick={() => navigate(`/project/${projectId}`)}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition cursor-pointer ${
              isDatasetActive
                ? "bg-elevated/60 text-heading"
                : "text-subtle hover:bg-elevated hover:text-heading"
            } ${!open ? "text-center" : ""}`}>
            {open ? "Dataset" : "D"}
          </button>

          {open ? (
            <div className="flex items-center justify-between px-3 pt-3 pb-1">
              <span className="text-xs font-medium text-muted">Chat</span>
              <button
                onClick={() => newChat()}
                className="cursor-pointer text-sm text-subtle transition hover:text-heading"
                title="New chat">
                +
              </button>
            </div>
          ) : (
            <button
              onClick={handleChatClick}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition cursor-pointer ${
                isChatActive
                  ? "bg-elevated/60 text-heading"
                  : "text-subtle hover:bg-elevated hover:text-heading"
              } text-center`}>
              C
            </button>
          )}

          {open && (
            <div className="flex flex-1 flex-col gap-0.5 overflow-y-auto custom-scrollbar">
              {chats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() =>
                    navigate(`/project/${projectId}/chat/${chat.id}`)
                  }
                  className={`truncate rounded-lg px-3 py-1.5 text-left text-sm transition cursor-pointer ${
                    chatId === String(chat.id)
                      ? "bg-elevated/60 text-heading"
                      : "text-subtle hover:bg-elevated hover:text-heading"
                  }`}>
                  {chat.title}
                </button>
              ))}
            </div>
          )}
        </nav>
      )}
    </aside>
  );
}

export default Navbar;
