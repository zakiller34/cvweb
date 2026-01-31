export const SITE_CONFIG = {
  name: "Zakaria Teffah",
  title: "Senior C++ Engineer",
  location: "Montpellier, France",
  email: "zakaria.teffah@gmail.com",
  phone: "+33 6 52 94 27 48",
  description: "Experienced professional with expertise in compilers, formal verification, and cutting-edge software development",
  social: {
    github: "https://github.com/zakte",
    linkedin: "https://linkedin.com/in/zakaria-teffah",
  },
  cvFiles: [
    { lang: "EN", path: "/CV_ZAKARIA_TEFFAH_EN.pdf" },
    { lang: "FR", path: "/CV_ZAKARIA_TEFFAH_FR.pdf" },
  ],
};

export const NAV_LINKS = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#skills", label: "Skills" },
  { href: "#education", label: "Education" },
  { href: "#contact", label: "Contact" },
];

export const STATS = [
  { value: "14+", label: "Years Experience" },
  { value: "C++", label: "Core Expertise" },
  { value: "INSA", label: "MSc Engineering" },
];

export const EXPERIENCES = [
  {
    company: "NanoXplore",
    logo: "/logos/nanoxplore.svg",
    role: "C++/Python R&D Engineer",
    period: "Feb 2021 - Present",
    location: "Montpellier, France",
    description: "FPGA compiler development, DSP pattern matching, formal verification with SMT solvers, BDD development for equivalence checking, graph/hypergraph algorithms for circuit abstractions.",
    technologies: ["C++", "Python", "SMT Solvers", "TLA+", "VHDL/Verilog", "BDD", "ModelSim"],
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
    company: "Altran Technologies",
    logo: "/logos/altran.svg",
    role: "Methods & Tools Consultant",
    period: "Aug 2011 - Dec 2014",
    location: "Toulouse, France",
    description: "Airbus flight simulator stability optimization, aircraft trajectory simulation and optimization tools, multi-physics simulation for A30X wing optimization using kriging ML.",
    technologies: ["C++", "Optimization", "Machine Learning", "Design Patterns", "Aerodynamics"],
  },
];

export const INTERNSHIPS = [
  {
    company: "IMFT Toulouse",
    role: "Graduate Internship",
    period: "Feb - Jun 2011",
    description: "Finite volume code for Biot poro-elastic coupling simulation and numerical analysis.",
  },
  {
    company: "Mercator Ocean",
    role: "Internship",
    period: "Jun - Sep 2010",
    location: "Toulouse, France",
    description: "Generation of oceanic initial conditions from meso-scale oceanic re-analysis.",
  },
  {
    company: "Norwegian Meteorological Institute",
    role: "Internship",
    period: "Jul - Aug 2009",
    location: "Oslo, Norway",
    description: "OSI SAF daily ice drift product development and validation.",
  },
];

export const SKILLS = [
  { name: "C/C++", category: "language", level: "advanced" },
  { name: "Python", category: "language", level: "advanced" },
  { name: "Bash", category: "language", level: "advanced" },
  { name: "Lean4", category: "language", level: "good" },
  { name: "TLA+", category: "language", level: "good" },
  { name: "MiniZinc", category: "language", level: "advanced" },
  { name: "Mathematica", category: "tool", level: "good" },
  { name: "R", category: "tool", level: "good" },
  { name: "Linux", category: "platform", level: "advanced" },
  { name: "VHDL/Verilog", category: "hardware", level: "good" },
  { name: "ModelSim/QuestaSim", category: "tool", level: "good" },
  { name: "SMT Solvers", category: "verification", level: "advanced" },
  { name: "Formal Verification", category: "verification", level: "advanced" },
  { name: "Compilers", category: "expertise", level: "advanced" },
  { name: "Numerical Optimization", category: "expertise", level: "advanced" },
  { name: "Mathematical Modelling", category: "expertise", level: "advanced" },
  { name: "Graph Algorithms", category: "expertise", level: "advanced" },
  { name: "Software Architecture", category: "expertise", level: "advanced" },
];

export const EDUCATION = [
  {
    school: "INSA Toulouse",
    degree: "Master of Science",
    field: "Computer Science, Mathematics and Modelling",
    period: "2006 - 2011",
    description: "Department of Mathematics Engineering",
  },
];

export const LANGUAGES = [
  { name: "French", level: "Native" },
  { name: "English", level: "C1 - Fluent" },
  { name: "Spanish", level: "Reading knowledge" },
  { name: "Chinese", level: "Reading knowledge" },
];

export const REFERENCES = [
  {
    name: "Bastien Talgorn",
    role: "Qualcomm, Toronto, Canada",
    email: "bastientalgorn@fastmail.com",
    phone: "+1 647 269 3152",
  },
  {
    name: "Vivian Bréguier",
    role: "NanoXplore, Montpellier, France",
    email: "vbreguier@nanoxplore.com",
    phone: "+33 6 64 70 29 23",
  },
  {
    name: "Chaka Kone",
    role: "Arteris IP, Staff Software Engineer, Paris",
    email: "chakakone93@yahoo.fr",
    phone: "+33 6 69 02 63 59",
  },
];

export const INTERESTS = [
  "Traveling (England, USA, Norway, Spain, Portugal, Italy, Maldives, Corsica)",
  "Running",
  "Football",
  "Guitar (~20 years of practice)",
];

export const ABOUT_TEXT = `
I am an experienced professional with 14+ years in computer science, specializing in
compilers and formal verification. I'm excited to tackle cutting-edge software problems
and ready to engage in new responsibilities in the software field.

My expertise spans C/C++ development, combinatorial and numerical optimization,
mathematical modelling, and software architecture design. Currently at NanoXplore,
I work on FPGA compiler development, DSP pattern matching, and formal verification
using SMT solvers and TLA+.

Previously, I contributed to aerospace projects at Liebherr and Altran, working on
scientific computation, trajectory optimization, and multi-physics simulations for
Airbus aircraft.
`;
