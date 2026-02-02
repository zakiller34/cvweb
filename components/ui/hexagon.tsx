"use client";

import { HTMLAttributes, forwardRef, ReactNode, memo } from "react";

interface HexagonProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  icon?: ReactNode;
  isActive?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "w-20 h-[92px]",
  md: "w-28 h-[128px]",
  lg: "w-36 h-[165px]",
};

const iconSizeClasses = {
  sm: "w-6 h-6",
  md: "w-8 h-8",
  lg: "w-10 h-10",
};

const labelSizeClasses = {
  sm: "text-[10px]",
  md: "text-xs",
  lg: "text-sm",
};

export const Hexagon = memo(forwardRef<HTMLDivElement, HexagonProps>(
  (
    {
      label,
      icon,
      isActive = false,
      size = "md",
      className = "",
      onMouseEnter,
      onMouseLeave,
      onClick,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={`
          relative cursor-pointer transition-all duration-300
          ${sizeClasses[size]}
          ${isActive ? "scale-110 z-10" : "hover:scale-105"}
          ${className}
        `}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
        {...props}
      >
        {/* Hexagon shape */}
        <div
          className={`
            absolute inset-0
            bg-[var(--card-bg)]/40 border-2
            transition-all duration-300
            ${isActive ? "border-[var(--accent)] shadow-[0_0_20px_rgba(59,130,246,0.3)]" : "border-[var(--border)] hover:border-[var(--accent)]/50"}
          `}
          style={{
            clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
          }}
        />

        {/* Glow effect when active */}
        {isActive && (
          <div
            className="absolute inset-0 bg-[var(--accent)]/10 animate-pulse"
            style={{
              clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
            }}
          />
        )}

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 p-2">
          {icon && (
            <div
              className={`
                ${iconSizeClasses[size]}
                text-[var(--accent)] transition-transform duration-300
                ${isActive ? "scale-110" : ""}
              `}
            >
              {icon}
            </div>
          )}
          <span
            className={`
              ${labelSizeClasses[size]}
              font-medium text-center leading-tight
              text-[var(--foreground)] transition-colors duration-300
            `}
          >
            {label}
          </span>
        </div>
      </div>
    );
  }
));

Hexagon.displayName = "Hexagon";
