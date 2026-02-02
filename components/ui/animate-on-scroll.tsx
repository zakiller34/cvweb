"use client";

import { ReactNode, CSSProperties, memo, useMemo } from "react";
import { useIntersection } from "@/hooks/use-intersection";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface AnimateOnScrollProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  animation?: "fade-up" | "fade" | "scale";
}

export const AnimateOnScroll = memo(function AnimateOnScroll({
  children,
  className = "",
  delay = 0,
  animation = "fade-up",
}: AnimateOnScrollProps) {
  const [ref, isVisible] = useIntersection<HTMLDivElement>({
    threshold: 0.1,
    triggerOnce: true,
  });
  const reducedMotion = useReducedMotion();

  const style = useMemo<CSSProperties>(() => {
    const getTransform = () => {
      if (reducedMotion) return "none";
      if (isVisible) return "translateY(0) scale(1)";

      switch (animation) {
        case "fade-up":
          return "translateY(20px)";
        case "scale":
          return "scale(0.95)";
        default:
          return "none";
      }
    };

    return {
      opacity: reducedMotion || isVisible ? 1 : 0,
      transform: getTransform(),
      transition: reducedMotion
        ? "none"
        : `opacity var(--anim-slow) var(--anim-timing) ${delay}ms, transform var(--anim-slow) var(--anim-timing) ${delay}ms`,
    };
  }, [reducedMotion, isVisible, animation, delay]);

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
});

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

export const StaggerContainer = memo(function StaggerContainer({
  children,
  className = "",
  staggerDelay = 100,
}: StaggerContainerProps) {
  const [ref, isVisible] = useIntersection<HTMLDivElement>({
    threshold: 0.1,
    triggerOnce: true,
  });
  const reducedMotion = useReducedMotion();

  const containerStyle = useMemo<CSSProperties>(
    () => ({
      ["--stagger-delay" as string]: `${staggerDelay}ms`,
      ["--is-visible" as string]: isVisible ? "1" : "0",
    }),
    [staggerDelay, isVisible]
  );

  return (
    <div ref={ref} className={className} style={containerStyle}>
      {Array.isArray(children)
        ? children.map((child, index) => (
            <div
              key={index}
              style={{
                opacity: reducedMotion || isVisible ? 1 : 0,
                transform: reducedMotion || isVisible ? "translateY(0)" : "translateY(15px)",
                transition: reducedMotion
                  ? "none"
                  : `opacity var(--anim-normal) var(--anim-timing) ${index * staggerDelay}ms, transform var(--anim-normal) var(--anim-timing) ${index * staggerDelay}ms`,
              }}
            >
              {child}
            </div>
          ))
        : children}
    </div>
  );
});
