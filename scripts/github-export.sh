#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CONFIG="$ROOT/next.config.ts"
BACKUP="$ROOT/next.config.ts.bak"
GITHUB_CONFIG="$ROOT/next.config.github.ts"

# Swap config
cp "$CONFIG" "$BACKUP"
cp "$GITHUB_CONFIG" "$CONFIG"

restore() { mv "$BACKUP" "$CONFIG"; }
trap restore EXIT

next build

# GitHub Pages needs .nojekyll to serve _next/ dirs
touch "$ROOT/out/.nojekyll"

# Copy pre-rendered API route body to static JSON (API routes don't export)
mkdir -p "$ROOT/out/api"
cp "$ROOT/.next/server/app/api/cv.body" "$ROOT/out/api/cv.json"

# CNAME for custom domain
echo "www.zakaria-teffah.com" > "$ROOT/out/CNAME"

echo ""
echo "Static export ready in out/"
echo "Serve locally: npx serve out"
