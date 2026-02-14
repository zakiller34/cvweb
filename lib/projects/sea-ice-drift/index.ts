import type { Project } from "@/lib/portfolio-data";
import detailEn from "./detail.en.md";
import detailFr from "./detail.fr.md";

export const seaIceDrift: Project = {
  slug: "sea-ice-drift",
  title: {
    en: "Sea Ice Drift Estimation: MCC vs CMCC",
    fr: "Estimation de la dérive des glaces : MCC vs CMCC",
  },
  description: {
    en: "Cross-correlation methods for Arctic sea ice drift from satellite imagery, validated against IABP buoy tracks.",
    fr: "Méthodes de corrélation croisée pour la dérive des glaces arctiques par imagerie satellite, validées contre les bouées IABP.",
  },
  detail: {
    en: detailEn,
    fr: detailFr,
  },
  tags: ["Rust", "Python", "AMSR2 data", "ASCAT data"],
  github: "https://github.com/zakiller34/sea-ice-drift",
  category: "Remote sensing",
};
