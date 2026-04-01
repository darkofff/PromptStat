import ChatMessage from "./ChatMessage";

function ChatHistory({ exchanges }) {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-8 custom-scrollbar">
      <div className="mx-auto max-w-4xl space-y-6">
        {exchanges.map((entry, i) => (
          <ChatMessage key={i} entry={entry} />
        ))}
      </div>
    </div>
  );
}

export default ChatHistory;
