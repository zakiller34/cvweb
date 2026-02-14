"use client";

import { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/components/language-provider";
import { UI_TEXT, getTranslated } from "@/lib/translations";
import { PROJECTS, Project } from "@/lib/portfolio-data";
import { SectionHeader } from "@/components/ui/section-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnimateOnScroll, StaggerContainer } from "@/components/ui/animate-on-scroll";
import { SocraticQuote } from "@/components/ui/socratic-quote";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function groupByCategory(projects: Project[]): { category: string; projects: Project[] }[] {
  const groups: { category: string; projects: Project[] }[] = [];
  for (const project of projects) {
    const existing = groups.find((g) => g.category === project.category);
    if (existing) {
      existing.projects.push(project);
    } else {
      groups.push({ category: project.category, projects: [project] });
    }
  }
  return groups;
}

function categoryDefaultOpen(projects: Project[]): boolean {
  return !projects.every((p) => p.defaultUnfolded === false);
}

function ProjectCard({
  project,
  lang,
  onSelect,
}: {
  project: Project;
  lang: "en" | "fr";
  onSelect: (slug: string) => void;
}) {
  return (
    <Card
      hover
      className="cursor-pointer group"
      onClick={() => onSelect(project.slug)}
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-semibold text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
              {getTranslated(project.title, lang)}
            </h3>
            <p className="text-[var(--muted)] mt-1 text-sm leading-relaxed">
              {getTranslated(project.description, lang)}
            </p>
          </div>
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`GitHub - ${getTranslated(project.title, lang)}`}
            className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors shrink-0 mt-1"
            onClick={(e) => e.stopPropagation()}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </a>
        </div>
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </Card>
  );
}

function ProjectList({
  projects,
  lang,
  onSelect,
}: {
  projects: Project[];
  lang: "en" | "fr";
  onSelect: (slug: string) => void;
}) {
  const groups = groupByCategory(projects);

  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
    () => {
      const init: Record<string, boolean> = {};
      for (const group of groups) {
        init[group.category] = categoryDefaultOpen(group.projects);
      }
      return init;
    }
  );

  const toggleCategory = (category: string) => {
    setOpenCategories((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  const foldAll = () => {
    setOpenCategories((prev) => {
      const next: Record<string, boolean> = {};
      for (const key of Object.keys(prev)) next[key] = false;
      return next;
    });
  };

  const unfoldAll = () => {
    setOpenCategories((prev) => {
      const next: Record<string, boolean> = {};
      for (const key of Object.keys(prev)) next[key] = true;
      return next;
    });
  };

  return (
    <section className="min-h-screen px-6 md:px-16 lg:px-24 py-24 max-w-5xl mx-auto">
      <SocraticQuote />
      <SectionHeader title={UI_TEXT[lang].portfolioTitle} />
      <div className="flex justify-end gap-2 mb-1">
        <button
          onClick={foldAll}
          title={UI_TEXT[lang].foldAll}
          className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 12h16M8 8l4-4 4 4M8 16l4 4 4-4" />
          </svg>
        </button>
        <button
          onClick={unfoldAll}
          title={UI_TEXT[lang].unfoldAll}
          className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 12h16M8 4l4 4 4-4M8 20l4-4 4 4" />
          </svg>
        </button>
      </div>
      <div className="flex flex-col gap-6">
        {groups.map((group) => {
          const isOpen = openCategories[group.category] ?? false;
          return (
            <div key={group.category}>
              <button
                onClick={() => toggleCategory(group.category)}
                className="flex items-center gap-2 mb-3 text-xl font-bold text-[var(--foreground)] hover:text-[var(--accent)] transition-colors cursor-pointer"
              >
                <svg
                  className={`w-4 h-4 transition-transform ${isOpen ? "rotate-90" : ""}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M6 4l8 6-8 6V4z" />
                </svg>
                {group.category}
              </button>
              {isOpen && (
                <StaggerContainer className="flex flex-col gap-4" staggerDelay={120}>
                  {group.projects.map((project) => (
                    <AnimateOnScroll key={project.slug} animation="fade-up">
                      <ProjectCard project={project} lang={lang} onSelect={onSelect} />
                    </AnimateOnScroll>
                  ))}
                </StaggerContainer>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ProjectDetail({
  project,
  lang,
  onBack,
}: {
  project: Project;
  lang: "en" | "fr";
  onBack: () => void;
}) {
  return (
    <section className="min-h-screen px-6 md:px-16 lg:px-24 py-24 max-w-5xl mx-auto">
      <AnimateOnScroll animation="fade">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[var(--muted)] hover:text-[var(--accent)] transition-colors mb-8 group"
        >
          <svg
            className="w-5 h-5 group-hover:-translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm">{UI_TEXT[lang].backToProjects}</span>
        </button>
      </AnimateOnScroll>

      <AnimateOnScroll animation="fade-up">
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-4">
          {getTranslated(project.title, lang)}
        </h1>
        <div className="flex flex-wrap gap-2 mb-6">
          {project.tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
      </AnimateOnScroll>

      <AnimateOnScroll animation="fade-up" delay={100}>
        <Card className="mb-8">
          <p className="text-[var(--muted)] leading-relaxed">
            {getTranslated(project.description, lang)}
          </p>
        </Card>
      </AnimateOnScroll>

      <div className="prose prose-invert max-w-none prose-headings:text-[var(--foreground)] prose-p:text-[var(--foreground)] prose-strong:text-[var(--foreground)] prose-li:text-[var(--foreground)] prose-td:text-[var(--foreground)] prose-th:text-[var(--foreground)]">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {getTranslated(project.detail, lang)}
        </ReactMarkdown>
      </div>

      <AnimateOnScroll animation="fade-up" delay={300}>
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mt-8 px-5 py-2.5 bg-[var(--accent)] text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          {UI_TEXT[lang].viewOnGithub}
        </a>
      </AnimateOnScroll>
    </section>
  );
}

export default function PortfolioPage() {
  const { lang } = useLanguage();
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  const selectProject = useCallback((slug: string) => {
    setSelectedSlug(slug);
    window.history.pushState({ project: slug }, "", `/portfolio?project=${slug}`);
  }, []);

  const goBack = useCallback(() => {
    setSelectedSlug(null);
    window.history.pushState(null, "", "/portfolio");
  }, []);

  useEffect(() => {
    const onPopState = (e: PopStateEvent) => {
      const slug = (e.state as { project?: string } | null)?.project ?? null;
      setSelectedSlug(slug);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const selectedProject = selectedSlug
    ? PROJECTS.find((p) => p.slug === selectedSlug) ?? null
    : null;

  if (selectedProject) {
    return (
      <ProjectDetail
        project={selectedProject}
        lang={lang}
        onBack={goBack}
      />
    );
  }

  return (
    <ProjectList
      projects={PROJECTS}
      lang={lang}
      onSelect={selectProject}
    />
  );
}
