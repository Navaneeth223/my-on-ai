"use client";

import { useChat as useAiChat, type Message } from "ai/react";

export function useChat(initialMessages?: Message[]) {
  return useAiChat({
    api: "/api/chat",
    initialMessages,
  });
}
