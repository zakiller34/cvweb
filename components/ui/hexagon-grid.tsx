"use client";

import { useState, ReactNode } from "react";
import { Hexagon } from "./hexagon";

interface CompetencyItem {
  id: string;
  label: string;
  description: string;
  icon: ReactNode;
}

interface HexagonGridProps {
  items: CompetencyItem[];
  className?: string;
}

export function HexagonGrid({ items, className = "" }: HexagonGridProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeItem = items.find((item) => item.id === activeId);

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {/* Hexagon pyramid grid */}
      <div className="relative flex-shrink-0">
        {/* Row 1 (top): 1 hexagon */}
        <div className="flex justify-center gap-2">
          {items.slice(0, 1).map((item) => (
            <Hexagon
              key={item.id}
              label={item.label}
              icon={item.icon}
              isActive={activeId === item.id}
              onMouseEnter={() => setActiveId(item.id)}
              onMouseLeave={() => setActiveId(null)}
              onClick={() => setActiveId(activeId === item.id ? null : item.id)}
              size="md"
            />
          ))}
        </div>

        {/* Row 2 (middle): 2 hexagons */}
        <div className="flex justify-center gap-2 -mt-6">
          {items.slice(1, 3).map((item) => (
            <Hexagon
              key={item.id}
              label={item.label}
              icon={item.icon}
              isActive={activeId === item.id}
              onMouseEnter={() => setActiveId(item.id)}
              onMouseLeave={() => setActiveId(null)}
              onClick={() => setActiveId(activeId === item.id ? null : item.id)}
              size="md"
            />
          ))}
        </div>

        {/* Row 3 (base): 3 hexagons */}
        <div className="flex justify-center gap-2 -mt-6">
          {items.slice(3, 6).map((item) => (
            <Hexagon
              key={item.id}
              label={item.label}
              icon={item.icon}
              isActive={activeId === item.id}
              onMouseEnter={() => setActiveId(item.id)}
              onMouseLeave={() => setActiveId(null)}
              onClick={() => setActiveId(activeId === item.id ? null : item.id)}
              size="md"
            />
          ))}
        </div>
      </div>

      {/* Description panel below hexagons - fixed height to prevent layout shift */}
      <div className="min-h-[80px] flex items-start justify-center">
        <div
          className={`
            w-full max-w-md text-center
            transition-all duration-300
            ${activeItem ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}
          `}
        >
          {activeItem && (
            <div className="p-4 bg-[var(--card-bg)] border border-[var(--accent)]/30 rounded-lg">
              <h4 className="font-semibold text-[var(--foreground)] mb-1">
                {activeItem.label}
              </h4>
              <p className="text-sm text-[var(--muted)] leading-relaxed">
                {activeItem.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
