"use client";

const RANGES = [7, 30, 90] as const;

export function DateRangeSelector({
  value,
  onChange,
}: {
  value: number;
  onChange: (days: number) => void;
}) {
  return (
    <div className="flex gap-1">
      {RANGES.map((d) => (
        <button
          key={d}
          onClick={() => onChange(d)}
          className={`px-3 py-1 text-xs rounded-md border transition-colors ${
            value === d
              ? "bg-[var(--accent)] text-white border-[var(--accent)]"
              : "bg-[var(--card-bg)] border-[var(--border)] hover:bg-[var(--border)]"
          }`}
        >
          {d}d
        </button>
      ))}
    </div>
  );
}
