"use client";

export function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="p-4 bg-[var(--card-bg)] rounded-lg border border-[var(--border)]">
      <p className="text-xs text-[var(--foreground)]/60 mb-1">{label}</p>
      <p className="text-2xl font-bold text-[var(--accent)]">{value}</p>
      {sub && <p className="text-xs text-[var(--foreground)]/40 mt-1">{sub}</p>}
    </div>
  );
}
