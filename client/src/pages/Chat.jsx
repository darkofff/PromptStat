import { useManageChat } from "../hooks/useManageChat";
import PromptInput from "../components/PromptInput";
import ChatHistory from "../components/ChatHistory";

function Chat() {
  const {
    prompt,
    setPrompt,
    loading,
    handleSubmit,
    exchanges,
    exchangesLoading,
  } = useManageChat();

  return (
    <div className="flex h-full flex-col bg-base text-body">
      {exchangesLoading ? (
        <div className="flex flex-1 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-accent" />
        </div>
      ) : (
        <ChatHistory exchanges={exchanges} />
      )}
      <PromptInput
        text={prompt}
        setText={setPrompt}
        loading={loading}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export default Chat;
