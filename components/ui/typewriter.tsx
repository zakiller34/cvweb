"use client";

import { useState, useEffect } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface TypewriterProps {
  text: string;
  delay?: number;
  className?: string;
}

export function Typewriter({ text, delay = 80, className = "" }: TypewriterProps) {
  const [displayText, setDisplayText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      setDisplayText(text);
      setShowCursor(false);
      return;
    }

    let index = 0;
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
        // Hide cursor after typing complete
        setTimeout(() => setShowCursor(false), 2000);
      }
    }, delay);

    return () => clearInterval(timer);
  }, [text, delay, reducedMotion]);

  return (
    <span className={className}>
      {displayText}
      {showCursor && (
        <span className="animate-blink text-[var(--accent)]">|</span>
      )}
    </span>
  );
}
