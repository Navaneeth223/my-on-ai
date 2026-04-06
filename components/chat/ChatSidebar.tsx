"use client";

import { motion } from "framer-motion";
import { LogOut, MessageSquarePlus, Search, Settings } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";

import { ConversationItem } from "@/components/chat/ConversationItem";
import { useConversations } from "@/hooks/useConversations";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/store/chatStore";

export function ChatSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { sidebarOpen } = useChatStore();
  const { conversations, isLoading, updateConversation, deleteConversation } = useConversations();
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () => conversations.filter((conversation) => conversation.title.toLowerCase().includes(query.toLowerCase())),
    [conversations, query],
  );

  const grouped = useMemo(() => {
    const now = new Date();
    return {
      Today: filtered.filter((item) => new Date(item.updatedAt).toDateString() === now.toDateString()),
      Yesterday: filtered.filter((item) => {
        const date = new Date();
        date.setDate(date.getDate() - 1);
        return new Date(item.updatedAt).toDateString() === date.toDateString();
      }),
      "This Week": filtered.filter((item) => {
        const diff = now.getTime() - new Date(item.updatedAt).getTime();
        return diff > 86_400_000 && diff <= 604_800_000;
      }),
      Older: filtered.filter((item) => {
        const diff = now.getTime() - new Date(item.updatedAt).getTime();
        return diff > 604_800_000;
      }),
    };
  }, [filtered]);

  return (
    <motion.aside
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        "fixed inset-y-0 left-0 z-30 flex w-[300px] flex-col border-r border-border bg-background/90 p-4 backdrop-blur lg:static",
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
      )}
    >
      <Link href="/" className="flex items-center gap-3 rounded-2xl px-2 py-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">OM</div>
        <div>
          <p className="font-semibold">OpenMind AI</p>
          <p className="text-xs text-muted-foreground">Private local assistant</p>
        </div>
      </Link>

      <Link href="/chat" className="mt-4 flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-primary-foreground">
        <MessageSquarePlus className="h-4 w-4" />
        <span>New Chat</span>
      </Link>

      <div className="mt-4 flex items-center gap-2 rounded-2xl border border-border bg-card/70 px-3 py-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search chats"
          className="w-full bg-transparent text-sm outline-none"
        />
      </div>

      <div className="mt-4 flex-1 space-y-5 overflow-y-auto pr-1">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-20 animate-pulse rounded-[1.25rem] bg-card/60" />
            ))}
          </div>
        ) : (
          Object.entries(grouped).map(([label, items]) =>
            items.length ? (
              <section key={label}>
                <p className="mb-2 px-2 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
                <div className="space-y-2">
                  {items.map((conversation) => (
                    <ConversationItem
                      key={conversation.id}
                      conversation={conversation}
                      active={pathname === `/chat/${conversation.id}`}
                      onRename={(title) => void updateConversation(conversation.id, { title })}
                      onPin={() => void updateConversation(conversation.id, { pinned: !conversation.pinned })}
                      onDelete={() => void deleteConversation(conversation.id)}
                    />
                  ))}
                </div>
              </section>
            ) : null,
          )
        )}
      </div>

      <div className="mt-4 rounded-[1.5rem] border border-border bg-card/60 p-4">
        <div>
          <p className="font-medium">{session?.user?.name || "OpenMind User"}</p>
          <p className="text-sm text-muted-foreground">{session?.user?.email}</p>
        </div>
        <div className="mt-4 flex gap-2">
          <Link href="/settings" className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-border px-3 py-2 text-sm">
            <Settings className="h-4 w-4" />
            Settings
          </Link>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center justify-center rounded-2xl border border-border px-3 py-2 text-sm"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.aside>
  );
}
