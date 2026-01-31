"use client";

import { useLanguage } from "@/components/language-provider";

export function LanguageToggle() {
  const { lang, toggleLang } = useLanguage();

  return (
    <button
      onClick={toggleLang}
      className="px-2 py-1 text-xs font-medium border border-[var(--border)] rounded hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all duration-200 active:scale-95 min-w-[32px]"
      aria-label={lang === "en" ? "Switch to French" : "Switch to English"}
      title={lang === "en" ? "Switch to French" : "Passer en anglais"}
    >
      {lang.toUpperCase()}
    </button>
  );
}
