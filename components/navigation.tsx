"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { NAV_LINKS, SITE_CONFIG, UI_TEXT } from "@/lib/constants";
import { useLanguage } from "./language-provider";
import { useScrollState } from "@/hooks/use-scroll-state";
import { ThemeToggle } from "./ui/theme-toggle";
import { LanguageToggle } from "./ui/language-toggle";
import { Button } from "./ui/button";

interface NavigationProps {
  showContactForm?: boolean;
  showCvDownload?: boolean;
}

export function Navigation({ showContactForm = true, showCvDownload = true }: NavigationProps) {
  const { lang } = useLanguage();
  const { isHome, activeSection } = useScrollState();
  const [isOpen, setIsOpen] = useState(false);
  const [cvDropdownOpen, setCvDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const allNavLinks = NAV_LINKS[lang];
  const navLinks = showContactForm
    ? allNavLinks
    : allNavLinks.filter((link) => link.href !== "#contact");
  const ui = UI_TEXT[lang];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setCvDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const scrollToContact = useCallback(() => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ${
        isHome
          ? "border-transparent bg-transparent"
          : "border-transparent bg-[var(--background)]/70 backdrop-blur-sm"
      }`}
    >
      <nav className="max-w-6xl mx-auto px-4 h-20 flex items-center">
        {/* Desktop layout */}
        <div className="hidden md:flex items-center justify-between w-full">
          {/* Left side - Nav links (hidden when home) */}
          <div
            className={`flex items-center gap-6 transition-all duration-300 ${
              isHome ? "opacity-0 -translate-x-4 pointer-events-none" : "opacity-100 translate-x-0"
            }`}
          >
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace("#", "");
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`text-sm transition-colors relative ${
                    isActive
                      ? "text-[var(--accent)]"
                      : "text-[var(--muted)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[var(--accent)] rounded-full" />
                  )}
                </a>
              );
            })}
          </div>

          {/* Center - Logo (centered when home, hidden when scrolled) */}
          <a
            href="/"
            className={`font-semibold text-xl absolute left-1/2 -translate-x-1/2 transition-all duration-300 ${
              isHome ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <span className="text-[#38bdf8]">zakaria</span>teffah.com
          </a>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Profile photo (visible when scrolled) */}
            <button
              onClick={scrollToTop}
              className={`transition-all duration-300 ${
                isHome ? "opacity-0 scale-75 pointer-events-none w-0" : "opacity-100 scale-100 w-8"
              }`}
            >
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-[var(--border)] hover:border-[var(--accent)] transition-colors">
                <Image
                  src="/profile.jpg"
                  alt={SITE_CONFIG.name}
                  width={32}
                  height={32}
                  quality={75}
                  className="object-cover"
                />
              </div>
            </button>

            {/* Download CV dropdown (visible when scrolled) */}
            {showCvDownload && (
              <div
                ref={dropdownRef}
                className={`relative transition-all duration-300 ${
                  isHome ? "opacity-0 translate-x-4 pointer-events-none w-0" : "opacity-100 translate-x-0"
                }`}
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCvDropdownOpen(!cvDropdownOpen)}
                  className="gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {ui.downloadCV}
                  <svg className={`w-3 h-3 transition-transform ${cvDropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </Button>
                {cvDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 bg-[var(--card-bg)] border border-[var(--border)] rounded-lg shadow-lg overflow-hidden z-10">
                    {SITE_CONFIG.cvFiles.map((cv) => (
                      <a
                        key={cv.lang}
                        href={cv.path}
                        download
                        className="block px-4 py-2 text-sm hover:bg-[var(--border)] transition-colors"
                        onClick={() => setCvDropdownOpen(false)}
                      >
                        {cv.lang === "EN" ? ui.english : ui.french}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Get in Touch button or email (visible when scrolled) */}
            {showContactForm ? (
              <Button
                variant="primary"
                size="sm"
                onClick={scrollToContact}
                className={`transition-all duration-300 ${
                  isHome ? "opacity-0 translate-x-4 pointer-events-none w-0 px-0" : "opacity-100 translate-x-0"
                }`}
              >
                {ui.getInTouch}
              </Button>
            ) : (
              <span
                className={`text-base font-medium text-[var(--accent)] transition-all duration-300 ${
                  isHome ? "opacity-0 translate-x-4 pointer-events-none w-0" : "opacity-100 translate-x-0"
                }`}
              >
                zakaria.teffah [at] gmail [dot] com
              </span>
            )}

            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile layout */}
        <div className="flex md:hidden items-center justify-between w-full">
          <a href="/" className="font-semibold text-xl">
            {isHome ? (
              <><span className="text-[#38bdf8]">zakaria</span>teffah.com</>
            ) : (
              <><span className="text-[#38bdf8]">Zakaria</span> Teffah</>
            )}
          </a>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={`md:hidden bg-[var(--background)] border-b border-[var(--border)] overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 border-b-0"
        }`}
      >
        <div className="px-4 py-4 flex flex-col gap-4">
          {navLinks.map((link, index) => {
            const isActive = activeSection === link.href.replace("#", "");
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`transition-all duration-300 ${
                  isActive
                    ? "text-[var(--accent)]"
                    : "text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
                style={{
                  transitionDelay: isOpen ? `${index * 50}ms` : "0ms",
                  transform: isOpen ? "translateX(0)" : "translateX(-10px)",
                  opacity: isOpen ? 1 : 0,
                }}
              >
                {link.label}
              </a>
            );
          })}
          {showCvDownload && (
            <div className="flex gap-2 pt-2 border-t border-[var(--border)]">
              {SITE_CONFIG.cvFiles.map((cv) => (
                <a
                  key={cv.lang}
                  href={cv.path}
                  download
                  className="flex-1 text-center py-2 text-sm border border-[var(--border)] rounded-lg hover:border-[var(--accent)] transition-colors"
                >
                  CV ({cv.lang})
                </a>
              ))}
            </div>
          )}
          {showContactForm ? (
            <Button variant="primary" size="sm" onClick={() => { scrollToContact(); setIsOpen(false); }}>
              {ui.getInTouch}
            </Button>
          ) : (
            <span className="text-base font-medium text-[var(--accent)] py-2">
              zakaria.teffah [at] gmail [dot] com
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
