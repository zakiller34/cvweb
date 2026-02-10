# How to Add a Project to the Portfolio

## Edit `lib/portfolio-data.ts`

Add a new entry to the `PROJECTS` array:

```ts
{
  slug: "my-project",          // URL-safe identifier, must be unique
  title: {
    en: "My Project",
    fr: "Mon Projet",
  },
  description: {
    en: "Short one-liner shown in the project list.",
    fr: "Courte description affichee dans la liste.",
  },
  detail: {
    en: "Full description shown on the detail page. Can be multiple sentences.",
    fr: "Description complete affichee sur la page de detail.",
  },
  tags: ["TypeScript", "React"],  // Shown as badges
  github: "https://github.com/you/my-project",
},
```

## Fields

| Field | Required | Description |
|-------|----------|-------------|
| `slug` | Yes | Unique URL-safe ID (lowercase, hyphens) |
| `title` | Yes | `{ en, fr }` — project name |
| `description` | Yes | `{ en, fr }` — short summary for the list view |
| `detail` | Yes | `{ en, fr }` — full text for the detail view |
| `tags` | Yes | String array of technologies/skills |
| `github` | Yes | GitHub repository URL |

## Order

Projects display in array order. Put the most important ones first.

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
