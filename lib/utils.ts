import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(input: Date | string) {
  const date = new Date(input);
  const diff = Date.now() - date.getTime();
  const seconds = Math.floor(diff / 1000);

  if (seconds < 60) {
    return "just now";
  }

  const intervals = [
    { label: "year", seconds: 31_536_000 },
    { label: "month", seconds: 2_592_000 },
    { label: "week", seconds: 604_800 },
    { label: "day", seconds: 86_400 },
    { label: "hour", seconds: 3_600 },
    { label: "minute", seconds: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
    }
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function truncate(value: string, max = 40) {
  if (value.length <= max) {
    return value;
  }

  return `${value.slice(0, max - 1)}…`;
}

export function generateTitle(content: string) {
  const normalized = content.replace(/\s+/g, " ").trim();
  return truncate(normalized || "New Chat", 40);
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function isValidUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function extractUrls(value: string) {
  const matches = value.match(/https?:\/\/[^\s)]+/g);
  return matches ?? [];
}

export function formatFileSize(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  const units = ["KB", "MB", "GB"];
  let size = bytes / 1024;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }

  return `${size.toFixed(size >= 10 ? 0 : 1)} ${units[unitIndex]}`;
}
