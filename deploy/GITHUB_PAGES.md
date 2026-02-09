# Deploying to GitHub Pages

## Build the static export

All env vars (contact info, feature flags) are set inside `scripts/github-export.sh`. Edit that file to change values.

```bash
npm run github-export
```

Output lands in `out/`. Preview locally:

```bash
npx serve out
```

## Deploy to GitHub Pages

### Option A: Manual upload (Deploy from branch)

1. Create a branch `gh-pages`
2. Copy contents of `out/` to the root of that branch
3. Push the branch
4. In repo **Settings → Pages → Build and deployment**:
   - Source: **Deploy from a branch**
   - Branch: `gh-pages` / `/ (root)`
5. Save — site will be live in ~1 minute

### Option B: GitHub Actions (recommended)

1. In repo **Settings → Pages → Build and deployment**:
   - Source: **GitHub Actions**

2. Create `.github/workflows/pages.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - name: Build static export
        run: npm run github-export
      - uses: actions/upload-pages-artifact@v3
        with:
          path: out

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

3. Push to `main` — the workflow triggers automatically.

## Custom domain

1. In repo **Settings → Pages → Custom domain**, enter your domain
2. Add DNS records at your registrar:

   **Apex domain (example.com):**
   ```
   A     @    185.199.108.153
   A     @    185.199.109.153
   A     @    185.199.110.153
   A     @    185.199.111.153
   ```

   **Subdomain (www.example.com):**
   ```
   CNAME www  <username>.github.io
   ```

3. Check **Enforce HTTPS** once DNS propagates (~10 min)

## Troubleshooting

- **Styles/assets missing**: ensure `.nojekyll` exists in `out/` (the export script creates it automatically)
- **404 on subpages**: GitHub Pages doesn't support client-side routing rewrites. Static export generates HTML files per route so direct navigation should work
- **Build fails**: check that `next.config.ts` was restored (the script uses a trap to restore on failure)
