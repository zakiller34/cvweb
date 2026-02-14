import type { Project } from "@/lib/portfolio-data";
import detailEn from "./detail.en.md";
import detailFr from "./detail.fr.md";

export const cvweb: Project = {
  slug: "cvweb",
  title: {
    en: "CVWeb",
    fr: "CVWeb",
  },
  description: {
    en: "This portfolio website — a bilingual, animated CV built with Next.js and Tailwind CSS.",
    fr: "Ce site portfolio — un CV bilingue et animé construit avec Next.js et Tailwind CSS.",
  },
  detail: {
    en: detailEn,
    fr: detailFr,
  },
  tags: ["Next.js", "TypeScript"],
  github: "https://github.com/zakiller34/cvweb",
  category: "Other",
  defaultUnfolded: false,
};
