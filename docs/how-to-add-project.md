# How to Add a Project to the Portfolio

## 1. Create the project folder

```
lib/projects/{slug}/
  index.ts
  detail.en.md
  detail.fr.md
  summary.png        # thumbnail shown in project card
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

## 3. Add `summary.png`

Place a `summary.png` (roughly square, ~400px) in the project folder. This is displayed as a thumbnail on the project card.

## 4. Create `index.ts`

```ts
import type { Project } from "@/lib/portfolio-data";
import detailEn from "./detail.en.md";
import detailFr from "./detail.fr.md";
import summaryImg from "./summary.png";

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
  thumbnail: summaryImg,
  tags: ["TypeScript", "React"],
  github: "https://github.com/you/my-project",
  category: {
    en: "Web",
    fr: "Web",
  },
  defaultUnfolded: true,
};
```

## 5. Register in `lib/portfolio-data.ts`

```ts
import { myProject } from "./projects/my-project";

export const PROJECTS: Project[] = [/* existing */, myProject];
```

Projects display in array order. Put the most important ones first.
Projects with the same `category` (matching both `en` and `fr`) are grouped under a collapsible section. The category name is displayed in the user's selected language.
Categories start unfolded by default. A category starts folded only if **all** its projects have `defaultUnfolded: false`.

## 6. Images

Store project images in `public/projects/{slug}/`. Use markdown image syntax:

```md
![Description](/projects/my-project/figure.png)
*Fig. 1 — Caption.*
```

## 7. Update the `llms` files

`public/llms.txt` and `public/llms-full.txt` are hand-maintained and do **not**
derive from `PROJECTS`. Add the project to both, in the same position it has in
the `PROJECTS` array. Skipping this is silent — nothing fails, the files just
go stale.

`public/llms.txt` — one line under `## Portfolio Projects`:

```
- {title.en}: https://www.zakaria-teffah.com/portfolio?project={slug}
```

`public/llms-full.txt` — one block under `## Portfolio Projects`, values copied
verbatim from `index.ts`:

```
### {title.en}
{description.en}
**Tags**: {tags, comma-separated}
**Category**: {category.en}
**GitHub**: {github}
**Details**: https://www.zakaria-teffah.com/portfolio?project={slug}
```

No action needed for `/api/cv.json` — `app/api/cv/route.ts` maps over `PROJECTS`,
so it picks the project up automatically. Same for `out/llms*.txt`, which
`scripts/github-export.sh` regenerates from `public/`.

## Type Reference

```ts
export interface Project {
  slug: string;
  title: { en: string; fr: string };
  description: { en: string; fr: string };
  detail: { en: string; fr: string };
  tags: string[];
  github: string;
  category: { en: string; fr: string };
  thumbnail?: StaticImageData;
  defaultUnfolded?: boolean; // defaults to false
}
```
