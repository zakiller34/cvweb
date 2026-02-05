# Security Backlog

## Completed
- [x] HTML injection in email
- [x] Default credentials in seed
- [x] .env.example created
- [x] Settings key validation
- [x] PATCH type validation

## Deferred (user decision)

### Rate Limiting
- Add `@upstash/ratelimit` or in-memory limiter
- Consider CAPTCHA for contact form

### CSRF Protection
- Add CSRF tokens for /api/contact
- NextAuth handles auth routes
