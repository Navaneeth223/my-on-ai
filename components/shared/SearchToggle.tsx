"use client";

import { Globe2 } from "lucide-react";

import { cn } from "@/lib/utils";

export function SearchToggle({
  enabled,
  onToggle,
}: {
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      title="Search the web before answering"
      onClick={onToggle}
      className={cn(
        "inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm transition",
        enabled
          ? "border-primary/40 bg-primary/10 text-primary"
          : "border-border bg-card/70 text-muted-foreground",
      )}
    >
      <Globe2 className="h-4 w-4" />
      <span>Search</span>
    </button>
  );
}
