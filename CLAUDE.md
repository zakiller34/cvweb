# Project: CV curriculum vitae and contact

This code is for building a web application that shows my CV and people can contact me by sending someting in the main page.
A portfolio page is also in a different new page.

## framework
- Next.js
- App Router

## Code Style

- TypeScript strict mode, no `any` types
- Use named exports, not default exports (except Next.js pages/layouts/error boundaries which require default exports)
- CSS: Tailwind utility classes, no custom CSS files

## Commands

- `npm run dev`: Start development server (port 3000)
- `npm run lint`: ESLint check

## Architecture

- `/app`: Next.js App Router pages and layouts
- `/components/ui`: Reusable UI components
- `/lib`: Utilities and shared logic
- `/app/api`: API routes

## Important Notes

- NEVER commit .env files
- Don't write 500-line components (break them up!)
- Quote paths with parentheses in bash (e.g. `"app/(main)/page.tsx"`) to avoid shell syntax errors
- NEVER use `rm -rf` — use `trash` instead
