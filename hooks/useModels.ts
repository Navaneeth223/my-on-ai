"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useChatStore } from "@/store/chatStore";
import type { OllamaModel } from "@/types";

export function useModels() {
  const [models, setModels] = useState<OllamaModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOllamaRunning, setIsOllamaRunning] = useState(true);
  const lastFetched = useRef(0);
  const { selectedModel, setModel } = useChatStore();

  const fetchModels = useCallback(async () => {
    const now = Date.now();
    if (now - lastFetched.current < 30_000 && models.length > 0) {
      return;
    }
    setIsLoading(true);
    const response = await fetch("/api/models", { cache: "no-store" });
    const data = (await response.json()) as { models: OllamaModel[]; isRunning: boolean };
    setModels(data.models ?? []);
    setIsOllamaRunning(Boolean(data.isRunning));
    setIsLoading(false);
    lastFetched.current = now;
  }, [models.length]);

  useEffect(() => {
    void fetchModels();
  }, [fetchModels]);

  return {
    models,
    isLoading,
    isOllamaRunning,
    selectedModel,
    setSelectedModel: setModel,
    refetch: fetchModels,
  };
}
