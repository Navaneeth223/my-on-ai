"use client";

import { useState } from "react";

import { AppearanceSettings } from "@/components/settings/AppearanceSettings";
import { ModelSettings } from "@/components/settings/ModelSettings";
import { PersonaSettings } from "@/components/settings/PersonaSettings";

const tabs = ["Models", "Personas", "Appearance", "Account"] as const;

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Models");

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 md:px-6">
      <h1 className="text-3xl font-semibold">Settings</h1>
      <p className="mt-2 text-muted-foreground">Manage models, personas, interface preferences, and account access.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`rounded-2xl border px-4 py-2 ${activeTab === tab ? "border-primary bg-primary/10 text-primary" : "border-border bg-card/70"}`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="mt-8">
        {activeTab === "Models" ? <ModelSettings /> : null}
        {activeTab === "Personas" ? <PersonaSettings /> : null}
        {activeTab === "Appearance" ? <AppearanceSettings /> : null}
        {activeTab === "Account" ? (
          <div className="glass rounded-[1.5rem] border p-6">
            <p className="text-muted-foreground">Account management is handled through your authentication provider and profile session.</p>
          </div>
        ) : null}
      </div>
    </main>
  );
}
