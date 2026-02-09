export const SITE_CONFIG = {
  name: "Zakaria Teffah",
  location: "Montpellier, France",
  email: process.env.NEXT_PUBLIC_OWNER_EMAIL ?? "",
  phone: process.env.NEXT_PUBLIC_OWNER_PHONE ?? "",
  title: {
    en: "Research & Development Engineer",
    fr: "Ingénieur en Recherche & Développement",
  },
  description: {
    en: "Experienced professional in software & hardware development. My areas of interest are: compilers, formal methods, optimization and scientific computing",
    fr: "Professionnel expérimenté en développement logiciel et matériel. Mes domaines d'intérêt sont : les compilateurs, les méthodes formelles, l'optimisation et le calcul scientifique",
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
