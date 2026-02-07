"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { StatCard } from "./stat-card";

interface SecurityData {
  total: number;
  typeCounts: Record<string, number>;
  daily: { date: string; [key: string]: string | number }[];
  topIps: { ip: string; count: number }[];
  recent: {
    id: string;
    type: string;
    ip: string;
    detail: string;
    createdAt: string;
  }[];
}

const TYPE_COLORS: Record<string, string> = {
  failed_login: "#ef4444",
  rate_limit: "#f59e0b",
  recaptcha_fail: "#8b5cf6",
};

const TYPE_LABELS: Record<string, string> = {
  failed_login: "Failed Logins",
  rate_limit: "Rate Limits",
  recaptcha_fail: "reCAPTCHA Fails",
};

export function SecurityCharts({ data }: { data: SecurityData }) {
  const types = Object.keys(TYPE_LABELS);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-[var(--foreground)]">Security Events</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Events" value={data.total} />
        {types.map((t) => (
          <StatCard key={t} label={TYPE_LABELS[t]} value={data.typeCounts[t] ?? 0} />
        ))}
      </div>

      {data.daily.length > 0 && (
        <div className="p-4 bg-[var(--card-bg)] rounded-lg border border-[var(--border)]">
          <p className="text-sm text-[var(--foreground)]/60 mb-3">Events Over Time</p>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data.daily}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="var(--foreground)" />
              <YAxis tick={{ fontSize: 11 }} stroke="var(--foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card-bg)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  color: "var(--foreground)",
                }}
              />
              <Legend />
              {types.map((t) => (
                <Line
                  key={t}
                  type="monotone"
                  dataKey={t}
                  name={TYPE_LABELS[t]}
                  stroke={TYPE_COLORS[t]}
                  strokeWidth={2}
                  dot={false}
                  connectNulls
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {data.topIps.length > 0 && (
        <div className="p-4 bg-[var(--card-bg)] rounded-lg border border-[var(--border)]">
          <p className="text-sm text-[var(--foreground)]/60 mb-3">Top IPs</p>
          <div className="space-y-1">
            {data.topIps.map((item) => (
              <div key={item.ip} className="flex justify-between text-sm font-mono">
                <span className="text-[var(--foreground)]/70">{item.ip}</span>
                <span className="text-[var(--foreground)] font-medium">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.recent.length > 0 && (
        <div className="p-4 bg-[var(--card-bg)] rounded-lg border border-[var(--border)]">
          <p className="text-sm text-[var(--foreground)]/60 mb-3">Recent Events</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[var(--foreground)]/50">
                  <th className="pb-2 pr-4">Type</th>
                  <th className="pb-2 pr-4">IP</th>
                  <th className="pb-2 pr-4">Detail</th>
                  <th className="pb-2">Time</th>
                </tr>
              </thead>
              <tbody>
                {data.recent.map((e) => (
                  <tr key={e.id} className="border-t border-[var(--border)]">
                    <td className="py-1.5 pr-4">
                      <span
                        className="px-1.5 py-0.5 rounded text-xs"
                        style={{
                          backgroundColor: `${TYPE_COLORS[e.type] ?? "#666"}20`,
                          color: TYPE_COLORS[e.type] ?? "#666",
                        }}
                      >
                        {TYPE_LABELS[e.type] ?? e.type}
                      </span>
                    </td>
                    <td className="py-1.5 pr-4 font-mono text-[var(--foreground)]/70">{e.ip}</td>
                    <td className="py-1.5 pr-4 text-[var(--foreground)]/70 truncate max-w-[200px]">
                      {e.detail || "-"}
                    </td>
                    <td className="py-1.5 text-[var(--foreground)]/50">
                      {new Date(e.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
