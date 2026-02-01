"use client";

import { useLanguage } from "@/components/language-provider";
import { FlagGB, FlagFR } from "@/components/ui/flags";

export function LanguageToggle() {
  const { lang, toggleLang } = useLanguage();

  return (
    <button
      onClick={toggleLang}
      className="p-1.5 border border-[var(--border)] rounded hover:border-[var(--accent)] transition-all duration-200 active:scale-95"
      aria-label={lang === "en" ? "Switch to French" : "Switch to English"}
      title={lang === "en" ? "Switch to French" : "Passer en anglais"}
    >
      {lang === "en" ? <FlagGB /> : <FlagFR />}
    </button>
  );
}
