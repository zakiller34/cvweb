import type { StaticImageData } from "next/image";
import { cvweb } from "./projects/cvweb";
import { cutDefiRoadef2018 } from "./projects/cut-defi-roadef-2018";
import { seaIceDrift } from "./projects/sea-ice-drift";
import { satExplo } from "./projects/sat-explo";
import { simGuitar } from "./projects/sim-guitar";
import { lineFollow } from "./projects/line-follow";
import { drone } from "./projects/drone";
import { gmt } from "./projects/gmt";
import { cardGame } from "./projects/card-game";
import { spinozaEthics } from "./projects/spinoza-ethics";
import { ctuSolver } from "./projects/ctu-solver";

export interface Project {
  slug: string;
  title: { en: string; fr: string };
  description: { en: string; fr: string };
  detail: { en: string; fr: string };
  tags: string[];
  github: string;
  category: { en: string; fr: string };
  thumbnail?: StaticImageData;
  defaultUnfolded?: boolean;
}

export const PROJECTS: Project[] = [spinozaEthics, simGuitar, cardGame, seaIceDrift,
    cutDefiRoadef2018, ctuSolver, lineFollow, drone, gmt, satExplo, cvweb];
