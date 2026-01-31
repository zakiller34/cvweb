"use client";

import { SKILLS, LANGUAGES } from "@/lib/constants";
import { AnimateOnScroll, StaggerContainer } from "@/components/ui/animate-on-scroll";

const CATEGORY_LABELS: Record<string, string> = {
  language: "Programming Languages",
  tool: "Tools",
  platform: "Platforms",
  hardware: "Hardware Description",
  verification: "Verification",
  expertise: "Core Expertise",
};

const CATEGORY_ORDER = ["language", "expertise", "verification", "hardware", "tool", "platform"];

export function Skills() {
  const categories = CATEGORY_ORDER.filter((cat) =>
    SKILLS.some((s) => s.category === cat)
  );

  return (
    <section id="skills" className="py-20">
      <div className="max-w-6xl mx-auto px-4">
        <AnimateOnScroll>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Skills</h2>
          <div className="w-20 h-1 bg-[var(--accent)] mb-12" />
        </AnimateOnScroll>

        <div className="space-y-8">
          {categories.map((category, catIndex) => (
            <AnimateOnScroll key={category} delay={catIndex * 100}>
              <h3 className="text-sm font-medium text-[var(--muted)] uppercase tracking-wider mb-4">
                {CATEGORY_LABELS[category] || category}
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
              Languages
            </h3>
            <StaggerContainer className="flex flex-wrap gap-3" staggerDelay={50}>
              {LANGUAGES.map((lang) => (
                <div
                  key={lang.name}
                  className="px-4 py-2 bg-[var(--card-bg)] border border-[var(--border)] rounded-lg"
                >
                  <span className="text-sm font-medium">{lang.name}</span>
                  <span className="text-xs text-[var(--muted)] ml-2">({lang.level})</span>
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
