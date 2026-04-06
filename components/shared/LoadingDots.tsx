export function LoadingDots() {
  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((index) => (
        <span
          key={index}
          className="h-2 w-2 rounded-full bg-current animate-pulse-dot"
          style={{ animationDelay: `${index * 0.15}s` }}
        />
      ))}
    </div>
  );
}
