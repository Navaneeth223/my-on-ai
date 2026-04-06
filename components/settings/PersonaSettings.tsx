"use client";

import { Trash2 } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";

import { useChatStore } from "@/store/chatStore";
import type { Persona } from "@/types";

export function PersonaSettings() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [form, setForm] = useState({ name: "", description: "", systemPrompt: "" });
  const { setSystemPrompt } = useChatStore();

  async function loadPersonas() {
    const response = await fetch("/api/personas");
    const data = await response.json();
    setPersonas(data.personas ?? []);
  }

  useEffect(() => {
    void loadPersonas();
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const response = await fetch("/api/personas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await response.json();
    if (!response.ok) {
      toast.error(data.error || "Unable to create persona.");
      return;
    }
    toast.success("Persona saved");
    setForm({ name: "", description: "", systemPrompt: "" });
    await loadPersonas();
  }

  async function handleDelete(id: string) {
    const response = await fetch(`/api/personas?id=${id}`, { method: "DELETE" });
    if (!response.ok) {
      toast.error("Unable to delete persona.");
      return;
    }
    await loadPersonas();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
      <div className="glass rounded-[1.5rem] border p-6">
        <h3 className="text-lg font-semibold">Saved Personas</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {personas.map((persona) => (
            <button
              key={persona.id}
              type="button"
              onClick={() => setSystemPrompt(persona.systemPrompt)}
              className="rounded-[1.25rem] border border-border bg-card/60 p-4 text-left transition hover:border-primary/40"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{persona.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{persona.description}</p>
                </div>
                <span
                  onClick={(event) => {
                    event.stopPropagation();
                    void handleDelete(persona.id);
                  }}
                  className="rounded-xl border border-border p-2"
                >
                  <Trash2 className="h-4 w-4" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="glass space-y-4 rounded-[1.5rem] border p-6">
        <h3 className="text-lg font-semibold">Create Persona</h3>
        <input
          value={form.name}
          onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
          placeholder="Code Expert"
          className="w-full rounded-2xl border border-border bg-card/70 px-4 py-3 outline-none"
        />
        <input
          value={form.description}
          onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
          placeholder="Best for debugging and architecture help"
          className="w-full rounded-2xl border border-border bg-card/70 px-4 py-3 outline-none"
        />
        <textarea
          value={form.systemPrompt}
          onChange={(event) => setForm((current) => ({ ...current, systemPrompt: event.target.value }))}
          rows={7}
          placeholder="You are an expert software engineer..."
          className="w-full rounded-2xl border border-border bg-card/70 px-4 py-3 outline-none"
        />
        <button className="rounded-2xl bg-primary px-5 py-3 font-medium text-primary-foreground">Save Persona</button>
      </form>
    </div>
  );
}
