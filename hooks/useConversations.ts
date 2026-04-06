"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { useChatStore } from "@/store/chatStore";
import type { Conversation } from "@/types";

export function useConversations() {
  const { conversations, setConversations, addConversation, removeConversation } = useChatStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/conversations", { cache: "no-store" });
      const data = (await response.json()) as { conversations?: Conversation[]; error?: string };
      if (!response.ok) {
        throw new Error(data.error || "Unable to load conversations.");
      }

      setConversations((data.conversations ?? []).map((conversation) => ({
        ...conversation,
        createdAt: String(conversation.createdAt),
        updatedAt: String(conversation.updatedAt),
      })));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, [setConversations]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  const create = useCallback(
    async (payload?: Partial<Conversation>) => {
      const response = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload ?? {}),
      });
      const data = (await response.json()) as { conversation?: Conversation; error?: string };
      if (!response.ok || !data.conversation) {
        throw new Error(data.error || "Unable to create conversation.");
      }
      addConversation(data.conversation);
      return data.conversation;
    },
    [addConversation],
  );

  const remove = useCallback(
    async (id: string) => {
      const response = await fetch(`/api/conversations/${id}`, { method: "DELETE" });
      if (!response.ok) {
        toast.error("Unable to delete conversation.");
        return;
      }
      removeConversation(id);
    },
    [removeConversation],
  );

  const update = useCallback(async (id: string, payload: Record<string, unknown>) => {
    const response = await fetch(`/api/conversations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Unable to update conversation.");
    }
    await refetch();
    return data.conversation as Conversation;
  }, [refetch]);

  return {
    conversations,
    isLoading,
    error,
    createConversation: create,
    deleteConversation: remove,
    updateConversation: update,
    refetch,
  };
}
