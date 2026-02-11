# How to Add a Project to the Portfolio

## 1. Create the project folder

```
lib/projects/{slug}/
  index.ts
  detail.en.md
  detail.fr.md
```

`slug` must be URL-safe (lowercase, hyphens).

## 2. Write markdown detail files

`detail.en.md` and `detail.fr.md` contain the full project description in Markdown (GFM). Supported features:

- Headings (`##`, `###`)
- **Bold** and *italic*
- Bullet and numbered lists
- Tables (GitHub-Flavored Markdown)
- Horizontal rules (`---`)
- Inline code and code blocks
- Images: `![caption](/projects/slug/image.png)`

## 3. Create `index.ts`

```ts
import type { Project } from "@/lib/portfolio-data";
import detailEn from "./detail.en.md";
import detailFr from "./detail.fr.md";

export const myProject: Project = {
  slug: "my-project",
  title: {
    en: "My Project",
    fr: "Mon Projet",
  },
  description: {
    en: "Short one-liner shown in the project list.",
    fr: "Courte description affichée dans la liste.",
  },
  detail: {
    en: detailEn,
    fr: detailFr,
  },
  tags: ["TypeScript", "React"],
  github: "https://github.com/you/my-project",
};
```

## 4. Register in `lib/portfolio-data.ts`

```ts
import { myProject } from "./projects/my-project";

export const PROJECTS: Project[] = [/* existing */, myProject];
```

Projects display in array order. Put the most important ones first.

## 5. Images

Store project images in `public/projects/{slug}/`. Use markdown image syntax:

```md
![Description](/projects/my-project/figure.png)
*Fig. 1 — Caption.*
```

## Type Reference

```ts
export interface Project {
  slug: string;
  title: { en: string; fr: string };
  description: { en: string; fr: string };
  detail: { en: string; fr: string };
  tags: string[];
  github: string;
}
```
