export const SITE_CONFIG = {
  name: "Zakaria Teffah",
  location: "Montpellier, France",
  email: process.env.NEXT_PUBLIC_OWNER_EMAIL ?? "",
  phone: process.env.NEXT_PUBLIC_OWNER_PHONE ?? "",
  title: {
    en: "Software Engineer · R&D",
    fr: "Ingénieur Logiciel · R&D",
  },
  description: {
    en: "Experienced software engineer building robust, high-performance software. Focus areas: software architecture, algorithms & optimization, scientific computing and AI-agent-assisted development",
    fr: "Ingénieur logiciel expérimenté, je conçois des logiciels robustes et performants. Domaines de prédilection : architecture logicielle, algorithmes & optimisation, calcul scientifique et développement assisté par agents IA",
  },
  social: {
    github: "https://github.com/zakiller34",
    linkedin: "https://www.linkedin.com/in/zakaria-teffah-8545959a/",
  },
  cvFiles: [
    { lang: "EN", path: "/CV_ZAKARIA_TEFFAH_EN.pdf" },
    { lang: "FR", path: "/CV_ZAKARIA_TEFFAH_FR.pdf" },
  ],
};
