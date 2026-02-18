import type { Project } from "@/lib/portfolio-data";
import detailEn from "./detail.en.md";
import detailFr from "./detail.fr.md";

export const simGuitar: Project = {
  slug: "sim-guitar",
  title: {
    en: "Acoustic Guitar Physical Simulation",
    fr: "Simulation physique d'une guitare acoustique",
  },
  description: {
    en: "Full acoustic chain: 1D string FEM, 2D Kirchhoff-Love soundboard, 3D Yee grid air radiation with PML.",
    fr: "Chaîne acoustique complète : corde 1D par EF, table 2D Kirchhoff-Love, rayonnement 3D grille de Yee avec PML.",
  },
  detail: {
    en: detailEn,
    fr: detailFr,
  },
  tags: ["Python", "NumPy", "SciPy", "GetFEM", "Gmsh", "FEM"],
  github: "https://github.com/zakiller34/sim-guitar",
  category: { en: "Scientific Computing", fr: "Calcul scientifique" },
  defaultUnfolded: true,
};
