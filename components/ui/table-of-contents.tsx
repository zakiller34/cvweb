"use client";

import { useState, useEffect, useRef, RefObject, useCallback } from "react";
import { Language } from "@/components/language-provider";
import { UI_TEXT } from "@/lib/translations";

interface TocHeading {
  id: string;
  text: string;
  level: number;
}

interface TocSection {
  heading: TocHeading;
  children: TocHeading[];
}

function groupIntoSections(headings: TocHeading[]): TocSection[] {
  const sections: TocSection[] = [];
  for (const h of headings) {
    if (h.level === 2) {
      sections.push({ heading: h, children: [] });
    } else if (sections.length > 0) {
      sections[sections.length - 1].children.push(h);
    }
  }
  return sections;
}

interface TableOfContentsProps {
  contentRef: RefObject<HTMLDivElement | null>;
  lang: Language;
  projectSlug: string;
}

export function TableOfContents({ contentRef, lang, projectSlug }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<TocHeading[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [tocOpen, setTocOpen] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Extract headings from DOM after render
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const nodes = el.querySelectorAll("h2[id], h3[id]");
    const items: TocHeading[] = Array.from(nodes).map((node) => ({
      id: node.id,
      text: node.textContent ?? "",
      level: node.tagName === "H2" ? 2 : 3,
    }));
    setHeadings(items);
    setActiveId(items[0]?.id ?? "");
    setCollapsed({});
  }, [contentRef, projectSlug, lang]);

  // IntersectionObserver to track active heading
  useEffect(() => {
    if (headings.length === 0) return;

    observerRef.current?.disconnect();

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0.1 }
    );

    observerRef.current = observer;

    for (const h of headings) {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [headings]);

  const toggleSection = useCallback((id: string) => {
    setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setActiveId(id);
  }, []);

  if (headings.length === 0) return null;

  const sections = groupIntoSections(headings);

  return (
    <nav
      className={`hidden xl:block sticky top-28 max-h-[calc(100vh-8rem)] shrink-0 transition-[width] duration-300 ease-in-out ${
        tocOpen ? "w-56 overflow-y-auto" : "w-8 overflow-hidden"
      }`}
    >
      {tocOpen ? (
        <>
          <button
            onClick={() => setTocOpen(false)}
            className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--muted)] hover:text-[var(--foreground)] transition-colors mb-3 cursor-pointer"
            aria-label="Collapse table of contents"
          >
            <span className="whitespace-nowrap">{UI_TEXT[lang].onThisPage}</span>
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <ul className="flex flex-col gap-1 text-sm border-l border-[var(--border)]">
            {sections.map((section) => {
              const h = section.heading;
              const isActive = activeId === h.id;
              const isCollapsed = collapsed[h.id] ?? false;
              const hasChildren = section.children.length > 0;

              return (
                <li key={h.id}>
                  <div className="flex items-center">
                    {hasChildren && (
                      <button
                        onClick={() => toggleSection(h.id)}
                        className="flex items-center justify-center w-4 shrink-0 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                        aria-label={isCollapsed ? "Expand" : "Collapse"}
                      >
                        <svg
                          className={`w-3 h-3 transition-transform duration-200 ${isCollapsed ? "" : "rotate-90"}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M6 4l8 6-8 6V4z" />
                        </svg>
                      </button>
                    )}
                    <a
                      href={`#${h.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollTo(h.id);
                      }}
                      className={`block transition-colors duration-200 leading-snug pl-2 ${
                        !hasChildren ? "ml-4" : ""
                      } ${
                        isActive
                          ? "text-[var(--accent)] border-l-2 border-[var(--accent)] -ml-px font-medium"
                          : "text-[var(--muted)] hover:text-[var(--foreground)]"
                      }`}
                    >
                      {h.text}
                    </a>
                  </div>
                  {hasChildren && !isCollapsed && (
                    <ul className="flex flex-col gap-1 mt-1">
                      {section.children.map((child) => {
                        const childActive = activeId === child.id;
                        return (
                          <li key={child.id}>
                            <a
                              href={`#${child.id}`}
                              onClick={(e) => {
                                e.preventDefault();
                                scrollTo(child.id);
                              }}
                              className={`block transition-colors duration-200 leading-snug pl-8 ${
                                childActive
                                  ? "text-[var(--accent)] border-l-2 border-[var(--accent)] -ml-px font-medium"
                                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
                              }`}
                            >
                              {child.text}
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </>
      ) : (
        <button
          onClick={() => setTocOpen(true)}
          className="flex flex-col items-center gap-1 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
          aria-label="Expand table of contents"
        >
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M6 4l8 6-8 6V4z" />
          </svg>
          <span className="text-[10px] font-semibold uppercase tracking-wider [writing-mode:vertical-lr]">
            {UI_TEXT[lang].onThisPage}
          </span>
        </button>
      )}
    </nav>
  );
}
