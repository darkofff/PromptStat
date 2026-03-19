function PromptInput({ text, setText, loading, onSubmit }) {
  return (
    <div className="border-t border-gray-800 bg-gray-950 px-4 py-4">
      <form onSubmit={onSubmit} className="mx-auto flex max-w-2xl gap-3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your text here..."
          rows={2}
          className="flex-1 resize-none rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-gray-100 placeholder-gray-500 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
        />
        <button
          type="submit"
          disabled={loading || !text.trim()}
          className="self-end rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50">
          {loading ? "..." : "Send"}
        </button>
      </form>
    </div>
  );
}

export default PromptInput;
