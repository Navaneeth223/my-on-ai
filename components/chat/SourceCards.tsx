"use client";

import { motion } from "framer-motion";

import { truncate } from "@/lib/utils";
import type { SearchResult } from "@/types";

export function SourceCards({ sources }: { sources: SearchResult[] }) {
  if (!sources.length) return null;

  return (
    <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
      {sources.map((source, index) => {
        const hostname = new URL(source.url).hostname.replace("www.", "");
        return (
          <motion.a
            key={`${source.url}-${index}`}
            href={source.url}
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="min-w-[240px] max-w-[280px] rounded-[1.25rem] border border-border bg-card/70 p-4 transition hover:border-primary/30"
          >
            <div className="flex items-center gap-2">
              <img
                src={`https://www.google.com/s2/favicons?domain=${hostname}&sz=64`}
                alt=""
                className="h-4 w-4 rounded-full"
              />
              <span className="text-xs text-muted-foreground">{hostname}</span>
            </div>
            <p className="mt-3 text-sm font-medium">{truncate(source.title, 64)}</p>
            <p className="mt-2 text-xs text-muted-foreground">{truncate(source.snippet || source.content, 100)}</p>
          </motion.a>
        );
      })}
    </div>
  );
}
