import { cvweb } from "./projects/cvweb";
import { cutDefiRoadef2018 } from "./projects/cut-defi-roadef-2018";
import { seaIceDrift } from "./projects/sea-ice-drift";
import { satExplo } from "./projects/sat-explo";

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

export const PROJECTS: Project[] = [seaIceDrift, satExplo, cutDefiRoadef2018, cvweb];
