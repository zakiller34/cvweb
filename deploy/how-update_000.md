# Update Deployment Guide

## Quick Reference

| Change Type | Commands |
|-------------|----------|
| Code only | `git pull && docker compose up -d --build` |
| DB schema | `git pull && npx prisma migrate deploy && docker compose up -d --build` |
| Env vars | Edit `.env` then `docker compose up -d` |

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
curl -I http://localhost:3000
```

## Database Schema Changes

When `prisma/schema.prisma` has changed:

```bash
cd ~/cvweb
git pull

# Backup DB first
cp prod.db prod.db.backup.$(date +%Y%m%d)

# Run migrations
npx prisma migrate deploy

# Rebuild app
docker compose up -d --build
```

## Code + Database Changes

```bash
cd ~/cvweb
git pull

# Backup
cp prod.db prod.db.backup.$(date +%Y%m%d)

# Migrate then rebuild
npx prisma migrate deploy && docker compose up -d --build
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
cp prod.db.backup.YYYYMMDD prod.db

# Start app
docker compose up -d
```

### Rollback Both

```bash
docker compose down
git checkout <commit-hash>
cp prod.db.backup.YYYYMMDD prod.db
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

# Health check
curl -I https://yourdomain.com
```

## Common Issues

**Migration fails:**
```bash
# Check migration status
npx prisma migrate status

# Reset if needed (DESTROYS DATA)
npx prisma migrate reset
```

**Container won't start:**
```bash
docker compose logs app
# Check for errors
```

**Old version still showing:**
```bash
# Force rebuild without cache
docker compose build --no-cache
docker compose up -d
```
