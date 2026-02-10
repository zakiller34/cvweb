export interface Project {
  slug: string;
  title: { en: string; fr: string };
  description: { en: string; fr: string };
  detail: { en: string; fr: string };
  tags: string[];
  github: string;
}

export const PROJECTS: Project[] = [
  {
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
      en: "CVWeb is the website you're currently viewing. It features a particle-based animated background, bilingual support (English/French), a contact form with email integration, and this portfolio section. Built with Next.js App Router, TypeScript strict mode, and Tailwind CSS for a fully responsive experience.",
      fr: "CVWeb est le site que vous consultez actuellement. Il comprend un arrière-plan animé à base de particules, un support bilingue (anglais/français), un formulaire de contact avec intégration email, et cette section portfolio. Construit avec Next.js App Router, TypeScript strict mode, et Tailwind CSS pour une expérience entièrement responsive.",
    },
    tags: ["Next.js", "TypeScript", "Tailwind"],
    github: "https://github.com/example/cvweb",
  },
  // {    
  //   slug: "minicompiler",
  //   title: {
  //     en: "MiniCompiler",
  //     fr: "MiniCompiler",
  //   },
  //   description: {
  //     en: "A toy compiler targeting LLVM IR, built from scratch with a custom lexer, parser, and code generator.",
  //     fr: "Un compilateur jouet ciblant LLVM IR, construit de zéro avec un lexer, parser et générateur de code personnalisés.",
  //   },
  //   detail: {
  //     en: "MiniCompiler is an educational compiler project that takes a simple C-like language and compiles it down to LLVM IR. It features a hand-written recursive descent parser, semantic analysis with type checking, and an SSA-based intermediate representation. The project helped deepen understanding of compilation pipelines, optimization passes, and low-level code generation.",
  //     fr: "MiniCompiler est un projet de compilateur éducatif qui prend un langage simple de type C et le compile en LLVM IR. Il comprend un parser récursif descendant écrit à la main, une analyse sémantique avec vérification de types, et une représentation intermédiaire basée sur SSA. Le projet a permis d'approfondir la compréhension des pipelines de compilation, des passes d'optimisation et de la génération de code bas niveau.",
  //   },
  //   tags: ["C++", "LLVM", "Compiler"],
  //   github: "https://github.com/example/minicompiler",
  // },
];
