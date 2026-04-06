"use client";

import { useState } from "react";

import { CopyButton } from "@/components/shared/CopyButton";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useModels } from "@/hooks/useModels";
import { useChatStore } from "@/store/chatStore";

export function ModelSettings() {
  const { models } = useModels();
  const { temperature, setTemperature, systemPrompt, setSystemPrompt } = useChatStore();
  const [modelToPull, setModelToPull] = useState("llama3");
  const [maxTokens, setMaxTokens] = useLocalStorage("openmind-max-tokens", 2048);

  return (
    <div className="space-y-6">
      <div className="glass rounded-[1.5rem] border p-6">
        <h3 className="text-lg font-semibold">Installed Models</h3>
        <div className="mt-4 space-y-3">
          {models.map((model) => (
            <div key={model.name} className="rounded-2xl border border-border bg-card/60 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium">{model.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {model.details?.parameter_size || "Unknown size"} · {model.details?.family || "General"}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">{Math.round(model.size / 1024 / 1024)} MB</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-[1.5rem] border p-6">
        <h3 className="text-lg font-semibold">Pull a New Model</h3>
        <input
          value={modelToPull}
          onChange={(event) => setModelToPull(event.target.value)}
          className="mt-4 w-full rounded-2xl border border-border bg-card/70 px-4 py-3 outline-none"
          placeholder="llama3"
        />
        <div className="mt-4 rounded-2xl bg-slate-950 p-4 text-sm text-slate-100">
          <code>ollama pull {modelToPull || "llama3"}</code>
        </div>
        <div className="mt-3">
          <CopyButton text={`ollama pull ${modelToPull || "llama3"}`} />
        </div>
      </div>

      <div className="glass rounded-[1.5rem] border p-6">
        <label className="block text-sm font-medium">Temperature: {temperature.toFixed(1)}</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={temperature}
          onChange={(event) => setTemperature(Number(event.target.value))}
          className="mt-3 w-full"
        />
        <label className="mt-6 block text-sm font-medium">System Prompt</label>
        <textarea
          value={systemPrompt}
          onChange={(event) => setSystemPrompt(event.target.value)}
          rows={7}
          className="mt-3 w-full rounded-2xl border border-border bg-card/70 px-4 py-3 outline-none"
        />
        <label className="mt-6 block text-sm font-medium">Max Tokens</label>
        <input
          type="number"
          min={256}
          max={8192}
          value={maxTokens}
          onChange={(event) => setMaxTokens(Number(event.target.value))}
          className="mt-3 w-full rounded-2xl border border-border bg-card/70 px-4 py-3 outline-none"
        />
      </div>
    </div>
  );
}
