"use client";

import { Check, Copy, RotateCcw, ThumbsDown, ThumbsUp } from "lucide-react";
import { useState } from "react";

export function MessageActions({
  content,
  onRegenerate,
}: {
  content: string;
  onRegenerate?: () => void;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="mt-2 flex items-center gap-2 text-muted-foreground">
      <button type="button" title="Copy message" onClick={handleCopy} className="rounded-xl border border-border p-2 hover:bg-card">
        {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
      </button>
      <button type="button" title="Good response" className="rounded-xl border border-border p-2 hover:bg-card">
        <ThumbsUp className="h-4 w-4" />
      </button>
      <button type="button" title="Bad response" className="rounded-xl border border-border p-2 hover:bg-card">
        <ThumbsDown className="h-4 w-4" />
      </button>
      <button
        type="button"
        title="Regenerate response"
        onClick={onRegenerate}
        className="rounded-xl border border-border p-2 hover:bg-card"
      >
        <RotateCcw className="h-4 w-4" />
      </button>
    </div>
  );
}
