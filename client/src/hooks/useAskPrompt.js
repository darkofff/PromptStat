import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { askApi } from "../api/prompts";

export function useAskPrompt() {
  const [text, setText] = useState("");
  const [history, setHistory] = useState([]);

  const { mutate, isPending: loading } = useMutation({
    mutationFn: askApi,
    onMutate: (submittedText) => {
      setHistory((prev) => [
        ...prev,
        { prompt: submittedText, response: null, error: null },
      ]);
      setText("");
    },
    onSuccess: (data) => {
      setHistory((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { ...updated[updated.length - 1], response: data };
        return updated;
      });
    },
    onError: (err) => {
      setHistory((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { ...updated[updated.length - 1], error: err.message };
        return updated;
      });
    },
  });

  function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    mutate(text);
  }

  return { text, setText, history, loading, handleSubmit };
}
