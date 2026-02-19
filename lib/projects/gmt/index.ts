import type { Project } from "@/lib/portfolio-data";
import detailEn from "./detail.en.md";
import detailFr from "./detail.fr.md";

export const gmt: Project = {
  slug: "gmt",
  title: {
    en: "GMT — Generic Maths Tool",
    fr: "GMT — Outil Mathematique Generique",
  },
  description: {
    en: "Scientific computing library: Gaussian process regression, tension splines, ridge regression, Monte Carlo simulation, and neural networks.",
    fr: "Bibliotheque de calcul scientifique : regression par processus gaussiens, splines en tension, regression ridge, simulation Monte Carlo et reseaux de neurones.",
  },
  detail: { en: detailEn, fr: detailFr },
  tags: ["Python", "NumPy", "SciPy", "Machine Learning", "GP Regression"],
  github: "https://github.com/zakiller34/gmt",
  category: { en: "Scientific Computing", fr: "Calcul scientifique" },
  defaultUnfolded: true,
};
