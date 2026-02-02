---
"cvweb": minor
---

Add admin panel with authentication, contact form database storage, and CV toggle

- Add Prisma + SQLite database with Message, Setting, User models
- Add NextAuth.js v5 authentication with credentials provider
- Add admin panel at /admin with dashboard, messages, and settings pages
- Add CV download toggle controlled from admin settings
- Add contact form saves to database + sends email via Resend
- Add better-sqlite3 adapter for Prisma 7 compatibility
