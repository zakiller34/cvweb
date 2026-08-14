import type { Project } from "@/lib/portfolio-data";
import detailEn from "./detail.en.md";
import detailFr from "./detail.fr.md";
import summaryImg from "./summary.png";

export const miniCompiler: Project = {
  slug: "mini-compiler",
  title: {
    en: "mini-compiler: From an ML-flavoured Language to x86-64",
    fr: "mini-compiler : d'un langage inspiré de ML vers x86-64",
  },
  description: {
    en: "A C++17 compiler to x86-64 — graph-colouring register allocation, Cheney GC, closures — and what formal verification actually buys in building one.",
    fr: "Un compilateur C++17 vers x86-64 — allocation de registres par coloration, GC de Cheney, fermetures — et ce que la vérification formelle apporte réellement à sa construction.",
  },
  detail: { en: detailEn, fr: detailFr },
  tags: ["C++17", "Lean 4", "Z3", "Compilers", "Formal Verification"],
  github: "https://github.com/zakiller34/mini-compiler",
  thumbnail: summaryImg,
  category: { en: "Compilers", fr: "Compilation" },
  defaultUnfolded: true,
};
