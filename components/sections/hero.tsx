"use client";

import Image from "next/image";
import { SITE_CONFIG, STATS, UI_TEXT } from "@/lib/constants";
import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";
import { Typewriter } from "@/components/ui/typewriter";
import { GitHubIcon, LinkedInIcon, EmailIcon, PortfolioIcon } from "@/components/sidebars/sidebar-icons";
import { SITE_CONFIG as SC } from "@/lib/constants";

interface HeroProps {
  showCvDownload?: boolean;
  showContactForm?: boolean;
  showScheduleMeeting?: boolean;
  showMailTo?: boolean;
  showPortfolio?: boolean;
  showGitHub?: boolean;
  showLinkedIn?: boolean;
}

export function Hero({ showCvDownload = true, showContactForm = true, showScheduleMeeting = true, showMailTo = true, showPortfolio = true, showGitHub = true, showLinkedIn = true }: HeroProps) {
  const { lang } = useLanguage();
  const stats = STATS[lang];
  const ui = UI_TEXT[lang];

  return (
    <section id="hero" className="min-h-screen flex items-center pt-16">
      <div className="max-w-6xl mx-auto px-4 py-20 w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <AnimateOnScroll className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                <span className="text-[#38bdf8]">Zakaria</span>{" "}
                Teffah
              </h1>
              <p className="text-xl md:text-2xl text-[var(--muted)]">
                <Typewriter text={SITE_CONFIG.title[lang]} delay={60} />
              </p>
            </div>

            <p className="text-lg text-[var(--muted)] max-w-md">
              {SITE_CONFIG.description[lang]}
            </p>

            {!showContactForm && (
              <div className="space-y-3">
                <span className="text-xl md:text-2xl font-medium text-[var(--accent)]">
                  zakaria.teffah [at] gmail [dot] com
                </span>
                {(showGitHub || showLinkedIn || showPortfolio || showMailTo) && (
                  <div className="flex gap-3 pt-6">
                    {showGitHub && (
                      <a href={SC.social.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors">
                        <GitHubIcon className="w-7 h-7" />
                      </a>
                    )}
                    {showLinkedIn && (
                      <a href={SC.social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors">
                        <LinkedInIcon className="w-7 h-7" />
                      </a>
                    )}
                    {showPortfolio && (
                      <a href="/portfolio" aria-label="Portfolio" className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors">
                        <PortfolioIcon className="w-7 h-7" />
                      </a>
                    )}
                    {showMailTo && (
                      <a href={`mailto:${SC.email}`} aria-label="Email" className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors">
                        <EmailIcon className="w-7 h-7" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-wrap gap-4">
              {showContactForm && (
                <Button size="lg" onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}>
                  {ui.getInTouch}
                </Button>
              )}
              {showCvDownload && SITE_CONFIG.cvFiles.map((cv) => (
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
              {showScheduleMeeting && (
                <a
                  href="https://calendly.com/zakaria-teffah/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] focus:ring-[var(--accent)] px-6 py-3 text-base"
                >
                  {ui.scheduleMeeting}
                </a>
              )}
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
                    sizes="(max-width: 768px) 256px, 320px"
                    quality={85}
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
