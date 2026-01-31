"use client";

import { useTheme } from "@/components/theme-provider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const options: { value: "light" | "dark" | "system"; label: string }[] = [
    { value: "light", label: "Light" },
    { value: "dark", label: "Dark" },
    { value: "system", label: "System" },
  ];

  return (
    <div className="flex gap-1 p-1 rounded-lg bg-[var(--card-bg)]">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => setTheme(option.value)}
          className={`px-3 py-1 text-sm rounded-md transition-colors ${
            theme === option.value
              ? "bg-[var(--background)] text-[var(--foreground)] shadow-sm"
              : "text-[var(--muted)] hover:text-[var(--foreground)]"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
