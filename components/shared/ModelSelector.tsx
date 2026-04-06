"use client";

import { ChevronDown, TriangleAlert } from "lucide-react";

import { useModels } from "@/hooks/useModels";

export function ModelSelector() {
  const { models, selectedModel, setSelectedModel, isOllamaRunning } = useModels();

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <select
          value={selectedModel}
          onChange={(event) => setSelectedModel(event.target.value)}
          className="appearance-none rounded-2xl border border-border bg-card/70 px-3 py-2 pr-9 text-sm outline-none transition focus:border-primary"
        >
          {models.length === 0 ? <option value={selectedModel}>{selectedModel}</option> : null}
          {models.map((model) => (
            <option key={model.name} value={model.name}>
              {model.name}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
      </div>
      {!isOllamaRunning ? (
        <div className="inline-flex items-center gap-2 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
          <TriangleAlert className="h-4 w-4" />
          <span>Ollama not running - install at ollama.ai</span>
        </div>
      ) : null}
    </div>
  );
}
