import { HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className = "", hover = false, children, ...props }, ref) => {
    const hoverStyles = hover
      ? "hover:shadow-lg hover:-translate-y-1 hover:border-[var(--accent)]"
      : "";

    return (
      <div
        ref={ref}
        className={`bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-6 transition-all duration-300 ${hoverStyles} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
