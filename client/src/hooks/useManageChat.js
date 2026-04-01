import { useState } from "react";
import { useParams } from "react-router-dom";
// Tanstack
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// API
import { createExchange, fetchExchanges } from "../api/chats";

export function useManageChat() {
  const { chatId } = useParams();
  const [prompt, setPrompt] = useState("");
  const queryClient = useQueryClient();

  const { data: exchanges = [], isLoading: exchangesLoading } = useQuery({
    queryKey: ["exchanges", chatId],
    queryFn: () => fetchExchanges(chatId),
    enabled: !!chatId,
  });

  const { mutate, isPending: loading } = useMutation({
    mutationFn: ({ chatId, prompt }) => createExchange(chatId, prompt),
    onSuccess: (newExchange) => {
      queryClient.setQueryData(["exchanges", chatId], (prev) => [
        ...prev,
        newExchange,
      ]);
      setPrompt("");
    },
  });

  function handleSubmit(e) {
    e.preventDefault();
    if (!prompt.trim()) return;
    mutate({ chatId, prompt });
  }

  return {
    prompt,
    setPrompt,
    loading,
    handleSubmit,
    exchanges,
    exchangesLoading,
  };
}
