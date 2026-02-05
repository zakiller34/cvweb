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


# TODO
  Setup required:
  1. Create Upstash Redis at https://upstash.com
  2. Create reCAPTCHA v3 at https://www.google.com/recaptcha/admin
  3. Add to .env:
  UPSTASH_REDIS_REST_URL=
  UPSTASH_REDIS_REST_TOKEN=
  NEXT_PUBLIC_RECAPTCHA_SITE_KEY=
  RECAPTCHA_SECRET_KEY=


# How it works:
  1. Middleware sets csrf_token cookie (HttpOnly=false, SameSite=Strict) on first /admin visit
  2. Client reads cookie via useCsrf() hook
  3. Client sends token in X-CSRF-Token header
  4. Server compares cookie vs header, returns 403 if mismatch
