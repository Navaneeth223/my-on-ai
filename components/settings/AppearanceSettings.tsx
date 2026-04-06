"use client";

import { useTheme } from "next-themes";

import { useLocalStorage } from "@/hooks/useLocalStorage";

export function AppearanceSettings() {
  const { theme, setTheme } = useTheme();
  const [fontSize, setFontSize] = useLocalStorage("openmind-font-size", "medium");
  const [density, setDensity] = useLocalStorage("openmind-density", "comfortable");

  return (
    <div className="space-y-6">
      <div className="glass rounded-[1.5rem] border p-6">
        <h3 className="text-lg font-semibold">Theme</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {["dark", "light", "system"].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setTheme(item)}
              className={`rounded-2xl border p-4 text-left ${theme === item ? "border-primary bg-primary/10" : "border-border bg-card/60"}`}
            >
              <p className="font-medium capitalize">{item}</p>
            </button>
          ))}
        </div>
      </div>
      <div className="glass rounded-[1.5rem] border p-6">
        <h3 className="text-lg font-semibold">Font Size</h3>
        <div className="mt-4 flex gap-3">
          {["small", "medium", "large"].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFontSize(item)}
              className={`rounded-2xl border px-4 py-3 capitalize ${fontSize === item ? "border-primary bg-primary/10" : "border-border bg-card/60"}`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <div className="glass rounded-[1.5rem] border p-6">
        <h3 className="text-lg font-semibold">Message Density</h3>
        <div className="mt-4 flex gap-3">
          {["comfortable", "compact"].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setDensity(item)}
              className={`rounded-2xl border px-4 py-3 capitalize ${density === item ? "border-primary bg-primary/10" : "border-border bg-card/60"}`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
