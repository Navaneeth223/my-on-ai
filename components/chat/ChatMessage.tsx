"use client";

import { motion } from "framer-motion";
import { Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

import { MessageActions } from "@/components/chat/MessageActions";
import { SourceCards } from "@/components/chat/SourceCards";
import { CopyButton } from "@/components/shared/CopyButton";
import { formatDate } from "@/lib/utils";
import type { Message } from "@/types";

export function ChatMessage({
  message,
  onRegenerate,
}: {
  message: Message;
  onRegenerate?: () => void;
}) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`group flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
      title={formatDate(message.createdAt)}
    >
      {!isUser ? (
        <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Bot className="h-5 w-5" />
        </div>
      ) : null}

      <div className={`max-w-[85%] ${isUser ? "order-first" : ""}`}>
        <div
          className={`rounded-[1.5rem] px-4 py-3 ${
            isUser
              ? "rounded-br-md bg-primary text-primary-foreground"
              : "rounded-bl-md border border-border bg-card/70"
          }`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap text-sm leading-7">{message.content}</p>
          ) : (
            <div className="prose prose-sm max-w-none prose-invert prose-p:my-3 prose-pre:my-4">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{
                  a: ({ ...props }) => <a {...props} target="_blank" rel="noreferrer" className="text-primary underline" />,
                  code({ className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    const text = String(children).replace(/\n$/, "");
                    if (!className) {
                      return <code {...props} className="rounded bg-secondary px-1 py-0.5">{children}</code>;
                    }
                    return (
                      <div className="overflow-hidden rounded-2xl border border-border">
                        <div className="flex items-center justify-between bg-slate-950 px-4 py-2 text-xs text-slate-300">
                          <span>{match?.[1] || "code"}</span>
                          <div className="flex gap-2">
                            <CopyButton text={text} className="border-slate-800 bg-slate-900 text-slate-200" />
                            {["python", "javascript", "js", "typescript", "ts"].includes(match?.[1] || "") ? (
                              <a
                                href={`https://stackblitz.com/fork/js?file=index.${match?.[1]?.includes("python") ? "py" : "js"}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center rounded-xl border border-slate-800 bg-slate-900 px-3 py-2"
                              >
                                Run in Playground
                              </a>
                            ) : null}
                          </div>
                        </div>
                        <code className={className} {...props}>
                          {children}
                        </code>
                      </div>
                    );
                  },
                  table: ({ children }) => <div className="overflow-x-auto">{children}</div>,
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-2 border-primary pl-4 text-muted-foreground">{children}</blockquote>
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {!isUser ? <MessageActions content={message.content} onRegenerate={onRegenerate} /> : null}
        {!isUser && message.sources?.length ? <SourceCards sources={message.sources} /> : null}
      </div>

      {isUser ? (
        <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-secondary font-medium">
          U
        </div>
      ) : null}
    </motion.div>
  );
}
