# eamonn.org

A custom static blogging platform. The public site is built with Astro and Tailwind CSS and deployed to GitHub Pages. Posts are written in raw Markdown via a bespoke in-browser editor that commits directly to this repository via the GitHub API — no backend server required.

## Stack

- **Public site**: Astro 4, Tailwind CSS 3, `@tailwindcss/typography`, Shiki
- **Editor**: React 18 SPA at `/editor`, communicates with GitHub REST API
- **Hosting**: GitHub Pages (static, via Actions)

## Local development

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # production build → dist/
npm run preview    # preview production build locally
```

## Writing posts

Navigate to `/editor` in your browser (or `http://localhost:4321/editor` in dev).

On first visit, you'll be prompted for:

| Field | Value |
|-------|-------|
| **Personal Access Token** | A GitHub PAT with `Contents: read/write` scope |
| **GitHub Username** | Your GitHub username |
| **Repository** | `username/repo-name` |

Credentials are saved to `localStorage` and never leave your browser.

The editor lets you create and edit posts. Publishing commits the Markdown file directly to `src/content/blog/` in the repository, which triggers an automatic deployment.

## Adding posts manually

Drop a `.md` file into `src/content/blog/` with this frontmatter:

```yaml
---
title: "My Post Title"
date: 2024-01-15
excerpt: "Short description shown on the card grid and in meta tags."
coverImage: "https://example.com/image.jpg"   # optional
---

Post body in Markdown...
```

The filename (without `.md`) becomes the URL slug: `src/content/blog/my-post.md` → `eamonn.org/my-post`.

## Migrating from Writefreely

The one-time migration script reads the Writefreely SQLite database and outputs Markdown files:

```bash
python3 scripts/migrate.py
```

It expects the database at `../scriobh/writefreely-main/writefreely.db` relative to this repo. It:
- Preserves original slugs exactly (no URL breakage)
- Extracts the first image from each post as `coverImage`
- Absolutizes relative `img/` paths to `https://eamonn.org/img/`
- Generates a plain-text `excerpt` by stripping Markdown syntax

## Deploying to GitHub Pages

1. In your repository settings → **Pages**, set the source to **GitHub Actions**.
2. Push to `main`. The workflow in `.github/workflows/deploy.yml` builds and deploys automatically.

For a custom domain, add a `CNAME` file to `public/` containing your domain (e.g. `eamonn.org`), then configure DNS per GitHub's instructions.

## Design notes

- **Color palette**: Tailwind `zinc` throughout; `indigo` for accents.
- **Dark mode**: Class-based, toggled by the header button, persisted in `localStorage`. An inline `<script>` in `<head>` applies the class before first paint to prevent flash.
- **Card placeholders**: Posts without a `coverImage` get a deterministic CSS gradient derived from the slug (computed at build time, no runtime JS).
- **Syntax highlighting**: Shiki dual-theme (`github-light` / `github-dark`) set via CSS variables — no flicker on theme switch.
