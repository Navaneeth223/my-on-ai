import { createOllama } from "ollama-ai-provider";

import type { Message as AppMessage, OllamaModel } from "@/types";

export const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "http://localhost:11434";

export const ollama = createOllama({
  baseURL: `${OLLAMA_BASE_URL}/api`,
});

export async function getModels(): Promise<OllamaModel[]> {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return [];
    }

    const data = (await response.json()) as { models?: OllamaModel[] };
    return data.models ?? [];
  } catch {
    return [];
  }
}

export async function checkOllamaRunning() {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`, {
      cache: "no-store",
    });

    return response.ok;
  } catch {
    return false;
  }
}

export async function streamChat({
  messages,
  model,
  systemPrompt,
  temperature,
}: {
  messages: AppMessage[];
  model: string;
  systemPrompt?: string;
  temperature?: number;
}) {
  const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      stream: true,
      options: {
        temperature: temperature ?? 0.7,
      },
      messages: [
        ...(systemPrompt
          ? [{ role: "system", content: systemPrompt }]
          : []),
        ...messages.map((message) => ({
          role: message.role,
          content: message.content,
        })),
      ],
    }),
  });

  if (!response.ok || !response.body) {
    throw new Error("Failed to connect to Ollama.");
  }

  return response.body;
}
