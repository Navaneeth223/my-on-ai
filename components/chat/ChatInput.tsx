"use client";

import { Send, Square } from "lucide-react";
import { useEffect, useRef } from "react";

import { FilePreview } from "@/components/chat/FilePreview";
import { FileUpload } from "@/components/shared/FileUpload";
import { ModelSelector } from "@/components/shared/ModelSelector";
import { SearchToggle } from "@/components/shared/SearchToggle";
import { useChatStore } from "@/store/chatStore";

export function ChatInput({
  input,
  onInputChange,
  onSubmit,
  onStop,
  isLoading,
}: {
  input: string;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
  onStop: () => void;
  isLoading: boolean;
}) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const { isSearchEnabled, toggleSearch, uploadedFile, setUploadedFile } = useChatStore();

  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "0px";
    textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 220)}px`;
  }, [input]);

  return (
    <div className="glass rounded-[1.75rem] border p-3">
      {uploadedFile ? <FilePreview file={uploadedFile} onRemove={() => setUploadedFile(null)} /> : null}
      <textarea
        ref={textareaRef}
        value={input}
        onChange={(event) => onInputChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            if (!isLoading && input.trim()) {
              onSubmit();
            }
          }
        }}
        rows={1}
        placeholder="Ask anything, paste a URL, or upload a file..."
        disabled={isLoading}
        className="mt-2 max-h-[220px] min-h-[54px] w-full resize-none bg-transparent px-3 py-3 outline-none"
      />
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <SearchToggle enabled={isSearchEnabled} onToggle={toggleSearch} />
          <FileUpload />
          <ModelSelector />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            {input.length > 1500 ? `${input.length} chars` : "Enter to send · Shift+Enter for newline · Ctrl+K focus"}
          </span>
          <button
            type="button"
            onClick={isLoading ? onStop : onSubmit}
            className="inline-flex items-center gap-2 rounded-2xl bg-primary px-4 py-3 font-medium text-primary-foreground"
          >
            {isLoading ? <Square className="h-4 w-4" /> : <Send className="h-4 w-4" />}
            {isLoading ? "Stop" : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
