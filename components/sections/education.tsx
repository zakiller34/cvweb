"use client";

import Image from "next/image";
import { EDUCATION, INTERNSHIPS, INTERESTS } from "@/lib/cv-data";
import { useLanguage } from "@/components/language-provider";
import { Card } from "@/components/ui/card";
import { AnimateOnScroll, StaggerContainer } from "@/components/ui/animate-on-scroll";
import { SectionHeader } from "@/components/ui/section-header";

const SECTION_TITLES = {
  en: {
    education: "Education",
    degree: "Degree",
    interests: "Interests",
    internships: "Internships",
  },
  fr: {
    education: "Formation",
    degree: "Diplôme",
    interests: "Centres d'intérêt",
    internships: "Stages",
  },
};

export function Education() {
  const { lang } = useLanguage();
  const education = EDUCATION[lang];
  const internships = INTERNSHIPS[lang];
  const interests = INTERESTS[lang];
  const titles = SECTION_TITLES[lang];

  return (
    <section id="education" className="py-20 bg-[var(--card-bg)]/50">
      <div className="max-w-6xl mx-auto px-4">
        <SectionHeader title={titles.education} />

        <div className="grid md:grid-cols-2 gap-8">
          {/* Education */}
          <AnimateOnScroll delay={100}>
            <h3 className="text-lg font-semibold mb-4">{titles.degree}</h3>
            {education.map((edu) => (
              <Card key={edu.school} className="mb-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-white border border-[var(--border)] flex items-center justify-center overflow-hidden p-1">
                    <Image
                      src={edu.logo}
                      alt={edu.school}
                      width={48}
                      height={48}
                      quality={70}
                      className="object-contain w-full h-full"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold">{edu.school}</h4>
                    <p className="text-[var(--accent)] text-sm">{edu.degree}</p>
                    <p className="text-[var(--muted)] text-sm">{edu.field}</p>
                    <p className="text-[var(--muted)] text-xs mt-1">{edu.period}</p>
                    <p className="text-[var(--muted)] text-xs">{edu.description}</p>
                  </div>
                </div>
              </Card>
            ))}

            {/* Interests */}
            <h3 className="text-lg font-semibold mb-4 mt-8">{titles.interests}</h3>
            <StaggerContainer className="flex flex-wrap gap-2" staggerDelay={50}>
              {interests.map((interest) => (
                <span
                  key={interest}
                  className="px-3 py-1 bg-[var(--card-bg)] border border-[var(--border)] rounded-full text-sm text-[var(--muted)]"
                >
                  {interest}
                </span>
              ))}
            </StaggerContainer>
          </AnimateOnScroll>

          {/* Internships */}
          <AnimateOnScroll delay={200}>
            <h3 className="text-lg font-semibold mb-4">{titles.internships}</h3>
            <StaggerContainer className="space-y-4" staggerDelay={100}>
              {internships.map((intern) => (
                <Card key={intern.company} className="p-4">
                  <div className="flex gap-3">
                    <div className="w-12 h-12 rounded-lg bg-white border border-[var(--border)] flex items-center justify-center overflow-hidden p-1 flex-shrink-0">
                      <Image
                        src={intern.logo}
                        alt={intern.company}
                        width={48}
                        height={48}
                        className="object-contain w-full h-full"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <h4 className="font-medium text-sm">{intern.company}</h4>
                          <p className="text-[var(--accent)] text-xs">{intern.role}</p>
                        </div>
                        <span className="text-[var(--muted)] text-xs flex-shrink-0">{intern.period}</span>
                      </div>
                      <p className="text-[var(--muted)] text-sm">{intern.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </StaggerContainer>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
