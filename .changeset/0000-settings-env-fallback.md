---
"cvweb": patch
---

Add .env fallback for boolean settings when database is unavailable. Site renders in degraded mode using env defaults instead of crashing. Admin settings page shows warning when DB is down.
