"use client";

import { Menu } from "lucide-react";

import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { ModelSelector } from "@/components/shared/ModelSelector";
import { useChatStore } from "@/store/chatStore";

export function Header() {
  const { toggleSidebar } = useChatStore();

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-border/70 bg-background/70 px-4 py-3 backdrop-blur">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggleSidebar}
          className="inline-flex rounded-2xl border border-border bg-card/70 p-2.5 lg:hidden"
        >
          <Menu className="h-4 w-4" />
        </button>
        <div>
          <p className="text-sm font-semibold">OpenMind AI</p>
          <p className="text-xs text-muted-foreground">Local-first AI workspace</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <ModelSelector />
        <ThemeToggle />
      </div>
    </header>
  );
}
