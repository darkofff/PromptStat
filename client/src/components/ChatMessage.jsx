function ChatMessage({ entry }) {
  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-border bg-surface p-4">
        <p className="text-sm text-subtle">You</p>
        <pre className="mt-1 whitespace-pre-wrap text-body">{entry.prompt}</pre>
      </div>

      {entry.response && (
        <div className="rounded-lg border border-border bg-elevated p-4">
          <pre className="mt-1 whitespace-pre-wrap text-body">
            {entry.response}
          </pre>
        </div>
      )}

      {entry.error && (
        <div className="rounded-lg border border-error/30 bg-error/10 p-4">
          <p className="text-sm text-error">Error: {entry.error}</p>
        </div>
      )}

      {!entry.response && !entry.error && (
        <div className="rounded-lg border border-border bg-elevated p-4">
          <p className="text-sm text-subtle">Thinking...</p>
        </div>
      )}
    </div>
  );
}

export default ChatMessage;
