import { SITE_CONFIG } from "@/lib/constants";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="py-8 border-t border-[var(--border)]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-[var(--muted)]">
          <p>&copy; {year} {SITE_CONFIG.name}. All rights reserved.</p>
          <div className="flex gap-6">
            <a href={SITE_CONFIG.social.github} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--foreground)] transition-colors">
              GitHub
            </a>
            <a href={SITE_CONFIG.social.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--foreground)] transition-colors">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
