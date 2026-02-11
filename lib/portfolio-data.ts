import { cvweb } from "./projects/cvweb";
import { satExplo } from "./projects/sat-explo";

export interface Project {
  slug: string;
  title: { en: string; fr: string };
  description: { en: string; fr: string };
  detail: { en: string; fr: string };
  tags: string[];
  github: string;
}

export const PROJECTS: Project[] = [cvweb, satExplo];
