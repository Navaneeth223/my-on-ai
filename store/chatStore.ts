"use client";

import { create } from "zustand";

import type { ChatStore, Conversation, Message, SearchResult } from "@/types";

export const useChatStore = create<ChatStore>((set) => ({
  currentConversationId: null,
  conversations: [],
  messages: [],
  isLoading: false,
  isSearchEnabled: false,
  selectedModel: "llama3",
  systemPrompt:
    "You are OpenMind AI, a helpful, honest, privacy-first assistant. Give accurate answers, acknowledge uncertainty, and cite web sources when used.",
  temperature: 0.7,
  uploadedFile: null,
  sidebarOpen: true,
  setCurrentConversationId: (id) => set({ currentConversationId: id }),
  setConversations: (conversations) => set({ conversations }),
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),
  updateLastMessage: (content, sources?: SearchResult[]) =>
    set((state) => ({
      messages: state.messages.map((message, index) =>
        index === state.messages.length - 1
          ? { ...message, content, sources: sources ?? message.sources }
          : message,
      ),
    })),
  setIsLoading: (value) => set({ isLoading: value }),
  toggleSearch: () =>
    set((state) => ({
      isSearchEnabled: !state.isSearchEnabled,
    })),
  setModel: (model) => set({ selectedModel: model }),
  setSystemPrompt: (prompt) => set({ systemPrompt: prompt }),
  setTemperature: (value) => set({ temperature: value }),
  setUploadedFile: (file) => set({ uploadedFile: file }),
  toggleSidebar: () =>
    set((state) => ({
      sidebarOpen: !state.sidebarOpen,
    })),
  clearMessages: () => set({ messages: [] }),
  addConversation: (conversation: Conversation) =>
    set((state) => ({
      conversations: [conversation, ...state.conversations],
    })),
  removeConversation: (id: string) =>
    set((state) => ({
      conversations: state.conversations.filter((conversation) => conversation.id !== id),
      messages:
        state.currentConversationId === id
          ? []
          : state.messages,
      currentConversationId: state.currentConversationId === id ? null : state.currentConversationId,
    })),
  updateConversationTitle: (id: string, title: string) =>
    set((state) => ({
      conversations: state.conversations.map((conversation) =>
        conversation.id === id ? { ...conversation, title } : conversation,
      ),
    })),
}));
