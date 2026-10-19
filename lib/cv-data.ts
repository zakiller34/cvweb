export const NAV_LINKS = {
  en: [
    { href: "#hero", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#experience", label: "Experience" },
    { href: "#skills", label: "Skills" },
    { href: "#education", label: "Education" },
    { href: "#contact", label: "Contact" },
  ],
  fr: [
    { href: "#hero", label: "Accueil" },
    { href: "#about", label: "À propos" },
    { href: "#experience", label: "Expérience" },
    { href: "#skills", label: "Compétences" },
    { href: "#education", label: "Formation" },
    { href: "#contact", label: "Contact" },
  ],
};

export const STATS = {
  en: [
    { value: "14+", label: "Years Experience" },
    { value: "C++ & Python", label: "Core Languages" },
    { value: "INSA", label: "MSc Engineering" },
  ],
  fr: [
    { value: "14+", label: "Années d'expérience" },
    { value: "C++ & Python", label: "Langages principaux" },
    { value: "INSA", label: "Diplôme d'ingénieur" },
  ],
};

export const EXPERIENCES = {
  en: [
    {
      company: "NanoXplore",
      logo: "/logos/nanoxplore.png",
      role: "C++/Python R&D Engineer",
      location: "Montpellier, France",
      description: "C++ toolchain development for FPGA design software: graph/hypergraph algorithms, pattern matching, logic equivalence checking (BDD, SMT), performance optimization.",
      technologies: ["C++", "Python", "Graph Algorithms", "SMT Solvers", "VHDL/Verilog", "Testing"],
    },
    {
      company: "Liebherr Aerospace",
      logo: "/logos/liebherr.svg",
      role: "Scientific Tools Engineer",
      location: "Toulouse, France",
      description: "Heat transfer algorithms for aircraft icing prediction, scientific computation library for roller bearing modeling, uncertainties propagation computation for sensor-dependent physical quantities.",
      technologies: ["C++", "Python", "Scientific Computing", "Numerical Optimization"],
    },
    {
      company: "Airbus",
      logo: "/logos/altran.svg",
      role: "Methods & Tools Consultant at Altran for Airbus",
      location: "Toulouse, France",
      description: "Airbus flight simulator stability optimization, aircraft trajectory simulation and optimization tools, multi-physics simulation for A30X wing optimization using kriging ML.",
      technologies: ["C++", "Optimization", "Machine Learning", "Design Patterns", "Aerodynamics"],
    },
  ],
  fr: [
    {
      company: "NanoXplore",
      logo: "/logos/nanoxplore.png",
      role: "Ingénieur R&D C++/Python",
      location: "Montpellier, France",
      description: "Développement d'une chaîne d'outils C++ pour logiciel de conception FPGA : algorithmes de graphes/hypergraphes, pattern matching, vérification d'équivalence logique (BDD, SMT), optimisation de performance.",
      technologies: ["C++", "Python", "Graph Algorithms", "SMT Solvers", "VHDL/Verilog", "Testing"],
    },
    {
      company: "Liebherr Aerospace",
      logo: "/logos/liebherr.svg",
      role: "Ingénieur Outils Scientifiques",
      location: "Toulouse, France",
      description: "Algorithmes de transfert thermique pour la prédiction du givrage aéronautique, bibliothèque de calcul scientifique pour la modélisation des roulements, calcul de propagation d'incertitudes pour les grandeurs physiques dépendantes de capteurs.",
      technologies: ["C++", "Python", "Scientific Computing", "Numerical Optimization"],
    },
    {
      company: "Airbus",
      logo: "/logos/altran.svg",
      role: "Consultant Méthodes & Outils chez Altran pour Airbus",
      location: "Toulouse, France",
      description: "Optimisation de la stabilité du simulateur de vol Airbus, outils de simulation et d'optimisation de trajectoire d'avion, simulation multi-physique pour l'optimisation des ailes A30X utilisant le krigeage ML.",
      technologies: ["C++", "Optimization", "Machine Learning", "Design Patterns", "Aerodynamics"],
    },
  ],
};

export const INTERNSHIPS = {
  en: [
    {
      company: "IMFT Toulouse",
      logo: "/logos/imft.jpg",
      role: "Graduate Internship",
      period: "Feb - Jun 2011",
      location: "Toulouse, France",
      description: "Finite volume code for Biot poro-elastic coupling simulation and numerical analysis.",
    },
    {
      company: "Mercator Ocean",
      logo: "/logos/mercator-ocean.png",
      role: "Internship",
      period: "Jun - Sep 2010",
      location: "Toulouse, France",
      description: "Generation of oceanic initial conditions from meso-scale oceanic re-analysis.",
    },
    {
      company: "Norwegian Meteorological Institute",
      logo: "/logos/met-norway.png",
      role: "Internship",
      period: "Jul - Aug 2009",
      location: "Oslo, Norway",
      description: "OSI SAF daily ice drift product development and validation.",
    },
  ],
  fr: [
    {
      company: "IMFT Toulouse",
      logo: "/logos/imft.jpg",
      role: "Stage de fin d'études",
      period: "Fév - Juin 2011",
      location: "Toulouse, France",
      description: "Code volumes finis pour la simulation du couplage poro-élastique de Biot et analyse numérique.",
    },
    {
      company: "Mercator Ocean",
      logo: "/logos/mercator-ocean.png",
      role: "Stage",
      period: "Juin - Sep 2010",
      location: "Toulouse, France",
      description: "Génération de conditions initiales océaniques à partir de réanalyses océaniques méso-échelle.",
    },
    {
      company: "Norwegian Meteorological Institute",
      logo: "/logos/met-norway.png",
      role: "Stage",
      period: "Juil - Août 2009",
      location: "Oslo, Norvège",
      description: "Développement et validation du produit de dérive quotidienne des glaces OSI SAF.",
    },
  ],
};

// Skills don't need translation - technical terms
export const SKILLS = [
  { name: "C/C++", category: "language", level: "advanced" },
  { name: "Python", category: "language", level: "advanced" },
  { name: "Bash", category: "language", level: "advanced" },
  { name: "Lean4", category: "language", level: "good" },
  { name: "TLA+", category: "language", level: "good" },
  { name: "MiniZinc", category: "language", level: "advanced" },
  { name: "VHDL/Verilog languages", category: "hardware", level: "good" },
  { name: "Software Architecture", category: "expertise", level: "advanced" },
  { name: "Algorithms & Data Structures", category: "expertise", level: "advanced" },
  { name: "Numerical Optimization", category: "expertise", level: "advanced" },
  { name: "HPC", category: "expertise", level: "advanced" },
  { name: "Mathematical Modelling", category: "expertise", level: "advanced" },
  { name: "Testing & CI", category: "expertise", level: "good" },
  { name: "Agentic AI (agents, MCP)", category: "expertise", level: "good" },
];

export const SOFT_SKILLS = {
  en: [
    { name: "Abstraction", level: "advanced" },
    { name: "Rigor", level: "good" },
    { name: "Adaptability", level: "good" },
    { name: "Autonomy", level: "good" },
    { name: "Curiosity", level: "good" },
    { name: "Team Communication", level: "good" },
  ],
  fr: [
    { name: "Abstraction", level: "advanced" },
    { name: "Rigueur", level: "good" },
    { name: "Adaptabilité", level: "good" },
    { name: "Autonomie", level: "good" },
    { name: "Curiosité", level: "good" },
    { name: "Communication en équipe", level: "good" },
  ],
};

export const SKILL_CATEGORIES = {
  en: {
    language: "Languages",
    hardware: "Hardware",
    expertise: "Expertise",
  },
  fr: {
    language: "Langages",
    hardware: "Matériel",
    expertise: "Expertise",
  },
};

export const EDUCATION = {
  en: [
    {
      school: "INSA Toulouse",
      logo: "/logos/insa-toulouse-logo.png",
      degree: "Master of Science",
      field: "Computer Science, Mathematics and Modelling",
      period: "2006 - 2011",
      location: "Toulouse, France",
      description: "Department of Mathematics Engineering",
    },
  ],
  fr: [
    {
      school: "INSA Toulouse",
      logo: "/logos/insa-toulouse-logo.png",
      degree: "Diplôme d'Ingénieur",
      field: "Informatique, Mathématiques et Modélisation",
      period: "2006 - 2011",
      location: "Toulouse, France",
      description: "Département de Génie Mathématique",
    },
  ],
};

export const LANGUAGES_SPOKEN = {
  en: [
    { name: "French", level: "Native" },
    { name: "English", level: "C1 - Fluent" },
    { name: "Spanish", level: "Reading knowledge" },
    { name: "Chinese", level: "Reading knowledge" },
  ],
  fr: [
    { name: "Français", level: "Langue maternelle" },
    { name: "Anglais", level: "C1 - Courant" },
    { name: "Espagnol", level: "Compréhension écrite" },
    { name: "Chinois", level: "Compréhension écrite" },
  ],
};

export const INTERESTS = {
  en: [
    "Traveling (England, USA, Norway, Spain, Portugal, Italy, Maldives, Corsica)",
    "Running",
    "Football",
    "Guitar (~20 years of practice)",
  ],
  fr: [
    "Voyages (Angleterre, USA, Norvège, Espagne, Portugal, Italie, Maldives, Corse)",
    "Course à pied",
    "Football",
    "Guitare (~20 ans de pratique)",
  ],
};

export const ABOUT_TEXT = {
  en: `Software engineer with 14+ years building critical tools for industry leaders such as
Airbus and Liebherr. I enjoy owning problems end-to-end: understanding the need, designing the
architecture, and shipping tested, performant code.

Rigorous and adaptable, I ramp up quickly on new domains and technologies, and I leverage
AI coding agents to speed up delivery. I care about code quality, testing and clear
communication within a team.`,
  fr: `Ingénieur logiciel avec plus de 14 ans d'expérience dans la création d'outils critiques pour
des leaders industriels comme Airbus et Liebherr. J'aime prendre en charge les problèmes de bout en bout :
comprendre le besoin, concevoir l'architecture et livrer un code testé et performant.

Rigoureux et adaptable, je monte rapidement en compétence sur de nouveaux domaines et technologies,
et je m'appuie sur des agents IA de développement pour accélérer la livraison. J'attache une grande
importance à la qualité du code, aux tests et à une communication claire au sein de l'équipe.`,
};

export const COMPETENCIES = {
  en: [
    {
      id: "cpp",
      label: "C++",
      description: "Systems programming, performance-critical applications and low-level optimization.",
    },
    {
      id: "algorithms",
      label: "Algorithms & Optimization",
      description: "Graph algorithms, combinatorial and numerical optimization, efficient data structures for large-scale problems.",
    },
    {
      id: "python",
      label: "Python",
      description: "Scripting, data analysis, ML prototyping, and rapid tool development for scientific computing.",
    },
    {
      id: "architecture",
      label: "Software Architecture",
      description: "Modular, maintainable designs built on the right abstractions, with testing and code quality in mind.",
    },
    {
      id: "hpc",
      label: "HPC",
      description: "Parallel computing, performance optimization, and scientific simulations on high-performance systems.",
    },
    {
      id: "agentic-ai",
      label: "Agentic AI",
      description: "Leveraging AI coding agents, MCP tools and LLM workflows to accelerate design, development and testing.",
    },
  ],
  fr: [
    {
      id: "cpp",
      label: "C++",
      description: "Programmation système, applications critiques en performance et optimisation bas niveau.",
    },
    {
      id: "algorithms",
      label: "Algorithmes & Optimisation",
      description: "Algorithmes de graphes, optimisation combinatoire et numérique, structures de données efficaces pour des problèmes à grande échelle.",
    },
    {
      id: "python",
      label: "Python",
      description: "Scripting, analyse de données, prototypage ML et développement rapide d'outils pour le calcul scientifique.",
    },
    {
      id: "architecture",
      label: "Architecture Logicielle",
      description: "Conceptions modulaires et maintenables fondées sur les bonnes abstractions, en visant tests et qualité du code.",
    },
    {
      id: "hpc",
      label: "HPC",
      description: "Calcul parallèle, optimisation de performance et simulations scientifiques sur systèmes haute performance.",
    },
    {
      id: "agentic-ai",
      label: "IA Agentique",
      description: "Utilisation d'agents IA de développement, d'outils MCP et de workflows LLM pour accélérer la conception, le développement et les tests.",
    },
  ],
};
