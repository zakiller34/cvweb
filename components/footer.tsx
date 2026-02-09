import { SITE_CONFIG } from "@/lib/site-config";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="py-8 border-t border-[var(--border)]">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <p className="text-sm text-[var(--muted)]">
          &copy; {year} {SITE_CONFIG.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
