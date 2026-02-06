# Security Backlog

## Completed
- [x] HTML injection in email
- [x] Default credentials in seed
- [x] .env.example created
- [x] Settings key validation
- [x] PATCH type validation
- [x] Rate limiting (@upstash/ratelimit on /api/contact + auth)
- [x] reCAPTCHA v3 on contact form
- [x] CSRF protection (double submit cookie on admin routes)



# How it works:
  1. Middleware sets csrf_token cookie (HttpOnly=false, SameSite=Strict) on first /admin visit
  2. Client reads cookie via useCsrf() hook
  3. Client sends token in X-CSRF-Token header
  4. Server compares cookie vs header, returns 403 if mismatch
