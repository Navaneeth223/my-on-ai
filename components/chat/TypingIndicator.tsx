import { LoadingDots } from "@/components/shared/LoadingDots";

export function TypingIndicator() {
  return (
    <div className="max-w-fit rounded-[1.5rem] rounded-bl-md border border-border bg-card/70 px-4 py-3 text-muted-foreground">
      <LoadingDots />
    </div>
  );
}
