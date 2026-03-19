function ChatMessage({ entry }) {
  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
        <p className="text-sm text-gray-400">You</p>
        <pre className="mt-1 whitespace-pre-wrap text-gray-100">
          {entry.prompt}
        </pre>
      </div>

      {entry.response && (
        <div className="rounded-lg border border-gray-700 bg-gray-800 p-4">
          {entry.response.text && (
            <pre className="mt-1 whitespace-pre-wrap text-gray-100">
              {entry.response.text}
            </pre>
          )}
        </div>
      )}

      {entry.error && (
        <div className="rounded-lg border border-red-800 bg-red-950 p-4">
          <p className="text-sm text-red-400">Error: {entry.error}</p>
        </div>
      )}

      {!entry.response && !entry.error && (
        <div className="rounded-lg border border-gray-700 bg-gray-800 p-4">
          <p className="text-sm text-gray-400">Thinking...</p>
        </div>
      )}
    </div>
  );
}

export default ChatMessage;
