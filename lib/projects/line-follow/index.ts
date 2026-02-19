import type { Project } from "@/lib/portfolio-data";
import detailEn from "./detail.en.md";
import detailFr from "./detail.fr.md";

export const lineFollow: Project = {
  slug: "line-follow",
  title: {
    en: "Line-Following Robot with micro:bit",
    fr: "Robot suiveur de ligne avec micro:bit",
  },
  description: {
    en: "A line-following robot using BBC micro:bit, SparkFun MotoBit, and IR sensors with calibration and state-machine control.",
    fr: "Robot suiveur de ligne utilisant BBC micro:bit, SparkFun MotoBit et capteurs IR avec calibration et controle par machine a etats.",
  },
  detail: { en: detailEn, fr: detailFr },
  tags: ["MicroPython", "micro:bit", "Robotics", "I2C"],
  github: "https://github.com/zakiller34/line-follow",
  category: { en: "Robotics", fr: "Robotique" },
  defaultUnfolded: true,
};
