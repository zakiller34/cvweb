# Update Deployment Guide

## Quick Reference

| Change Type | Commands |
|-------------|----------|
| Code only | `git pull && docker compose up -d --build` |
| DB schema | `git pull && backup DB && docker compose up -d --build` |
| Env vars | Edit `.env` then `docker compose up -d` |

> Migrations run automatically on container startup — no manual `prisma migrate deploy` needed.

---

## Environment Variables Reference

All vars the app expects (check `.env.example` for latest):

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | yes | SQLite path (`file:/app/data/prod.db` in Docker) |
| `AUTH_SECRET` | yes | NextAuth JWT secret |
| `AUTH_URL` | yes | App base URL for auth callbacks |
| `NEXT_PUBLIC_APP_URL` | yes | App URL for CORS headers |
| `ADMIN_EMAIL` | yes | Admin login email (seed script) |
| `ADMIN_PASSWORD` | yes | Admin login password (seed script) |
| `RESEND_API_KEY` | yes | Resend email API key |
| `NOTIFICATION_EMAIL` | yes | Email to receive contact notifications |
| `SENDER_EMAIL` | yes | From address for notification emails |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | yes | reCAPTCHA v3 site key |
| `RECAPTCHA_SECRET_KEY` | yes | reCAPTCHA v3 secret key |
| `LOG_LEVEL` | no | Pino log level (default: `info`) |

---

## Code Changes Only (No DB)

```bash
cd ~/cvweb
git pull
docker compose up -d --build
```

Verify:
```bash
docker compose ps
curl http://localhost:3000/api/health
```

## Database Schema Changes

When `prisma/schema.prisma` has changed:

```bash
cd ~/cvweb
git pull

# Backup DB first
cp data/prod.db data/prod.db.backup.$(date +%Y%m%d)

# Rebuild — migrations auto-run on startup
docker compose up -d --build
```

Verify migration applied:
```bash
docker compose exec cvweb npx prisma migrate status
```

## Environment Variable Changes

```bash
nano .env
# Make changes, save

# Restart to pick up new env
docker compose up -d
```

After changing env vars, verify health:
```bash
curl http://localhost:3000/api/health
```

Or check via admin dashboard health widget at `/admin`.

## Rollback Procedures

### Rollback Code

```bash
# Find previous commit
git log --oneline -5

# Revert to specific commit
git checkout <commit-hash>
docker compose up -d --build
```

### Rollback Database

```bash
# Stop app
docker compose down

# Restore backup
cp data/prod.db.backup.YYYYMMDD data/prod.db

# Start app
docker compose up -d
```

### Rollback Both

```bash
docker compose down
git checkout <commit-hash>
cp data/prod.db.backup.YYYYMMDD data/prod.db
docker compose up -d --build
```

## Zero-Downtime Tips

For minimal downtime:

```bash
# Build new image first (slow part)
docker compose build

# Then quick restart
docker compose up -d
```

## Check Deployment Status

```bash
# Container status + health
docker compose ps

# Live logs
docker compose logs -f

# Health check (all 4 checks should be true)
curl https://yourdomain.com/api/health

# Admin dashboard has health widget + analytics
# Visit https://yourdomain.com/admin
```

## Analytics Data

Analytics tracks page views and security events (failed logins, rate limits, reCAPTCHA fails). Data auto-retained for 90 days.

- View at `/admin/analytics`
- Manual purge via "Purge Old Data" button
- DB tables: `SecurityEvent`, `PageView`

On schema updates that include analytics migrations, existing data is preserved — backup DB as usual before updating.

## Common Issues

**Container won't start:**
```bash
docker compose logs cvweb
```

**Migration fails on startup:**
```bash
# Check migration status
docker compose exec cvweb npx prisma migrate status

# Check logs for error details
docker compose logs cvweb | head -20
```

**Old version still showing:**
```bash
# Force rebuild without cache
docker compose build --no-cache
docker compose up -d
```

**Health check shows degraded:**
```bash
# Check which service is down
curl http://localhost:3000/api/health | jq .

# Common fixes:
# - resendKey false → check RESEND_API_KEY in .env
# - senderEmail false → check SENDER_EMAIL in .env
# - recaptcha false → check both RECAPTCHA keys in .env
# - db false → check DATABASE_URL, volume mount, file permissions
```

**Admin locked out:**
```bash
# Re-seed admin user with current ADMIN_EMAIL/ADMIN_PASSWORD from .env
docker compose exec cvweb npx tsx scripts/seed.ts
```
