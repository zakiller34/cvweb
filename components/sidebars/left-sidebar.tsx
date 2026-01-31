"use client";

import { SITE_CONFIG } from "@/lib/constants";
import { GitHubIcon, LinkedInIcon, EmailIcon } from "./sidebar-icons";

export function LeftSidebar() {
  return (
    <aside className="fixed left-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-3 animate-fade-in">
      <a
        href={SITE_CONFIG.social.github}
        target="_blank"
        rel="noopener noreferrer"
        className="w-10 h-10 rounded-lg bg-[var(--card-bg)]/80 backdrop-blur-sm border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--accent)] hover:border-[var(--accent)] hover:scale-110 transition-all duration-300"
        aria-label="GitHub"
      >
        <GitHubIcon />
      </a>
      <a
        href={SITE_CONFIG.social.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="w-10 h-10 rounded-lg bg-[var(--card-bg)]/80 backdrop-blur-sm border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--accent)] hover:border-[var(--accent)] hover:scale-110 transition-all duration-300"
        aria-label="LinkedIn"
      >
        <LinkedInIcon />
      </a>
      <a
        href={`mailto:${SITE_CONFIG.email}`}
        className="w-10 h-10 rounded-lg bg-[var(--card-bg)]/80 backdrop-blur-sm border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--accent)] hover:border-[var(--accent)] hover:scale-110 transition-all duration-300"
        aria-label="Email"
      >
        <EmailIcon />
      </a>
      <div className="w-px h-16 bg-[var(--border)] mx-auto mt-2" />
    </aside>
  );
}
