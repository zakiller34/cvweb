---
"cvweb": minor
---

Add structured logging with Pino. All API routes now have try-catch error handling with structured JSON logs in production and pretty-printed logs in development. Added error boundaries for main and admin route groups. Server startup logged via instrumentation hook.
