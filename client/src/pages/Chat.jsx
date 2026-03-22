import { useAskPrompt } from "../hooks/useAskPrompt";
import ChatHistory from "../components/ChatHistory";
import PromptInput from "../components/PromptInput";

function Chat() {
  const { text, setText, history, loading, handleSubmit } = useAskPrompt();

  return (
    <div className="flex h-full flex-col bg-base text-body">
      <ChatHistory history={history} />
      <PromptInput
        text={text}
        setText={setText}
        loading={loading}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export default Chat;
