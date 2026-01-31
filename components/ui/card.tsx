import { HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  glow?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className = "", hover = false, glow = false, children, ...props }, ref) => {
    const hoverStyles = hover
      ? "hover:shadow-lg hover:-translate-y-1 hover:border-[var(--accent)]"
      : "";

    const glowStyles = glow
      ? "hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] dark:hover:shadow-[0_0_20px_rgba(96,165,250,0.2)]"
      : "";

    return (
      <div
        ref={ref}
        className={`bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-6 transition-all duration-300 ${hoverStyles} ${glowStyles} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
