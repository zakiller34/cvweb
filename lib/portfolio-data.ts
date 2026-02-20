import { cvweb } from "./projects/cvweb";
import { cutDefiRoadef2018 } from "./projects/cut-defi-roadef-2018";
import { seaIceDrift } from "./projects/sea-ice-drift";
import { satExplo } from "./projects/sat-explo";
import { simGuitar } from "./projects/sim-guitar";
import { lineFollow } from "./projects/line-follow";
import { gmt } from "./projects/gmt";
import { cardGame } from "./projects/card-game";

export interface Project {
  slug: string;
  title: { en: string; fr: string };
  description: { en: string; fr: string };
  detail: { en: string; fr: string };
  tags: string[];
  github: string;
  category: { en: string; fr: string };
  defaultUnfolded?: boolean;
}

export const PROJECTS: Project[] = [seaIceDrift, satExplo, simGuitar, cardGame, cutDefiRoadef2018, lineFollow, gmt, cvweb];
