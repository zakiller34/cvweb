"use client";

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
                  <div className="w-12 h-12 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center">
                    <svg className="w-6 h-6 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                    </svg>
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
