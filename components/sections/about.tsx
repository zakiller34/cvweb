"use client";

import { ABOUT_TEXT } from "@/lib/constants";
import { useLanguage } from "@/components/language-provider";
import { AnimateOnScroll, StaggerContainer } from "@/components/ui/animate-on-scroll";

const COMPETENCIES = {
  en: [
    { title: "C++ Rust & Python Development", icon: "code" },
    { title: "Formal Verification", icon: "layers" },
    { title: "High Performance Scientific Computing (HPC)", icon: "users" },
    { title: "Technology Scouting", icon: "refresh" },
  ],
  fr: [
    { title: "Développement C++ Rust & Python", icon: "code" },
    { title: "Vérification Formelle", icon: "layers" },
    { title: "Calcul Scientifique Haute Performance (HPC)", icon: "users" },
    { title: "Veille Technologique", icon: "refresh" },
  ],
};

const SECTION_TITLE = {
  en: "More about me",
  fr: "En savoir plus",
};

export function About() {
  const { lang } = useLanguage();
  const aboutText = ABOUT_TEXT[lang];
  const competencies = COMPETENCIES[lang];
  const sectionTitle = SECTION_TITLE[lang];

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

          {/* Core competencies */}
          <StaggerContainer className="grid grid-cols-2 gap-4" staggerDelay={100}>
            {competencies.map((comp) => (
              <div
                key={comp.title}
                className="p-4 bg-[var(--card-bg)] border border-[var(--border)] rounded-lg hover:border-[var(--accent)] transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center mb-3 group-hover:bg-[var(--accent)]/20 transition-colors">
                  <CompetencyIcon name={comp.icon} />
                </div>
                <h3 className="font-medium text-sm">{comp.title}</h3>
              </div>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}

function CompetencyIcon({ name }: { name: string }) {
  const iconClass = "w-5 h-5 text-[var(--accent)]";

  switch (name) {
    case "code":
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      );
    case "layers":
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      );
    case "users":
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      );
    case "refresh":
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      );
    default:
      return null;
  }
}
