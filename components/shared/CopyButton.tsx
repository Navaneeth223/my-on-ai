"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

export function CopyButton({ text, className }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      title={copied ? "Copied" : "Copy"}
      className={cn(
        "inline-flex items-center gap-2 rounded-xl border border-border bg-card/80 px-3 py-2 text-sm transition hover:bg-card",
        className,
      )}
    >
      {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
      <span>{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}
