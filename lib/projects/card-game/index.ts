import type { Project } from "@/lib/portfolio-data";
import detailEn from "./detail.en.md";
import detailFr from "./detail.fr.md";

export const cardGame: Project = {
  slug: "card-game",
  title: {
    en: "Optimal Texas Hold'em Strategy Laboratory",
    fr: "Laboratoire de stratégie optimale pour le Texas Hold'em",
  },
  description: {
    en: "Texas Hold'em engine with Monte Carlo simulation, formal Lean4 proofs, and RL agents.",
    fr: "Moteur Texas Hold'em avec simulation Monte Carlo, preuves formelles Lean4 et agents RL.",
  },
  detail: {
    en: detailEn,
    fr: detailFr,
  },
  tags: ["Python", "Lean4", "Monte Carlo", "Reinforcement Learning", "Machine Learning"],
  github: "https://github.com/zakiller34/card-game",
  category: {
    en: "Game Theory & AI",
    fr: "Théorie des jeux & IA",
  },
  defaultUnfolded: true,
};
