"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useLanguage } from "@/components/language-provider";

interface QuoteEntry {
  type: "pattern" | "simple";
  lines: Record<"en" | "fr", string[]>;
  author: string;
}

const QUOTES: QuoteEntry[] = [
  {
    type: "pattern",
    lines: {
      en: [
        "WRITING shows how sloppy your THINKING is,",
        "MATHS shows how sloppy your WRITING is,",
        "PROGRAMMING shows how sloppy your MATH is.",
      ],
      fr: [
        "ÉCRIRE révèle le flou de PENSER,",
        "CALCULER révèle le flou d'ÉCRIRE,",
        "PROGRAMMER révèle le flou de CALCULER.",
      ],
    },
    author: "Leslie Lamport",
  },
  {
    type: "simple",
    lines: {
      en: ["Learn to understand, because to understand is to be free."],
      fr: ["Apprends pour comprendre, car comprendre c'est être libre."],
    },
    author: "Baruch Spinoza",
  },
];

const WORD_DELAY = 120;
const LINE_PAUSE = 400;
const HOLD_MS = 10000;
const FADE_OUT_MS = 600;

/** Strip punctuation and French elision prefix (d', l') to test if a word is a KEY word (all uppercase). */
function isKeyWord(raw: string): boolean {
  const stripped = raw
    .replace(/^[dl]['']/, "")
    .replace(/[,.:;!?"""'']+$/g, "");
  return stripped.length > 0 && stripped === stripped.toUpperCase() && /[A-ZÀ-Ú]/.test(stripped);
}

export function PatternQuote() {
  const reduced = useReducedMotion();
  const { lang } = useLanguage();

  const containerRef = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [fadingOut, setFadingOut] = useState(false);

  const current = QUOTES[index];
  const lines = current.lines[lang];
  const isPattern = current.type === "pattern";

  const allWords = useMemo(() => lines.map((l) => l.split(" ")), [lines]);
  const totalWords = allWords.reduce((sum, ws) => sum + ws.length, 0);

  const [visibleWords, setVisibleWords] = useState(0);
  const [quoteMarkIn, setQuoteMarkIn] = useState(false);
  const [lineRevealed, setLineRevealed] = useState(false);
  const [attrRevealed, setAttrRevealed] = useState(false);

  const resetAnim = () => {
    setVisibleWords(0);
    setQuoteMarkIn(false);
    setLineRevealed(false);
    setAttrRevealed(false);
    setFadingOut(false);
  };

  // Trigger on scroll
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Reset on language change
  useEffect(() => {
    if (!started) return;
    resetAnim();
    const t = setTimeout(() => setQuoteMarkIn(true), 100);
    return () => clearTimeout(t);
  }, [lang, started]);

  // Opening quote mark
  useEffect(() => {
    if (reduced || !started || fadingOut) return;
    const t = setTimeout(() => setQuoteMarkIn(true), 100);
    return () => clearTimeout(t);
  }, [reduced, started, index, fadingOut]);

  // Word-by-word reveal with pauses between lines
  useEffect(() => {
    if (reduced || !started || !quoteMarkIn || fadingOut) return;
    if (visibleWords >= totalWords) return;

    let cumulative = 0;
    let atLineBoundary = false;
    for (const ws of allWords) {
      cumulative += ws.length;
      if (visibleWords === cumulative && visibleWords < totalWords) {
        atLineBoundary = true;
        break;
      }
    }

    const delay = visibleWords === 0 ? 400 : atLineBoundary ? LINE_PAUSE : WORD_DELAY;
    const t = setTimeout(() => setVisibleWords((v) => v + 1), delay);
    return () => clearTimeout(t);
  }, [reduced, started, quoteMarkIn, visibleWords, totalWords, allWords, fadingOut]);

  // Decorative line after all words
  useEffect(() => {
    if (reduced || fadingOut || visibleWords < totalWords || lineRevealed) return;
    const t = setTimeout(() => setLineRevealed(true), 400);
    return () => clearTimeout(t);
  }, [reduced, fadingOut, visibleWords, totalWords, lineRevealed]);

  // Attribution after line
  useEffect(() => {
    if (reduced || fadingOut || !lineRevealed || attrRevealed) return;
    const t = setTimeout(() => setAttrRevealed(true), 500);
    return () => clearTimeout(t);
  }, [reduced, fadingOut, lineRevealed, attrRevealed]);

  // Hold then fade out
  useEffect(() => {
    if (reduced || !attrRevealed) return;
    const t = setTimeout(() => setFadingOut(true), HOLD_MS);
    return () => clearTimeout(t);
  }, [reduced, attrRevealed]);

  // After fade-out, switch to next quote
  useEffect(() => {
    if (!fadingOut) return;
    const t = setTimeout(() => {
      resetAnim();
      setIndex((i) => (i + 1) % QUOTES.length);
    }, FADE_OUT_MS);
    return () => clearTimeout(t);
  }, [fadingOut]);

  // Render a single word with optional highlight (only for pattern quotes)
  const renderWord = (word: string, globalIdx: number, highlight: boolean) => {
    const highlighted = highlight && isKeyWord(word);
    return (
      <span
        key={`${lang}-${index}-${globalIdx}`}
        className={`inline-block mr-[0.3em] transition-all duration-500 ${highlighted ? "font-bold text-[var(--accent)]" : ""}`}
        style={{
          opacity: globalIdx < visibleWords ? 1 : 0,
          transform: globalIdx < visibleWords ? "translateY(0)" : "translateY(12px)",
          transitionDelay: `${globalIdx * 30}ms`,
        }}
      >
        {word}
      </span>
    );
  };

  if (reduced && !started) {
    return <div ref={containerRef} className="py-6 mt-4" />;
  }

  // Reduced-motion static fallback
  if (reduced) {
    return (
      <div ref={containerRef} className="text-center py-6 mt-4">
        <div
          className="text-xl md:text-2xl text-[var(--foreground)] italic"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          {lines.map((line, i) => (
            <p key={i} className="my-1">
              {i === 0 && <span className="text-[var(--accent)] opacity-40">&ldquo;</span>}
              {line.split(" ").map((word, j) => (
                <span key={j} className={`inline-block mr-[0.3em] ${isPattern && isKeyWord(word) ? "font-bold text-[var(--accent)]" : ""}`}>
                  {word}
                </span>
              ))}
            </p>
          ))}
          <span className="text-[var(--accent)] opacity-40">&rdquo;</span>
        </div>
        <span className="text-sm text-[var(--muted)] mt-3 block">&mdash; {current.author}</span>
      </div>
    );
  }

  let globalIdx = 0;

  return (
    <div
      ref={containerRef}
      className="text-center py-6 mt-4"
      style={{
        opacity: fadingOut ? 0 : 1,
        transform: fadingOut ? "translateY(-10px)" : "translateY(0)",
        transition: `opacity ${FADE_OUT_MS}ms ease, transform ${FADE_OUT_MS}ms ease`,
      }}
    >
      <div
        className="text-xl md:text-2xl lg:text-3xl text-[var(--foreground)] mt-2 leading-relaxed"
        style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: "italic" }}
      >
        {allWords.map((words, lineIdx) => {
          const lineStart = globalIdx;
          const rendered = words.map((word, wIdx) => {
            const idx = lineStart + wIdx;
            return renderWord(word, idx, isPattern);
          });
          globalIdx = lineStart + words.length;
          return (
            <p key={`${lang}-${index}-line-${lineIdx}`} className="my-1">
              {/* Opening quote mark on first line */}
              {lineIdx === 0 && (
                <span
                  className="inline-block mr-[0.3em] transition-all duration-500"
                  style={{
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    opacity: quoteMarkIn ? 0.4 : 0,
                    transform: quoteMarkIn ? "scale(1)" : "scale(0.5)",
                    color: "var(--accent)",
                  }}
                >
                  &ldquo;
                </span>
              )}
              {rendered}
              {/* Closing quote mark on last line */}
              {lineIdx === allWords.length - 1 && (
                <span
                  className="inline-block transition-all duration-500"
                  style={{
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    opacity: visibleWords >= totalWords ? 0.4 : 0,
                    color: "var(--accent)",
                  }}
                >
                  &rdquo;
                </span>
              )}
            </p>
          );
        })}
      </div>

      {/* Decorative accent line */}
      <div className="flex justify-center mt-5">
        <div
          className="h-[2px] bg-[var(--accent)] transition-all duration-700 ease-out"
          style={{
            width: lineRevealed ? "80px" : "0px",
            opacity: lineRevealed ? 0.5 : 0,
          }}
        />
      </div>

      {/* Attribution */}
      <span
        className="text-sm text-[var(--muted)] mt-4 block transition-all duration-700"
        style={{
          opacity: attrRevealed ? 1 : 0,
          transform: attrRevealed ? "translateY(0)" : "translateY(8px)",
        }}
      >
        &mdash; {current.author}
      </span>
    </div>
  );
}
