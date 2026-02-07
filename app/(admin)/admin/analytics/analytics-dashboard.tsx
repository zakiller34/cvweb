"use client";

import { useState, useEffect, useCallback } from "react";
import { useCsrf } from "@/components/csrf-provider";
import { DateRangeSelector } from "./date-range-selector";
import { TrafficCharts } from "./traffic-charts";
import { SecurityCharts } from "./security-charts";

interface TrafficData {
  totalViews: number;
  uniqueVisitors: number;
  daily: { date: string; views: number; unique: number }[];
  topPages: { path: string; count: number }[];
  topReferrers: { referrer: string; count: number }[];
  browsers: { name: string; count: number }[];
  devices: { name: string; count: number }[];
}

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

export function AnalyticsDashboard() {
  const [days, setDays] = useState(7);
  const [traffic, setTraffic] = useState<TrafficData | null>(null);
  const [security, setSecurity] = useState<SecurityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [purging, setPurging] = useState(false);
  const csrf = useCsrf();

  const fetchData = useCallback(async (d: number) => {
    setLoading(true);
    try {
      const [tRes, sRes] = await Promise.all([
        fetch(`/api/admin/analytics/traffic?days=${d}`),
        fetch(`/api/admin/analytics/security?days=${d}`),
      ]);
      if (tRes.ok) setTraffic(await tRes.json());
      if (sRes.ok) setSecurity(await sRes.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(days);
  }, [days, fetchData]);

  const handlePurge = async () => {
    if (!confirm("Delete analytics data older than 90 days?")) return;
    setPurging(true);
    try {
      await fetch("/api/admin/analytics/purge", {
        method: "POST",
        headers: csrf ? { "x-csrf-token": csrf } : {},
      });
      fetchData(days);
    } finally {
      setPurging(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <DateRangeSelector value={days} onChange={setDays} />
        {loading && (
          <span className="text-xs text-[var(--foreground)]/40">Loading...</span>
        )}
      </div>

      {traffic && <TrafficCharts data={traffic} />}
      {security && <SecurityCharts data={security} />}

      <div className="flex items-center justify-between p-4 bg-[var(--card-bg)] rounded-lg border border-[var(--border)]">
        <p className="text-xs text-[var(--foreground)]/40">
          Data retained for 90 days
        </p>
        <button
          onClick={handlePurge}
          disabled={purging}
          className="px-3 py-1 text-xs bg-red-500/10 text-red-500 border border-red-500/20 rounded-md hover:bg-red-500/20 disabled:opacity-50 transition-colors"
        >
          {purging ? "Purging..." : "Purge Old Data"}
        </button>
      </div>
    </div>
  );
}
