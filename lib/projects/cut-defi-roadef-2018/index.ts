import type { Project } from "@/lib/portfolio-data";
import detailEn from "./detail.en.md";
import detailFr from "./detail.fr.md";

export const cutDefiRoadef2018: Project = {
  slug: "cut-defi-roadef-2018",
  title: {
    en: "Glass Cutting Optimization — ROADEF 2018",
    fr: "Optimisation de découpe de verre — ROADEF 2018",
  },
  description: {
    en: "6th place out of 64 teams in the ROADEF/EURO 2018 industrial optimization challenge by Saint-Gobain.",
    fr: "6e place sur 64 équipes au challenge d'optimisation industrielle ROADEF/EURO 2018 par Saint-Gobain.",
  },
  detail: {
    en: detailEn,
    fr: detailFr,
  },
  tags: [
    "C++",
    "OpenMP",
    "Genetic/Evolutionnary",
    "Simulated Annealing",
    "Heuristics",
  ],
  github: "https://github.com/zakiller34/cut-defi-roadef-2018",
  category: {
    en: "Operations Research",
    fr: "Recherche opérationnelle",
  },
  defaultUnfolded: true,
};
