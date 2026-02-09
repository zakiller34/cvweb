"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { NAV_LINKS } from "@/lib/constants";
import { useLanguage } from "@/components/language-provider";

interface ScrollState {
  isHome: boolean;
  activeSection: string;
  scrollProgress: number;
  isScrolled: boolean;
}

const ScrollStateContext = createContext<ScrollState | null>(null);

export function ScrollStateProvider({ children }: { children: ReactNode }) {
  const { lang } = useLanguage();
  const [state, setState] = useState<ScrollState>({
    isHome: true,
    activeSection: "",
    scrollProgress: 0,
    isScrolled: false,
  });

  const navLinks = NAV_LINKS[lang];

  useEffect(() => {
    const handleScroll = () => {
      const threshold = window.innerHeight * 0.5;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? Math.min(window.scrollY / scrollHeight, 1) : 0;

      const sections = navLinks.map((link) => link.href.replace("#", ""));
      let active = "hero";
      for (const section of [...sections].reverse()) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100) {
            active = section;
            break;
          }
        }
      }

      setState({
        isHome: window.scrollY < threshold,
        activeSection: active,
        scrollProgress: progress,
        isScrolled: window.scrollY > 0,
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [navLinks]);

  return (
    <ScrollStateContext.Provider value={state}>
      {children}
    </ScrollStateContext.Provider>
  );
}

export function useScrollState(): ScrollState {
  const context = useContext(ScrollStateContext);
  if (!context) {
    throw new Error("useScrollState must be used within ScrollStateProvider");
  }
  return context;
}
