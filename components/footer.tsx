import { SITE_CONFIG } from "@/lib/site-config";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="py-8 border-t border-[var(--border)]">
      <div className="max-w-6xl mx-auto px-4 text-center flex flex-col gap-2">
        <p className="text-sm text-[var(--muted)]">
          &copy; {year} {SITE_CONFIG.name}. All rights reserved.
        </p>
        <p className="text-xs text-[var(--muted)]/60">
          <a href="/llms.txt" className="hover:text-[var(--accent)] transition-colors">llms.txt</a>
          {" · "}
          <a href="/api/cv.json" className="hover:text-[var(--accent)] transition-colors">API</a>
          {" · "}
          <a href="/sitemap.xml" className="hover:text-[var(--accent)] transition-colors">Sitemap</a>
        </p>
      </div>
    </footer>
  );
}
