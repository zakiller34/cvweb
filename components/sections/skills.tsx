"use client";

import { SKILLS, LANGUAGES } from "@/lib/constants";

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
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Skills</h2>
        <div className="w-20 h-1 bg-[var(--accent)] mb-12" />

        <div className="space-y-8">
          {categories.map((category) => (
            <div key={category}>
              <h3 className="text-sm font-medium text-[var(--muted)] uppercase tracking-wider mb-4">
                {CATEGORY_LABELS[category] || category}
              </h3>
              <div className="flex flex-wrap gap-3">
                {SKILLS.filter((s) => s.category === category).map((skill) => (
                  <SkillBadge key={skill.name} name={skill.name} level={skill.level} />
                ))}
              </div>
            </div>
          ))}

          {/* Languages */}
          <div>
            <h3 className="text-sm font-medium text-[var(--muted)] uppercase tracking-wider mb-4">
              Languages
            </h3>
            <div className="flex flex-wrap gap-3">
              {LANGUAGES.map((lang) => (
                <div
                  key={lang.name}
                  className="px-4 py-2 bg-[var(--card-bg)] border border-[var(--border)] rounded-lg"
                >
                  <span className="text-sm font-medium">{lang.name}</span>
                  <span className="text-xs text-[var(--muted)] ml-2">({lang.level})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SkillBadge({ name, level }: { name: string; level: string }) {
  const isAdvanced = level === "advanced";

  return (
    <div
      className={`group relative px-4 py-2 border rounded-lg transition-all duration-300 cursor-default ${
        isAdvanced
          ? "bg-[var(--accent)]/10 border-[var(--accent)]/30 hover:border-[var(--accent)]"
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
