# Project: CV curriculum vitae and contact

This code is for building a web application that shows my CV and people can contact me by sending someting in the main page.
A portfolio page is also in a different new page.

## framework
- Next.js
- App Router
- Prisma ORM
- SQLite

## Code Style

- TypeScript strict mode, no `any` types
- Use named exports, not default exports
- CSS: Tailwind utility classes, no custom CSS files

## Commands

- `npm run dev`: Start development server (port 3000)
- `npm run test`: Run Jest tests
- `npm run test:e2e`: Run Playwright end-to-end tests
- `npm run lint`: ESLint check
- `npm run db:migrate`: Run Prisma migrations

## Architecture

- `/app`: Next.js App Router pages and layouts
- `/components/ui`: Reusable UI components
- `/lib`: Utilities and shared logic
- `/prisma`: Database schema and migrations
- `/app/api`: API routes

## Important Notes

- NEVER commit .env files
- Don't write 500-line components (break them up!)
- Rate limiting is in-memory (resets on server restart, single-process only)
