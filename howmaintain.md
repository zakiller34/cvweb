# Content Maintenance Guide

All content centralized in `lib/constants.ts` unless noted.

## CV/PDF Files

1. Replace files in `public/` (e.g., `CV_ZAKARIA_TEFFAH_EN.pdf`)
2. To add/remove languages, edit `SITE_CONFIG.cvFiles`:
   ```ts
   cvFiles: [
     { lang: "EN", path: "/CV_ZAKARIA_TEFFAH_EN.pdf" },
     { lang: "FR", path: "/CV_ZAKARIA_TEFFAH_FR.pdf" },
   ]
   ```

## Personal Info

Edit `SITE_CONFIG`:
- `name`, `title`, `location`, `email`, `phone`
- `description` - hero tagline
- `social.github`, `social.linkedin`

## Experience

Edit `EXPERIENCES` array. Each entry:
```ts
{
  company: "Company Name",
  logo: "/logos/company.svg",  // place logo in public/logos/
  role: "Your Role",
  period: "Start - End",
  location: "City, Country",
  description: "What you did...",
  technologies: ["Tech1", "Tech2"],
}
```

## Internships

Edit `INTERNSHIPS` array (same structure, no logo/technologies).

## Skills

Edit `SKILLS` array:
```ts
{ name: "Skill", category: "language|tool|platform|expertise|verification|hardware", level: "advanced|good" }
```

## Education

Edit `EDUCATION` array:
```ts
{ school: "...", degree: "...", field: "...", period: "...", description: "..." }
```

## Languages

Edit `LANGUAGES` array:
```ts
{ name: "French", level: "Native" }
```

## References

Edit `REFERENCES` array:
```ts
{ name: "...", role: "...", email: "...", phone: "..." }
```

## Interests

Edit `INTERESTS` array (strings).

## About Section

Edit `ABOUT_TEXT` string.

## Navigation

Edit `NAV_LINKS` to add/remove nav items.

## Stats (Hero)

Edit `STATS` array:
```ts
{ value: "14+", label: "Years Experience" }
```

## Profile Photo

Replace `public/profile.jpg`.

## Company Logos

Place SVG files in `public/logos/`, reference in `EXPERIENCES[].logo`.
