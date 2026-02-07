"use client";

import { useState, useEffect, useCallback } from "react";

interface HealthResponse {
  status: "healthy" | "degraded";
  checks: Record<string, boolean>;
}

const CHECK_LABELS: Record<string, string> = {
  db: "Database",
  resendKey: "Resend API Key",
  senderEmail: "Sender Email",
  recaptcha: "reCAPTCHA",
};

export function HealthStatus() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [error, setError] = useState(false);

  const checkHealth = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/health");
      const data: HealthResponse = await res.json();
      setHealth(data);
      setLastChecked(new Date());
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkHealth();
  }, [checkHealth]);

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ago`;
  };

  return (
    <div className="p-6 bg-[var(--card-bg)] rounded-lg border border-[var(--border)]">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold text-[var(--foreground)]">
          System Health
        </h2>
        <button
          onClick={checkHealth}
          disabled={loading}
          className="px-3 py-1 text-xs bg-[var(--background)] border border-[var(--border)] rounded-md hover:bg-[var(--border)] disabled:opacity-50 transition-colors"
        >
          {loading ? "Checking..." : "Check Now"}
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-500 mb-2">Failed to reach health endpoint</p>
      )}

      {health && (
        <>
          <div className="mb-3">
            <span
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${
                health.status === "healthy"
                  ? "bg-green-500/10 text-green-500"
                  : "bg-yellow-500/10 text-yellow-500"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  health.status === "healthy" ? "bg-green-500" : "bg-yellow-500"
                }`}
              />
              {health.status === "healthy" ? "Healthy" : "Degraded"}
            </span>
          </div>

          <div className="space-y-1.5">
            {Object.entries(health.checks).map(([key, ok]) => (
              <div key={key} className="flex items-center justify-between text-sm">
                <span className="text-[var(--foreground)]/70">
                  {CHECK_LABELS[key] ?? key}
                </span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    ok ? "bg-green-500" : "bg-red-500"
                  }`}
                />
              </div>
            ))}
          </div>
        </>
      )}

      {lastChecked && (
        <p className="text-xs text-[var(--foreground)]/40 mt-3">
          Last checked: {formatTimeAgo(lastChecked)}
        </p>
      )}
    </div>
  );
}
