"use client";

import { Pin, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { formatDate, truncate } from "@/lib/utils";
import type { Conversation } from "@/types";

export function ConversationItem({
  conversation,
  active,
  onRename,
  onPin,
  onDelete,
}: {
  conversation: Conversation;
  active: boolean;
  onRename: (title: string) => void;
  onPin: () => void;
  onDelete: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(conversation.title);

  return (
    <div
      className={`group rounded-[1.25rem] border p-3 transition ${active ? "border-primary/40 bg-primary/10" : "border-transparent hover:border-border hover:bg-card/70"}`}
    >
      {editing ? (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onRename(title);
            setEditing(false);
          }}
        >
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none"
            autoFocus
          />
        </form>
      ) : (
        <Link href={`/chat/${conversation.id}`} className="block">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium">{truncate(conversation.title, 30)}</p>
              <p className="mt-1 text-xs text-muted-foreground">{formatDate(conversation.updatedAt)}</p>
            </div>
            {conversation.pinned ? <Pin className="h-4 w-4 text-primary" /> : null}
          </div>
        </Link>
      )}

      <div className="mt-2 flex items-center gap-2 opacity-100 transition lg:opacity-0 lg:group-hover:opacity-100">
        <button type="button" onClick={() => setEditing(true)} className="rounded-xl border border-border p-2">
          <Pencil className="h-3.5 w-3.5" />
        </button>
        <button type="button" onClick={onPin} className="rounded-xl border border-border p-2">
          <Pin className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => {
            if (window.confirm("Delete this conversation?")) onDelete();
          }}
          className="rounded-xl border border-border p-2 text-rose-400"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
