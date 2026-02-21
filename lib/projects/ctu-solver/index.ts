import type { Project } from "@/lib/portfolio-data";
import detailEn from "./detail.en.md";
import detailFr from "./detail.fr.md";

export const ctuSolver: Project = {
  slug: "ctu-solver",
  title: {
    en: "CTU-Solver — Constraint & Integer Programming in Rust",
    fr: "CTU-Solver — Programmation par contraintes et linéaire en Rust",
  },
  description: {
    en: "A Rust library combining Constraint Programming (CP) and Integer Programming (IP) with 33+ constraint types, AC-3 propagation, and a simplex solver.",
    fr: "Bibliothèque Rust combinant programmation par contraintes (CP) et programmation linéaire (IP) avec 33+ types de contraintes, propagation AC-3 et solveur simplex.",
  },
  detail: {
    en: detailEn,
    fr: detailFr,
  },
  tags: ["Rust", "Constraint Programming", "Integer Programming", "Optimization"],
  github: "https://github.com/zakiller34/ctu-solver",
  category: {
    en: "Operations Research",
    fr: "Recherche opérationnelle",
  },
  defaultUnfolded: true,
};
