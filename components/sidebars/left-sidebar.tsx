"use client";

import { SITE_CONFIG } from "@/lib/constants";
import { IconButton } from "@/components/ui/icon-button";
import { GitHubIcon, LinkedInIcon, EmailIcon } from "./sidebar-icons";

interface LeftSidebarProps {
  showMailTo?: boolean;
}

export function LeftSidebar({ showMailTo = true }: LeftSidebarProps) {
  return (
    <aside className="fixed left-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-3 animate-fade-in">
      <IconButton href={SITE_CONFIG.social.github} ariaLabel="GitHub" external>
        <GitHubIcon />
      </IconButton>
      <IconButton href={SITE_CONFIG.social.linkedin} ariaLabel="LinkedIn" external>
        <LinkedInIcon />
      </IconButton>
      {showMailTo && (
        <IconButton href={`mailto:${SITE_CONFIG.email}`} ariaLabel="Email">
          <EmailIcon />
        </IconButton>
      )}
      <div className="w-px h-16 bg-[var(--border)] mx-auto mt-2" />
    </aside>
  );
}
