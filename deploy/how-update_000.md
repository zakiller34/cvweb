# Update Deployment Guide

## Quick Reference

| Change Type | Commands |
|-------------|----------|
| Code only | `git pull && docker compose up -d --build` |
| DB schema | `git pull && backup DB && docker compose up -d --build` |
| Env vars | Edit `.env` then `docker compose up -d` |

> Migrations run automatically on container startup — no manual `prisma migrate deploy` needed.

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

## Environment Variable Changes

```bash
nano .env
# Make changes, save

# Restart to pick up new env
docker compose up -d
```

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

# Health check
curl https://yourdomain.com/api/health
```

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
