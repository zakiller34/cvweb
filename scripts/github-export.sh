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

# Environment variables for static build
export NEXT_PUBLIC_APP_URL="http://www.zakaria-teffah.com"
export NEXT_PUBLIC_OWNER_EMAIL="zakaria.teffah@gmail.com"
export NEXT_PUBLIC_OWNER_PHONE="+33 6 52 94 27 48"

# Feature flags
export SHOW_CONTACT_FORM=false
export SHOW_CV_DOWNLOAD=false
export SHOW_MAIL_TO_SIDEBAR=true
export SHOW_PORTFOLIO=true
export SHOW_SCHEDULE_MEETING=false
export SHOW_GIT_HUB=true
export SHOW_LINKED_IN=true

next build

# GitHub Pages needs .nojekyll to serve _next/ dirs
touch "$ROOT/out/.nojekyll"

# CNAME for custom domain
echo "www.zakaria-teffah.com" > "$ROOT/out/CNAME"

echo ""
echo "Static export ready in out/"
echo "Serve locally: npx serve out"
