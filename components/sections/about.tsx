"use client";

import { ABOUT_TEXT, COMPETENCIES } from "@/lib/constants";
import { useLanguage } from "@/components/language-provider";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";
import { HexagonGrid } from "@/components/ui/hexagon-grid";
import {
  CppIcon,
  RustIcon,
  PythonIcon,
  FormalVerificationIcon,
  HpcIcon,
  TechScoutingIcon,
} from "@/components/ui/competency-icons";

const SECTION_TITLE = {
  en: "More about me",
  fr: "En savoir plus",
};

const ICON_MAP: Record<string, React.ReactNode> = {
  cpp: <CppIcon />,
  rust: <RustIcon />,
  python: <PythonIcon />,
  "formal-verification": <FormalVerificationIcon />,
  hpc: <HpcIcon />,
  "tech-scouting": <TechScoutingIcon />,
};

export function About() {
  const { lang } = useLanguage();
  const aboutText = ABOUT_TEXT[lang];
  const competencies = COMPETENCIES[lang];
  const sectionTitle = SECTION_TITLE[lang];

  const hexagonItems = competencies.map((comp) => ({
    id: comp.id,
    label: comp.label,
    description: comp.description,
    icon: ICON_MAP[comp.id],
  }));

  return (
    <section id="about" className="py-20">
      <div className="max-w-6xl mx-auto px-4">
        <AnimateOnScroll>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{sectionTitle}</h2>
          <div className="w-20 h-1 bg-[var(--accent)] mb-12" />
        </AnimateOnScroll>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Bio text */}
          <AnimateOnScroll delay={100} className="space-y-4">
            {aboutText.trim().split("\n\n").map((paragraph, i) => (
              <p key={i} className="text-[var(--muted)] leading-relaxed">
                {paragraph.trim()}
              </p>
            ))}
          </AnimateOnScroll>

          {/* Core competencies - Hexagon grid */}
          <AnimateOnScroll delay={200}>
            <HexagonGrid items={hexagonItems} />
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}

