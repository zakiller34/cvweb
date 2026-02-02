import { ReactNode } from "react";

interface IconButtonProps {
  href: string;
  ariaLabel: string;
  children: ReactNode;
  external?: boolean;
}

export function IconButton({ href, ariaLabel, children, external = false }: IconButtonProps) {
  const externalProps = external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <a
      href={href}
      {...externalProps}
      className="w-10 h-10 rounded-lg bg-[var(--card-bg)]/80 backdrop-blur-sm border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--accent)] hover:border-[var(--accent)] hover:scale-110 transition-all duration-300"
      aria-label={ariaLabel}
    >
      {children}
    </a>
  );
}
