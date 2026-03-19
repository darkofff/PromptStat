function PromptInput({ text, setText, loading, onSubmit }) {
  return (
    <div className="border-t border-border bg-base px-4 py-4">
      <form onSubmit={onSubmit} className="mx-auto flex max-w-2xl gap-3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your text here..."
          rows={2}
          className="flex-1 resize-none rounded-lg border border-border bg-surface px-4 py-3 text-body placeholder-muted shadow-sm transition focus:border-accent-hover focus:outline-none focus:ring-2 focus:ring-accent-hover/40"
        />
        <button
          type="submit"
          disabled={loading || !text.trim()}
          className="self-end rounded-lg bg-accent px-6 py-3 font-medium text-heading transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50">
          {loading ? "..." : "Send"}
        </button>
      </form>
    </div>
  );
}

export default PromptInput;
