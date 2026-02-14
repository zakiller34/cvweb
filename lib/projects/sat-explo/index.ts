import type { Project } from "@/lib/portfolio-data";
import detailEn from "./detail.en.md";
import detailFr from "./detail.fr.md";

export const satExplo: Project = {
  slug: "sat-explo",
  title: {
    en: "Space Altimetry and Continental Hydrology",
    fr: "Altimétrie Spatiale et Hydrologie Continentale",
  },
  description: {
    en: "Multi-level satellite altimetry pipeline: Kalman filtering, kriging, waveform retracking, and multi-mission fusion with Dask.",
    fr: "Multi-level satellite altimetry pipeline: Kalman filtering, kriging, waveform retracking, and multi-mission fusion with Dask.",
  },
  detail: {
    en: detailEn,
    fr: detailFr,
  },
  tags: ["Python", "Kriging", "Kalman Filter", "SAR", "Satellite Altimetry"],
  github: "https://github.com/zakiller34/sat-explo",
  category: { en: "Remote sensing", fr: "Télédétection" },
};
