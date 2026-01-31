"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface AnimatedTimelineProps {
  children: React.ReactNode;
  className?: string;
}

export function AnimatedTimeline({ children, className = "" }: AnimatedTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lineHeight, setLineHeight] = useState(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      setLineHeight(100);
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    const updateLineHeight = () => {
      const containerRect = container.getBoundingClientRect();
      const containerTop = containerRect.top;
      const containerHeight = containerRect.height;
      const viewportHeight = window.innerHeight;

      // Calculate how much of the container is above the viewport center
      const visibleAmount = viewportHeight * 0.6 - containerTop;
      const percentage = Math.min(100, Math.max(0, (visibleAmount / containerHeight) * 100));

      setLineHeight(percentage);
    };

    updateLineHeight();
    window.addEventListener("scroll", updateLineHeight, { passive: true });
    window.addEventListener("resize", updateLineHeight);

    return () => {
      window.removeEventListener("scroll", updateLineHeight);
      window.removeEventListener("resize", updateLineHeight);
    };
  }, [reducedMotion]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Animated timeline line */}
      <div
        className="absolute left-0 md:left-1/2 top-0 w-px bg-[var(--accent)] transform md:-translate-x-1/2 transition-all duration-100"
        style={{ height: `${lineHeight}%` }}
      />
      {/* Background line (full height, faded) */}
      <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-[var(--border)] transform md:-translate-x-1/2" />
      {children}
    </div>
  );
}

interface TimelineDotProps {
  index: number;
}

export function TimelineDot({ index }: TimelineDotProps) {
  const dotRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      setIsVisible(true);
      return;
    }

    const dot = dotRef.current;
    if (!dot) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5, rootMargin: "-20% 0px" }
    );

    observer.observe(dot);
    return () => observer.disconnect();
  }, [reducedMotion]);

  return (
    <div
      ref={dotRef}
      className={`absolute left-0 md:left-1/2 w-4 h-4 rounded-full border-4 border-[var(--background)] transform -translate-x-1/2 md:-translate-x-1/2 transition-all duration-500 ${
        isVisible
          ? "bg-[var(--accent)] scale-100"
          : "bg-[var(--border)] scale-75"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    />
  );
}
