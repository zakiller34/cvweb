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
    en: `## Overview

Full description in **Markdown** shown on the detail page.

- Supports **bold**, *italic*, lists
- Headings (##, ###)
- Tables (GFM)
- Code snippets

| Column A | Column B |
|----------|----------|
| data     | data     |`,
    fr: `## Apercu

Same structure in French.`,
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
| `description` | Yes | `{ en, fr }` — short summary for the list view (plain text) |
| `detail` | Yes | `{ en, fr }` — **Markdown** content for the detail view |
| `tags` | Yes | String array of technologies/skills |
| `github` | Yes | GitHub repository URL |

## Markdown in `detail`

The detail field is rendered via `react-markdown` with GFM support. Use template literals (backtick strings) for multiline markdown. Supported features:

- Headings (`##`, `###`)
- **Bold** and *italic*
- Bullet and numbered lists
- Tables (GitHub-Flavored Markdown)
- Horizontal rules (`---`)
- Inline code and code blocks

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
