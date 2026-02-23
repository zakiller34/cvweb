export const dynamic = "force-static";

import { EXPERIENCES, INTERNSHIPS, SKILLS, EDUCATION, LANGUAGES_SPOKEN, ABOUT_TEXT, COMPETENCIES } from "@/lib/cv-data";
import { PROJECTS } from "@/lib/portfolio-data";
import { SITE_CONFIG } from "@/lib/site-config";

export function GET() {
  const data = {
    name: SITE_CONFIG.name,
    title: SITE_CONFIG.title.en,
    location: SITE_CONFIG.location,
    summary: ABOUT_TEXT.en,
    social: {
      github: SITE_CONFIG.social.github,
      linkedin: SITE_CONFIG.social.linkedin,
      website: "https://www.zakaria-teffah.com",
    },
    competencies: COMPETENCIES.en.map((c) => ({
      label: c.label,
      description: c.description,
    })),
    skills: SKILLS.map((s) => ({
      name: s.name,
      category: s.category,
      level: s.level,
    })),
    experience: EXPERIENCES.en.map((e) => ({
      company: e.company,
      role: e.role,
      period: e.period,
      location: e.location,
      description: e.description,
      technologies: e.technologies,
    })),
    internships: INTERNSHIPS.en.map((i) => ({
      company: i.company,
      role: i.role,
      period: i.period,
      description: i.description,
    })),
    education: EDUCATION.en.map((e) => ({
      school: e.school,
      degree: e.degree,
      field: e.field,
      period: e.period,
      description: e.description,
    })),
    languages: LANGUAGES_SPOKEN.en,
    projects: PROJECTS.map((p) => ({
      title: p.title.en,
      description: p.description.en,
      tags: p.tags,
      category: p.category.en,
      github: p.github,
    })),
  };

  return Response.json(data);
}
