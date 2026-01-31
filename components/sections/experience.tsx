"use client";

import { EXPERIENCES } from "@/lib/constants";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function Experience() {
  return (
    <section id="experience" className="py-20 bg-[var(--card-bg)]/50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Experience</h2>
        <div className="w-20 h-1 bg-[var(--accent)] mb-12" />

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-[var(--border)] transform md:-translate-x-1/2" />

          {/* Timeline items */}
          <div className="space-y-12">
            {EXPERIENCES.map((exp, index) => (
              <div
                key={exp.company}
                className={`relative flex flex-col md:flex-row gap-8 ${
                  index % 2 === 0 ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Timeline dot */}
                <div className="absolute left-0 md:left-1/2 w-4 h-4 bg-[var(--accent)] rounded-full border-4 border-[var(--background)] transform -translate-x-1/2 md:-translate-x-1/2" />

                {/* Content */}
                <div className={`md:w-1/2 ${index % 2 === 0 ? "md:pr-12" : "md:pl-12"} pl-8 md:pl-0`}>
                  <Card hover className="h-full">
                    <div className="flex items-start gap-4 mb-4">
                      {/* Company logo placeholder */}
                      <div className="w-12 h-12 rounded-lg bg-[var(--background)] border border-[var(--border)] flex items-center justify-center text-xs font-bold text-[var(--muted)]">
                        {exp.company.slice(0, 2).toUpperCase()}
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
