"use client";

import Image from "next/image";
import { EDUCATION, INTERNSHIPS, INTERESTS } from "@/lib/constants";
import { Card } from "@/components/ui/card";

export function Education() {
  return (
    <section id="education" className="py-20 bg-[var(--card-bg)]/50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Education</h2>
        <div className="w-20 h-1 bg-[var(--accent)] mb-12" />

        <div className="grid md:grid-cols-2 gap-8">
          {/* Education */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Degree</h3>
            {EDUCATION.map((edu) => (
              <Card key={edu.school} className="mb-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-white border border-[var(--border)] flex items-center justify-center overflow-hidden p-1">
                    <Image
                      src={edu.logo}
                      alt={edu.school}
                      width={48}
                      height={48}
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
            <h3 className="text-lg font-semibold mb-4 mt-8">Interests</h3>
            <div className="flex flex-wrap gap-2">
              {INTERESTS.map((interest) => (
                <span
                  key={interest}
                  className="px-3 py-1 bg-[var(--card-bg)] border border-[var(--border)] rounded-full text-sm text-[var(--muted)]"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>

          {/* Internships */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Internships</h3>
            <div className="space-y-4">
              {INTERNSHIPS.map((intern) => (
                <Card key={intern.company} className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium text-sm">{intern.company}</h4>
                      <p className="text-[var(--accent)] text-xs">{intern.role}</p>
                    </div>
                    <span className="text-[var(--muted)] text-xs">{intern.period}</span>
                  </div>
                  <p className="text-[var(--muted)] text-sm">{intern.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
