"use client";

import { useState, useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useLanguage } from "@/components/language-provider";

interface Quote {
  en: string;
  fr: string;
  author: string;
}

const QUOTES: Quote[] = [
  {
    en: "I know that I know nothing",
    fr: "Je ne sais qu'une chose, c'est que je ne sais rien",
    author: "Socrates",
  },
  {
    en: "Mathematics is pure language \u2013 the language of science",
    fr: "Les math\u00e9matiques sont un langage pur \u2013 le langage de la science",
    author: "Alfred Adler",
  },
];

const WORD_DELAY = 120;
const LINE_DELAY = 400;
const HOLD_MS = 10000;
const FADE_OUT_MS = 600;

export function SocraticQuote() {
  const reduced = useReducedMotion();
  const { lang } = useLanguage();

  const [index, setIndex] = useState(0);
  const [visibleWords, setVisibleWords] = useState(0);
  const [lineRevealed, setLineRevealed] = useState(false);
  const [attrRevealed, setAttrRevealed] = useState(false);
  const [quoteMarkIn, setQuoteMarkIn] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);

  const current = QUOTES[index];
  const text = current[lang];
  const words = text.split(" ");

  // Track index for cycle timer cleanup
  const indexRef = useRef(index);
  indexRef.current = index;

  // Reset animation state helper
  const resetAnim = () => {
    setVisibleWords(0);
    setLineRevealed(false);
    setAttrRevealed(false);
    setQuoteMarkIn(false);
    setFadingOut(false);
  };

  // Reset on language change (replay current quote)
  useEffect(() => {
    resetAnim();
  }, [lang]);

  // Opening quote mark scale-in
  useEffect(() => {
    if (reduced || fadingOut) return;
    const timer = setTimeout(() => setQuoteMarkIn(true), 100);
    return () => clearTimeout(timer);
  }, [reduced, index, lang, fadingOut]);

  // Words stagger in
  useEffect(() => {
    if (reduced || fadingOut) return;
    if (visibleWords < words.length) {
      const delay = visibleWords === 0 ? 400 : WORD_DELAY;
      const timer = setTimeout(() => setVisibleWords((v) => v + 1), delay);
      return () => clearTimeout(timer);
    }
  }, [reduced, visibleWords, words.length, fadingOut]);

  // Decorative line after words done
  useEffect(() => {
    if (reduced || fadingOut) return;
    if (visibleWords >= words.length && !lineRevealed) {
      const timer = setTimeout(() => setLineRevealed(true), LINE_DELAY);
      return () => clearTimeout(timer);
    }
  }, [reduced, visibleWords, words.length, lineRevealed, fadingOut]);

  // Attribution after line
  useEffect(() => {
    if (reduced || fadingOut) return;
    if (lineRevealed && !attrRevealed) {
      const timer = setTimeout(() => setAttrRevealed(true), 500);
      return () => clearTimeout(timer);
    }
  }, [reduced, lineRevealed, attrRevealed, fadingOut]);

  // Cycle: after fully revealed, hold then fade out and switch
  useEffect(() => {
    if (reduced) return;
    if (!attrRevealed) return;

    // Hold, then fade out
    const holdTimer = setTimeout(() => setFadingOut(true), HOLD_MS);
    return () => clearTimeout(holdTimer);
  }, [reduced, attrRevealed]);

  // After fade-out completes, switch to next quote
  useEffect(() => {
    if (!fadingOut) return;
    const timer = setTimeout(() => {
      resetAnim();
      setIndex((i) => (i + 1) % QUOTES.length);
    }, FADE_OUT_MS);
    return () => clearTimeout(timer);
  }, [fadingOut]);

  if (reduced) {
    return (
      <div className="text-center py-8 mb-8">
        <p className="text-xl md:text-2xl text-[var(--foreground)] italic" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
          &ldquo;{text}&rdquo;
        </p>
        <span className="text-sm text-[var(--muted)] mt-3 block">&mdash; {current.author}</span>
      </div>
    );
  }

  return (
    <div
      className="text-center py-10 mb-8"
      style={{
        opacity: fadingOut ? 0 : 1,
        transform: fadingOut ? "translateY(-10px)" : "translateY(0)",
        transition: `opacity ${FADE_OUT_MS}ms ease, transform ${FADE_OUT_MS}ms ease`,
      }}
    >
      {/* Words */}
      <p
        className="text-xl md:text-2xl lg:text-3xl text-[var(--foreground)] mt-2 leading-relaxed"
        style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: "italic" }}
      >
        {/* Opening quote mark – inline, same size as closing */}
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
        {words.map((word, i) => (
          <span
            key={`${lang}-${index}-${i}`}
            className="inline-block mr-[0.3em] transition-all duration-500"
            style={{
              opacity: i < visibleWords ? 1 : 0,
              transform: i < visibleWords ? "translateY(0)" : "translateY(12px)",
              transitionDelay: `${i * 30}ms`,
            }}
          >
            {word}
          </span>
        ))}
        {/* Closing quote mark */}
        <span
          className="inline-block transition-all duration-500"
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            opacity: visibleWords >= words.length ? 0.4 : 0,
            color: "var(--accent)",
          }}
        >
          &rdquo;
        </span>
      </p>

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
