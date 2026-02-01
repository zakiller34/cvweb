"use client";

import { SKILLS, LANGUAGES_SPOKEN } from "@/lib/constants";
import { useLanguage } from "@/components/language-provider";
import { AnimateOnScroll, StaggerContainer } from "@/components/ui/animate-on-scroll";

const CATEGORY_LABELS = {
  en: {
    language: "Programming Languages",
    hardware: "Hardware Description",
    verification: "Verification",
    expertise: "Core Expertise",
  },
  fr: {
    language: "Langages de Programmation",
    hardware: "Description Matérielle",
    verification: "Vérification",
    expertise: "Expertise Principale",
  },
};

const SECTION_TITLES = {
  en: { skills: "Skills", languages: "Languages" },
  fr: { skills: "Compétences", languages: "Langues" },
};

const CATEGORY_ORDER = ["language", "expertise", "verification", "hardware"];

export function Skills() {
  const { lang } = useLanguage();
  const categoryLabels = CATEGORY_LABELS[lang];
  const sectionTitles = SECTION_TITLES[lang];
  const languagesSpoken = LANGUAGES_SPOKEN[lang];

  const categories = CATEGORY_ORDER.filter((cat) =>
    SKILLS.some((s) => s.category === cat)
  );

  return (
    <section id="skills" className="py-20">
      <div className="max-w-6xl mx-auto px-4">
        <AnimateOnScroll>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{sectionTitles.skills}</h2>
          <div className="w-20 h-1 bg-[var(--accent)] mb-12" />
        </AnimateOnScroll>

        <div className="space-y-8">
          {categories.map((category, catIndex) => (
            <AnimateOnScroll key={category} delay={catIndex * 100}>
              <h3 className="text-sm font-medium text-[var(--muted)] uppercase tracking-wider mb-4">
                {categoryLabels[category as keyof typeof categoryLabels] || category}
              </h3>
              <StaggerContainer className="flex flex-wrap gap-3" staggerDelay={50}>
                {SKILLS.filter((s) => s.category === category).map((skill) => (
                  <SkillBadge key={skill.name} name={skill.name} level={skill.level} />
                ))}
              </StaggerContainer>
            </AnimateOnScroll>
          ))}

          {/* Languages */}
          <AnimateOnScroll delay={categories.length * 100}>
            <h3 className="text-sm font-medium text-[var(--muted)] uppercase tracking-wider mb-4">
              {sectionTitles.languages}
            </h3>
            <StaggerContainer className="flex flex-wrap gap-3" staggerDelay={50}>
              {languagesSpoken.map((language) => (
                <div
                  key={language.name}
                  className="px-4 py-2 bg-[var(--card-bg)] border border-[var(--border)] rounded-lg"
                >
                  <span className="text-sm font-medium">{language.name}</span>
                  <span className="text-xs text-[var(--muted)] ml-2">({language.level})</span>
                </div>
              ))}
            </StaggerContainer>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}

function SkillBadge({ name, level }: { name: string; level: string }) {
  const isAdvanced = level === "advanced";

  return (
    <div
      className={`group relative px-4 py-2 border rounded-lg transition-all duration-300 cursor-default hover:scale-105 ${
        isAdvanced
          ? "bg-[var(--accent)]/10 border-[var(--accent)]/30 hover:border-[var(--accent)] hover:shadow-[0_0_12px_rgba(59,130,246,0.2)]"
          : "bg-[var(--card-bg)] border-[var(--border)] hover:border-[var(--accent)] hover:bg-[var(--accent)]/5"
      }`}
    >
      <span
        className={`text-sm font-medium transition-colors ${
          isAdvanced ? "text-[var(--accent)]" : "group-hover:text-[var(--accent)]"
        }`}
      >
        {name}
      </span>
    </div>
  );
}
