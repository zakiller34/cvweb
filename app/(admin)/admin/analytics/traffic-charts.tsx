"use client";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { StatCard } from "./stat-card";

interface TrafficData {
  totalViews: number;
  uniqueVisitors: number;
  daily: { date: string; views: number; unique: number }[];
  topPages: { path: string; count: number }[];
  topReferrers: { referrer: string; count: number }[];
  browsers: { name: string; count: number }[];
  devices: { name: string; count: number }[];
}

export function TrafficCharts({ data }: { data: TrafficData }) {
  const topPage = data.topPages[0]?.path ?? "-";
  const topRef = data.topReferrers[0]?.referrer ?? "direct";

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-[var(--foreground)]">Traffic</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Views" value={data.totalViews} />
        <StatCard label="Unique Visitors" value={data.uniqueVisitors} />
        <StatCard label="Top Page" value={topPage} />
        <StatCard label="Top Referrer" value={topRef} />
      </div>

      {data.daily.length > 0 && (
        <div className="p-4 bg-[var(--card-bg)] rounded-lg border border-[var(--border)]">
          <p className="text-sm text-[var(--foreground)]/60 mb-3">Daily Views & Visitors</p>
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
              <Line type="monotone" dataKey="views" stroke="var(--accent)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="unique" stroke="#10b981" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.topPages.length > 0 && (
          <div className="p-4 bg-[var(--card-bg)] rounded-lg border border-[var(--border)]">
            <p className="text-sm text-[var(--foreground)]/60 mb-3">Top Pages</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data.topPages.slice(0, 8)} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 11 }} stroke="var(--foreground)" />
                <YAxis dataKey="path" type="category" tick={{ fontSize: 11 }} width={100} stroke="var(--foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card-bg)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    color: "var(--foreground)",
                  }}
                />
                <Bar dataKey="count" fill="var(--accent)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {data.browsers.length > 0 && (
          <div className="p-4 bg-[var(--card-bg)] rounded-lg border border-[var(--border)]">
            <p className="text-sm text-[var(--foreground)]/60 mb-3">Browsers</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data.browsers.slice(0, 8)} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 11 }} stroke="var(--foreground)" />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={80} stroke="var(--foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card-bg)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    color: "var(--foreground)",
                  }}
                />
                <Bar dataKey="count" fill="#10b981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {data.topReferrers.length > 0 && (
        <div className="p-4 bg-[var(--card-bg)] rounded-lg border border-[var(--border)]">
          <p className="text-sm text-[var(--foreground)]/60 mb-3">Top Referrers</p>
          <div className="space-y-1">
            {data.topReferrers.map((r) => (
              <div key={r.referrer} className="flex justify-between text-sm">
                <span className="text-[var(--foreground)]/70 truncate mr-4">{r.referrer}</span>
                <span className="text-[var(--foreground)] font-medium">{r.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.devices.length > 0 && (
        <div className="p-4 bg-[var(--card-bg)] rounded-lg border border-[var(--border)]">
          <p className="text-sm text-[var(--foreground)]/60 mb-3">Devices</p>
          <div className="flex gap-4">
            {data.devices.map((d) => (
              <div key={d.name} className="text-sm">
                <span className="text-[var(--foreground)]/70 capitalize">{d.name}</span>
                <span className="ml-2 font-medium text-[var(--foreground)]">{d.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
