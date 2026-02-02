"use client";

import { useState } from "react";

export function SettingsForm({ initialShowCv }: { initialShowCv: boolean }) {
  const [showCv, setShowCv] = useState(initialShowCv);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleToggle = async () => {
    setSaving(true);
    setSaved(false);

    const newValue = !showCv;

    const res = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: "showCvDownload", value: String(newValue) }),
    });

    if (res.ok) {
      setShowCv(newValue);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }

    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="p-6 bg-[var(--card-bg)] rounded-lg border border-[var(--border)]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-[var(--foreground)]">
              Show CV Download Buttons
            </h2>
            <p className="text-sm text-[var(--foreground)]/60 mt-1">
              Toggle visibility of the CV download buttons in the hero section
            </p>
          </div>

          <button
            onClick={handleToggle}
            disabled={saving}
            className={`relative w-14 h-8 rounded-full transition-colors ${
              showCv ? "bg-[var(--accent)]" : "bg-[var(--border)]"
            }`}
          >
            <span
              className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                showCv ? "left-7" : "left-1"
              }`}
            />
          </button>
        </div>

        {saved && (
          <div className="mt-4 text-sm text-green-500">
            Settings saved successfully
          </div>
        )}
      </div>
    </div>
  );
}
