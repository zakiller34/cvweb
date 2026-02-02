import { AnimateOnScroll } from "./animate-on-scroll";

interface SectionHeaderProps {
  title: string;
}

export function SectionHeader({ title }: SectionHeaderProps) {
  return (
    <AnimateOnScroll>
      <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
      <div className="w-20 h-1 bg-[var(--accent)] mb-12" />
    </AnimateOnScroll>
  );
}
