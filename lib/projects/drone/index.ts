import type { Project } from "@/lib/portfolio-data";
import detailEn from "./detail.en.md";
import detailFr from "./detail.fr.md";
import summaryImg from "./summary.png";

export const drone: Project = {
  slug: "drone",
  title: {
    en: "3D Drone Digital Twin in Modelica",
    fr: "Jumeau numérique 3D de drone en Modelica",
  },
  description: {
    en: "Full 3D digital twin of a quadrotor drone using OpenModelica and MSL.",
    fr: "Jumeau numérique 3D complet d'un drone quadrirotor avec OpenModelica et MSL.",
  },
  detail: { en: detailEn, fr: detailFr },
  tags: ["Modelica", "OpenModelica", "Control Systems", "Simulation"],
  github: "https://github.com/zakiller34/drone",
  thumbnail: summaryImg,
  category: { en: "Robotics", fr: "Robotique" },
  defaultUnfolded: true,
};
