# Update Deployment Guide

## Quick Reference

| Change Type | Commands |
|-------------|----------|
| Code only | `git pull && docker compose up -d --build` |
| Env vars | Edit `.env` then `docker compose up -d` |

---

## Environment Variables Reference

All vars the app expects (check `.env.example` for latest):

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_APP_URL` | yes | App URL for CORS headers |
| `RESEND_API_KEY` | yes | Resend email API key |
| `NOTIFICATION_EMAIL` | yes | Email to receive contact notifications |
| `SENDER_EMAIL` | yes | From address for notification emails |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | yes | reCAPTCHA v3 site key |
| `RECAPTCHA_SECRET_KEY` | yes | reCAPTCHA v3 secret key |
| `LOG_LEVEL` | no | Pino log level (default: `info`) |
| `SHOW_CV_DOWNLOAD` | no | Feature toggle (default: `false`) |
| `SHOW_CONTACT_FORM` | no | Feature toggle (default: `false`) |
| `SHOW_MAIL_TO_SIDEBAR` | no | Feature toggle (default: `false`) |
| `SHOW_PORTFOLIO` | no | Feature toggle (default: `false`) |
| `SHOW_SCHEDULE_MEETING` | no | Feature toggle (default: `false`) |
| `SHOW_GIT_HUB` | no | Feature toggle (default: `false`) |
| `SHOW_LINKED_IN` | no | Feature toggle (default: `false`) |

---

## Code Changes Only

```bash
cd ~/cvweb
git pull
docker compose up -d --build
```

Verify:
```bash
docker compose ps
curl http://localhost:3000
```

## Environment Variable Changes

```bash
nano .env
# Make changes, save

# Restart to pick up new env
docker compose up -d
```

## Rollback Code

```bash
# Find previous commit
git log --oneline -5

# Revert to specific commit
git checkout <commit-hash>
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
# Container status
docker compose ps

# Live logs
docker compose logs -f
```

## Common Issues

**Container won't start:**
```bash
docker compose logs cvweb
```

**Old version still showing:**
```bash
# Force rebuild without cache
docker compose build --no-cache
docker compose up -d
```
