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
    { value: "C++/Rust & Python", label: "Core Languages" },
    { value: "Compiler", label: "Lex/Yacc/LLVM" },
    { value: "Lean/TLA+ and Z3", label: "Formal Verification tools" },
    { value: "INSA", label: "MSc Engineering" },
  ],
  fr: [
    { value: "14+", label: "Années d'expérience" },
    { value: "C++/Rust & Python", label: "Langages principaux" },
    { value: "Compilateur", label: "Lex/Yacc/LLVM" },
    { value: "Lean/TLA+ et Z3", label: "Outils de vérification formelle" },
    { value: "INSA", label: "Diplôme d'ingénieur" },
  ],
};

export const EXPERIENCES = {
  en: [
    {
      company: "NanoXplore",
      logo: "/logos/nanoxplore.png",
      role: "C++/Python R&D Engineer",
      period: "Feb 2021 - Dec 2025",
      location: "Montpellier, France",
      description: "FPGA compiler development, DSP pattern matching, formal verification with SMT solvers, Reduced Ordered Binary Decision Diagram development for equivalence checking, graph/hypergraph algorithms for circuit abstractions.",
      technologies: ["C++", "Python", "SMT Solvers", "TLA+", "VHDL/Verilog", "ROBDD", "ModelSim"],
    },
    {
      company: "Liebherr Aerospace",
      logo: "/logos/liebherr.svg",
      role: "Scientific Tools Engineer",
      period: "Jan 2015 - Apr 2019",
      location: "Toulouse, France",
      description: "Heat transfer algorithms for aircraft icing prediction, scientific computation library for roller bearing modeling, uncertainties propagation computation for sensor-dependent physical quantities.",
      technologies: ["C++", "Python", "Scientific Computing", "Numerical Optimization"],
    },
    {
      company: "Airbus",
      logo: "/logos/altran.svg",
      role: "Methods & Tools Consultant at Altran for Airbus",
      period: "Aug 2011 - Dec 2014",
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
      period: "Fév 2021 - Déc 2025",
      location: "Montpellier, France",
      description: "Développement de compilateur FPGA, pattern matching DSP, vérification formelle avec solveurs SMT, développement de ROBDD pour la vérification d'équivalence, algorithmes de graphes/hypergraphes pour les abstractions de circuits.",
      technologies: ["C++", "Python", "SMT Solvers", "TLA+", "VHDL/Verilog", "ROBDD", "ModelSim"],
    },
    {
      company: "Liebherr Aerospace",
      logo: "/logos/liebherr.svg",
      role: "Ingénieur Outils Scientifiques",
      period: "Jan 2015 - Avr 2019",
      location: "Toulouse, France",
      description: "Algorithmes de transfert thermique pour la prédiction du givrage aéronautique, bibliothèque de calcul scientifique pour la modélisation des roulements, calcul de propagation d'incertitudes pour les grandeurs physiques dépendantes de capteurs.",
      technologies: ["C++", "Python", "Scientific Computing", "Numerical Optimization"],
    },
    {
      company: "Airbus",
      logo: "/logos/altran.svg",
      role: "Consultant Méthodes & Outils chez Altran pour Airbus",
      period: "Août 2011 - Déc 2014",
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
  { name: "Compilers", category: "expertise", level: "advanced" },
  { name: "Numerical Optimization", category: "expertise", level: "advanced" },
  { name: "Mathematical Modelling", category: "expertise", level: "advanced" },
  { name: "Formal Verification", category: "expertise", level: "advanced" },
  { name: "Software Architecture", category: "expertise", level: "advanced" },
];

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
  en: `I am an experienced professional with 14+ years in computer science, specializing in
compilers and formal verification. I'm excited to tackle cutting-edge software & hardware problems.

My expertise spans C/C++ development, combinatorial and numerical optimization,
mathematical modelling, and software architecture design. I am specialized in formal verification
using Lean, TLA+ and SMT solvers like Z3.`,
  fr: `Je suis un professionnel expérimenté avec plus de 14 ans en informatique, spécialisé dans
les compilateurs et la vérification formelle. Je suis passionné par les défis logiciels et matériels de pointe.

Mon expertise couvre le développement C/C++, l'optimisation combinatoire et numérique,
la modélisation mathématique et la conception d'architecture logicielle. Je suis spécialisé en vérification formelle
utilisant Lean, TLA+ et les solveurs SMT comme Z3.`,
};

export const COMPETENCIES = {
  en: [
    {
      id: "cpp",
      label: "C++",
      description: "Systems programming, performance-critical applications, compiler development and low-level optimization.",
    },
    {
      id: "rust",
      label: "Rust",
      description: "Memory-safe systems programming, concurrent applications, and high-reliability software development.",
    },
    {
      id: "python",
      label: "Python",
      description: "Scripting, data analysis, ML prototyping, and rapid tool development for scientific computing.",
    },
    {
      id: "formal-verification",
      label: "Formal Verification",
      description: "Mathematical proofs for software correctness using Lean, TLA+, and SMT solvers like Z3.",
    },
    {
      id: "hpc",
      label: "HPC",
      description: "Parallel computing, performance optimization, and scientific simulations on high-performance systems.",
    },
    {
      id: "tech-scouting",
      label: "Tech Scouting",
      description: "Emerging technology evaluation, innovation tracking, and strategic technical recommendations.",
    },
  ],
  fr: [
    {
      id: "cpp",
      label: "C++",
      description: "Programmation système, applications critiques en performance, développement de compilateurs et optimisation bas niveau.",
    },
    {
      id: "rust",
      label: "Rust",
      description: "Programmation système sûre en mémoire, applications concurrentes et développement logiciel haute fiabilité.",
    },
    {
      id: "python",
      label: "Python",
      description: "Scripting, analyse de données, prototypage ML et développement rapide d'outils pour le calcul scientifique.",
    },
    {
      id: "formal-verification",
      label: "Vérification Formelle",
      description: "Preuves mathématiques de correction logicielle avec Lean, TLA+ et solveurs SMT comme Z3.",
    },
    {
      id: "hpc",
      label: "HPC",
      description: "Calcul parallèle, optimisation de performance et simulations scientifiques sur systèmes haute performance.",
    },
    {
      id: "tech-scouting",
      label: "Veille Techno",
      description: "Évaluation des technologies émergentes, suivi de l'innovation et recommandations techniques stratégiques.",
    },
  ],
};
