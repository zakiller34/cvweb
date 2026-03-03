"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/site-config";
import { GitHubIcon, LinkedInIcon, EmailIcon, BotIcon } from "@/components/sidebars/sidebar-icons";

function HomeIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z" />
    </svg>
  );
}

export function MobileBottomBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 100);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 md:hidden transition-all duration-300 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"
      }`}
    >
      <div className="flex items-center justify-around px-4 py-3 bg-[var(--background)]/80 backdrop-blur-md border-t border-[var(--border)]">
        <Link href="/" aria-label="Home" className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors p-2">
          <HomeIcon className="w-6 h-6" />
        </Link>
        <a href={SITE_CONFIG.social.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors p-2">
          <GitHubIcon className="w-6 h-6" />
        </a>
        <a href={SITE_CONFIG.social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors p-2">
          <LinkedInIcon className="w-6 h-6" />
        </a>
        <a href={`mailto:${SITE_CONFIG.email}`} aria-label="Email" className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors p-2">
          <EmailIcon className="w-6 h-6" />
        </a>
        <a href="/llms.txt" aria-label="Machine-Readable CV" className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors p-2">
          <BotIcon className="w-6 h-6" />
        </a>
      </div>
    </div>
  );
}
