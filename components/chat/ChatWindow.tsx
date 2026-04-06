"use client";

import { useChat as useAiChat } from "ai/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { ChatInput } from "@/components/chat/ChatInput";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { WelcomeScreen } from "@/components/chat/WelcomeScreen";
import { useChatStore } from "@/store/chatStore";
import type { Message, SearchResult } from "@/types";

export function ChatWindow({
  conversationId: initialConversationId = null,
  initialMessages = [],
}: {
  conversationId?: string | null;
  initialMessages?: Message[];
}) {
  const router = useRouter();
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(initialConversationId);
  const [pendingSources, setPendingSources] = useState<SearchResult[]>([]);
  const [messageMeta, setMessageMeta] = useState<Record<string, Partial<Message>>>(
    Object.fromEntries(initialMessages.map((message) => [message.id, message])),
  );
  const {
    selectedModel,
    systemPrompt,
    temperature,
    isSearchEnabled,
    uploadedFile,
    messages: storeMessages,
    setCurrentConversationId,
    setIsLoading,
    clearMessages,
  } = useChatStore();

  const { messages, input, setInput, append, isLoading, stop, reload, setMessages } = useAiChat({
    api: "/api/chat",
    initialMessages: initialMessages.map((message) => ({
      id: message.id,
      role: message.role,
      content: message.content,
    })),
    body: {
      model: selectedModel,
      systemPrompt,
      temperature,
      searchEnabled: isSearchEnabled,
      conversationId,
      fileContent: uploadedFile?.content,
    },
    onResponse(response) {
      const rawSources = response.headers.get("x-openmind-sources");
      if (!rawSources) return;
      try {
        const parsed = JSON.parse(decodeURIComponent(rawSources)) as SearchResult[];
        setPendingSources(parsed);
      } catch {
        return;
      }
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const combinedMessages = useMemo<Message[]>(
    () =>
      messages.map((message) => ({
        id: message.id,
        role: message.role as Message["role"],
        content: message.content,
        createdAt: messageMeta[message.id]?.createdAt || new Date().toISOString(),
        sources: messageMeta[message.id]?.sources || null,
        fileData: messageMeta[message.id]?.fileData || null,
      })),
    [messageMeta, messages],
  );

  useEffect(() => {
    setCurrentConversationId(conversationId);
  }, [conversationId, setCurrentConversationId]);

  useEffect(() => {
    setIsLoading(isLoading);
  }, [isLoading, setIsLoading]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [combinedMessages.length, isLoading]);

  useEffect(() => {
    if (!pendingSources.length) return;
    const lastAssistant = [...messages].reverse().find((message) => message.role === "assistant");
    if (!lastAssistant) return;
    setMessageMeta((current) => ({
      ...current,
      [lastAssistant.id]: {
        ...current[lastAssistant.id],
        sources: pendingSources,
      },
    }));
  }, [messages, pendingSources]);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        const textarea = document.querySelector("textarea");
        if (textarea instanceof HTMLTextAreaElement) {
          textarea.focus();
        }
      }
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  useEffect(() => {
    if (initialConversationId === null && storeMessages.length === 0) {
      clearMessages();
    }
  }, [clearMessages, initialConversationId, storeMessages.length]);

  async function ensureConversation() {
    if (conversationId) return conversationId;
    const response = await fetch("/api/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: selectedModel,
        systemPrompt,
        temperature,
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Unable to create conversation.");
    }
    const id = data.conversation.id as string;
    setConversationId(id);
    router.replace(`/chat/${id}`);
    return id;
  }

  async function handleSend() {
    if (!input.trim()) return;
    try {
      const id = await ensureConversation();
      await append(
        {
          role: "user",
          content: input,
        },
        {
          body: {
            model: selectedModel,
            systemPrompt,
            temperature,
            searchEnabled: isSearchEnabled,
            conversationId: id,
            fileContent: uploadedFile?.content,
          },
        },
      );
      setInput("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to send message.");
    }
  }

  return (
    <div className="flex h-[calc(100vh-73px)] flex-col">
      <div className="chat-scroll flex-1 overflow-y-auto px-4 py-6 md:px-6">
        {combinedMessages.length === 0 ? (
          <WelcomeScreen model={selectedModel} onPromptClick={setInput} />
        ) : (
          <div className="mx-auto flex max-w-4xl flex-col gap-6">
            {combinedMessages.map((message) => (
              <ChatMessage key={message.id} message={message} onRegenerate={() => void reload()} />
            ))}
            {isLoading ? <TypingIndicator /> : null}
            <div ref={bottomRef} />
          </div>
        )}
      </div>
      <div className="border-t border-border/70 px-4 py-4 md:px-6">
        <div className="mx-auto max-w-4xl">
          <ChatInput
            input={input}
            onInputChange={setInput}
            onSubmit={() => void handleSend()}
            onStop={stop}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
