"use client";

import { Paperclip } from "lucide-react";
import { useRef, useState, type ChangeEvent } from "react";
import { toast } from "sonner";

import { useChatStore } from "@/store/chatStore";

export function FileUpload() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { setUploadedFile } = useChatStore();

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    setIsUploading(true);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Upload failed.");
      }

      setUploadedFile({
        name: data.name,
        type: data.type,
        content: data.content,
        size: data.size,
      });
      toast.success(`${data.name} uploaded`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to upload file.");
    } finally {
      setIsUploading(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept=".pdf,.txt,.md,.csv,.json"
        onChange={handleFileChange}
      />
      <button
        type="button"
        title="Upload a file"
        onClick={() => inputRef.current?.click()}
        disabled={isUploading}
        className="inline-flex items-center justify-center rounded-2xl border border-border bg-card/70 p-2.5 text-muted-foreground transition hover:bg-card disabled:opacity-60"
      >
        <Paperclip className="h-4 w-4" />
      </button>
    </>
  );
}
