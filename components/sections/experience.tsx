"use client";

import Image from "next/image";
import { EXPERIENCES } from "@/lib/cv-data";
import { useLanguage } from "@/components/language-provider";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";
import { SectionHeader } from "@/components/ui/section-header";
import { AnimatedTimeline, TimelineDot } from "@/components/ui/animated-timeline";

const SECTION_TITLE = {
  en: "Experience",
  fr: "Expérience",
};

export function Experience() {
  const { lang } = useLanguage();
  const experiences = EXPERIENCES[lang];
  const sectionTitle = SECTION_TITLE[lang];

  return (
    <section id="experience" className="py-20 bg-[var(--card-bg)]/50">
      <div className="max-w-6xl mx-auto px-4">
        <SectionHeader title={sectionTitle} />

        <AnimatedTimeline>
          {/* Timeline items */}
          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <AnimateOnScroll
                key={exp.company}
                delay={index * 150}
                className={`relative flex flex-col md:flex-row gap-8 ${
                  index % 2 === 0 ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Timeline dot */}
                <TimelineDot index={index} />

                {/* Content */}
                <div className={`md:w-1/2 ${index % 2 === 0 ? "md:pr-12" : "md:pl-12"} pl-8 md:pl-0`}>
                  <Card hover className="h-full">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-lg bg-white border border-[var(--border)] flex items-center justify-center overflow-hidden p-1">
                        <Image
                          src={exp.logo}
                          alt={exp.company}
                          width={48}
                          height={48}
                          quality={70}
                          className="object-contain w-full h-full"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{exp.role}</h3>
                        <p className="text-[var(--accent)] text-sm">{exp.company}</p>
                        <p className="text-[var(--muted)] text-sm">{exp.period}</p>
                      </div>
                    </div>

                    <p className="text-[var(--muted)] text-sm mb-4">
                      {exp.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {exp.technologies.map((tech) => (
                        <Badge key={tech} variant="outline">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </Card>
                </div>

                {/* Spacer for alternating layout */}
                <div className="hidden md:block md:w-1/2" />
              </AnimateOnScroll>
            ))}
          </div>
        </AnimatedTimeline>
      </div>
    </section>
  );
}
