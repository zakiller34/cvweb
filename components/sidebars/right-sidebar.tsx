"use client";

import { NAV_LINKS } from "@/lib/cv-data";
import { useLanguage } from "@/components/language-provider";
import { useScrollState } from "@/hooks/use-scroll-state";

interface RightSidebarProps {
  showContactForm?: boolean;
}

export function RightSidebar({ showContactForm = true }: RightSidebarProps) {
  const { lang } = useLanguage();
  const { activeSection, scrollProgress } = useScrollState();

  const allNavLinks = NAV_LINKS[lang];
  const navLinks = showContactForm
    ? allNavLinks
    : allNavLinks.filter((link) => link.href !== "#contact");

  return (
    <>
      {/* Section dots - right side */}
      <aside className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center gap-3 animate-fade-in">
        {navLinks.map((link) => {
          const sectionId = link.href.replace("#", "");
          const isActive = activeSection === sectionId;
          return (
            <a
              key={link.href}
              href={link.href}
              className="group relative flex items-center"
              aria-label={link.label}
            >
              <span
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  isActive
                    ? "bg-[var(--accent)] scale-125"
                    : "bg-[var(--border)] hover:bg-[var(--muted)]"
                }`}
              />
              <span className="absolute right-6 px-2 py-1 text-xs bg-[var(--card-bg)]/90 backdrop-blur-sm border border-[var(--border)] rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                {link.label}
              </span>
            </a>
          );
        })}
      </aside>

      {/* Progress bar - fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 h-1 bg-[var(--border)]/50 z-40 hidden md:block">
        <div
          className="h-full bg-[var(--accent)] transition-all duration-150"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>
    </>
  );
}
