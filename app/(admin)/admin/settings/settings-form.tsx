"use client";

import { useState } from "react";
import { useCsrf } from "@/components/csrf-provider";

interface SettingsFormProps {
  initialShowCv: boolean;
  initialShowContactForm: boolean;
  initialShowMailToSidebar: boolean;
  initialShowPortfolio: boolean;
  initialShowScheduleMeeting: boolean;
  initialShowGitHub: boolean;
  initialShowLinkedIn: boolean;
}

export function SettingsForm({ initialShowCv, initialShowContactForm, initialShowMailToSidebar, initialShowPortfolio, initialShowScheduleMeeting, initialShowGitHub, initialShowLinkedIn }: SettingsFormProps) {
  const [showCv, setShowCv] = useState(initialShowCv);
  const [showContactForm, setShowContactForm] = useState(initialShowContactForm);
  const [showMailToSidebar, setShowMailToSidebar] = useState(initialShowMailToSidebar);
  const [showPortfolio, setShowPortfolio] = useState(initialShowPortfolio);
  const [showScheduleMeeting, setShowScheduleMeeting] = useState(initialShowScheduleMeeting);
  const [showGitHub, setShowGitHub] = useState(initialShowGitHub);
  const [showLinkedIn, setShowLinkedIn] = useState(initialShowLinkedIn);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const csrfToken = useCsrf();

  const handleToggle = async (key: string, currentValue: boolean, setter: (v: boolean) => void) => {
    setSaving(key);
    setSaved(false);

    const newValue = !currentValue;

    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (csrfToken) {
      headers["X-CSRF-Token"] = csrfToken;
    }

    const res = await fetch("/api/admin/settings", {
      method: "POST",
      headers,
      body: JSON.stringify({ key, value: String(newValue) }),
    });

    if (res.ok) {
      setter(newValue);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } else {
      console.error("Failed to save setting:", key, res.status);
    }

    setSaving(null);
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
            onClick={() => handleToggle("showCvDownload", showCv, setShowCv)}
            disabled={saving !== null}
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
      </div>

      <div className="p-6 bg-[var(--card-bg)] rounded-lg border border-[var(--border)]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-[var(--foreground)]">
              Show Contact Form
            </h2>
            <p className="text-sm text-[var(--foreground)]/60 mt-1">
              Show &quot;Get in Touch&quot; buttons and contact section
            </p>
          </div>

          <button
            onClick={() => handleToggle("showContactForm", showContactForm, setShowContactForm)}
            disabled={saving !== null}
            className={`relative w-14 h-8 rounded-full transition-colors ${
              showContactForm ? "bg-[var(--accent)]" : "bg-[var(--border)]"
            }`}
          >
            <span
              className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                showContactForm ? "left-7" : "left-1"
              }`}
            />
          </button>
        </div>
      </div>

      <div className="p-6 bg-[var(--card-bg)] rounded-lg border border-[var(--border)]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-[var(--foreground)]">
              Show Email in Sidebar
            </h2>
            <p className="text-sm text-[var(--foreground)]/60 mt-1">
              Show the mailto icon in the left sidebar
            </p>
          </div>

          <button
            onClick={() => handleToggle("showMailToSidebar", showMailToSidebar, setShowMailToSidebar)}
            disabled={saving !== null}
            className={`relative w-14 h-8 rounded-full transition-colors ${
              showMailToSidebar ? "bg-[var(--accent)]" : "bg-[var(--border)]"
            }`}
          >
            <span
              className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                showMailToSidebar ? "left-7" : "left-1"
              }`}
            />
          </button>
        </div>
      </div>

      <div className="p-6 bg-[var(--card-bg)] rounded-lg border border-[var(--border)]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-[var(--foreground)]">
              Show Portfolio Link
            </h2>
            <p className="text-sm text-[var(--foreground)]/60 mt-1">
              Show the portfolio icon in the left sidebar
            </p>
          </div>

          <button
            onClick={() => handleToggle("showPortfolio", showPortfolio, setShowPortfolio)}
            disabled={saving !== null}
            className={`relative w-14 h-8 rounded-full transition-colors ${
              showPortfolio ? "bg-[var(--accent)]" : "bg-[var(--border)]"
            }`}
          >
            <span
              className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                showPortfolio ? "left-7" : "left-1"
              }`}
            />
          </button>
        </div>
      </div>

      <div className="p-6 bg-[var(--card-bg)] rounded-lg border border-[var(--border)]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-[var(--foreground)]">
              Show Schedule Meeting Button
            </h2>
            <p className="text-sm text-[var(--foreground)]/60 mt-1">
              Show the Calendly scheduling button in the hero section
            </p>
          </div>

          <button
            onClick={() => handleToggle("showScheduleMeeting", showScheduleMeeting, setShowScheduleMeeting)}
            disabled={saving !== null}
            className={`relative w-14 h-8 rounded-full transition-colors ${
              showScheduleMeeting ? "bg-[var(--accent)]" : "bg-[var(--border)]"
            }`}
          >
            <span
              className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                showScheduleMeeting ? "left-7" : "left-1"
              }`}
            />
          </button>
        </div>
      </div>

      <div className="p-6 bg-[var(--card-bg)] rounded-lg border border-[var(--border)]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-[var(--foreground)]">
              Show GitHub Link
            </h2>
            <p className="text-sm text-[var(--foreground)]/60 mt-1">
              Show the GitHub icon in the sidebar and mobile menu
            </p>
          </div>

          <button
            onClick={() => handleToggle("showGitHub", showGitHub, setShowGitHub)}
            disabled={saving !== null}
            className={`relative w-14 h-8 rounded-full transition-colors ${
              showGitHub ? "bg-[var(--accent)]" : "bg-[var(--border)]"
            }`}
          >
            <span
              className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                showGitHub ? "left-7" : "left-1"
              }`}
            />
          </button>
        </div>
      </div>

      <div className="p-6 bg-[var(--card-bg)] rounded-lg border border-[var(--border)]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-[var(--foreground)]">
              Show LinkedIn Link
            </h2>
            <p className="text-sm text-[var(--foreground)]/60 mt-1">
              Show the LinkedIn icon in the sidebar and mobile menu
            </p>
          </div>

          <button
            onClick={() => handleToggle("showLinkedIn", showLinkedIn, setShowLinkedIn)}
            disabled={saving !== null}
            className={`relative w-14 h-8 rounded-full transition-colors ${
              showLinkedIn ? "bg-[var(--accent)]" : "bg-[var(--border)]"
            }`}
          >
            <span
              className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                showLinkedIn ? "left-7" : "left-1"
              }`}
            />
          </button>
        </div>
      </div>

      {saved && (
        <div className="text-sm text-green-500">
          Settings saved successfully
        </div>
      )}
    </div>
  );
}
