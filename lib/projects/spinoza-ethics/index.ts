import type { Project } from "@/lib/portfolio-data";
import detailEn from "./detail.en.md";
import detailFr from "./detail.fr.md";
import summaryImg from "./summary.png";

export const spinozaEthics: Project = {
  slug: "spinoza-ethics",
  title: {
    en: "God, Substance, and Necessity: Formalizing Spinoza's Ethics in Lean 4",
    fr: "Dieu, substance et necessite : formalisation de l'Ethique de Spinoza en Lean 4",
  },
  description: {
    en: "Machine-checked formalization of Spinoza's Ethics Part I using Lean 4 and Mathlib.",
    fr: "Formalisation verifiee par machine de la Partie I de l'Ethique de Spinoza en Lean 4 et Mathlib.",
  },
  detail: { en: detailEn, fr: detailFr },
  tags: ["Lean4", "Mathlib", "Formal Verification", "Philosophy"],
  github: "https://github.com/zakiller34/lean-proofs",
  thumbnail: summaryImg,
  category: { en: "Formal Methods", fr: "Methodes formelles" },
  defaultUnfolded: true,
};
