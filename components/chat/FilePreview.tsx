"use client";

import { FileJson2, FileSpreadsheet, FileText, FileType2, X } from "lucide-react";
import { motion } from "framer-motion";

import { formatFileSize } from "@/lib/utils";
import type { FileAttachment } from "@/types";

function getIcon(type: string, name: string) {
  if (type.includes("json") || name.endsWith(".json")) return FileJson2;
  if (name.endsWith(".csv")) return FileSpreadsheet;
  if (type.includes("pdf") || name.endsWith(".pdf")) return FileType2;
  return FileText;
}

export function FilePreview({
  file,
  onRemove,
}: {
  file: FileAttachment;
  onRemove: () => void;
}) {
  const Icon = getIcon(file.type, file.name);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between rounded-2xl border border-border bg-card/60 px-3 py-2"
    >
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-primary/10 p-2 text-primary">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-medium">{file.name}</p>
          <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
        </div>
      </div>
      <button type="button" onClick={onRemove} className="rounded-xl p-2 text-muted-foreground hover:bg-secondary">
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  );
}
