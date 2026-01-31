"use client";

import Image from "next/image";
import { SITE_CONFIG, STATS, UI_TEXT } from "@/lib/constants";
import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";
import { Typewriter } from "@/components/ui/typewriter";

export function Hero() {
  const { lang } = useLanguage();
  const stats = STATS[lang];
  const ui = UI_TEXT[lang];

  return (
    <section className="min-h-screen flex items-center pt-16">
      <div className="max-w-6xl mx-auto px-4 py-20 w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <AnimateOnScroll className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                {SITE_CONFIG.name}
              </h1>
              <p className="text-xl md:text-2xl text-[var(--muted)]">
                <Typewriter text={SITE_CONFIG.title[lang]} delay={60} />
              </p>
            </div>

            <p className="text-lg text-[var(--muted)] max-w-md">
              {SITE_CONFIG.description[lang]}
            </p>

            <div className="flex items-center gap-2 text-[var(--muted)]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{SITE_CONFIG.location}</span>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button size="lg" onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}>
                {ui.getInTouch}
              </Button>
              {SITE_CONFIG.cvFiles.map((cv) => (
                <a
                  key={cv.lang}
                  href={cv.path}
                  download
                  className="inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 border-2 border-[var(--border)] text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)] px-4 py-3 text-base gap-2"
                >
                  <span>CV</span>
                  <span className="text-xs px-1.5 py-0.5 bg-[var(--card-bg)] rounded">{cv.lang}</span>
                </a>
              ))}
            </div>

            {/* Social links */}
            <div className="flex gap-4 pt-4">
              <a
                href={SITE_CONFIG.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                aria-label="GitHub"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
              <a
                href={SITE_CONFIG.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </AnimateOnScroll>

          {/* Photo placeholder */}
          <AnimateOnScroll delay={200} className="flex justify-center">
            <div className="relative animate-float">
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] p-1">
                <div className="w-full h-full rounded-full relative overflow-hidden">
                  <Image
                    src="/profile.jpg"
                    alt={SITE_CONFIG.name}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-[var(--accent)]/10 rounded-full blur-xl animate-pulse-glow" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-[var(--accent)]/10 rounded-full blur-xl animate-pulse-glow" style={{ animationDelay: "1s" }} />
            </div>
          </AnimateOnScroll>
        </div>

        {/* Stats */}
        <AnimateOnScroll delay={400}>
          <div className="flex flex-wrap justify-center gap-6 md:gap-10 mt-20 pt-10 border-t border-[var(--border)]">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="text-center min-w-[100px] md:min-w-[120px]"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-2xl md:text-3xl font-bold text-[var(--accent)]">
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm text-[var(--muted)] mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
