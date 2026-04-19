# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A modern static blogging platform replacing a Writefreely blog (eamonn.org). Consists of:
- **Public site**: Astro + Tailwind CSS, fully static, deployed to GitHub Pages
- **Private editor**: React SPA embedded at `/editor`, talks directly to the GitHub REST API (no backend)

The original blog content lives in the sibling directory `../scriobh/writefreely-main/writefreely.db` (SQLite).

## Commands

```bash
# Install dependencies
npm install

# Dev server (public site)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Run migration script (Python, one-time)
python3 scripts/migrate.py
```

## Architecture

### Directory Layout

```
src/
  content/
    blog/          # Markdown posts (output of migration script)
  pages/
    index.astro    # Home page — card grid
    blog/
      [slug].astro # Individual post pages
    editor.astro   # Wrapper page for the React editor SPA
  components/
    editor/        # React SPA components (Auth, Dashboard, Editor)
scripts/
  migrate.py       # One-time Writefreely → Markdown migration
```

### Public Site

- Content Collections: `src/content/blog/` with a Zod schema that includes optional `coverImage` (string URL).
- Frontmatter fields: `title`, `slug`, `date`, `excerpt`, `coverImage` (optional).
- Home page renders a responsive card grid; cards show `coverImage` if present, otherwise a CSS gradient placeholder derived from the post slug.
- `@tailwindcss/typography` used on post pages; Shiki for syntax highlighting; dark/light toggle in the site header.

### React Editor SPA (`/editor`)

- Loaded via `client:only="react"` — never runs during Astro's static build (avoids `localStorage`/`window` crashes).
- Three states: **Auth** (prompt for GitHub PAT, username, repo, stored in `localStorage`), **Dashboard** (list posts via GitHub API), **Editor** (raw Markdown `<textarea>` + frontmatter fields).
- Publish flow: PUT to GitHub Contents API. To update an existing file, first GET its `sha`, then include it in the PUT body.
- Unicode-safe Base64: use `TextEncoder` + manual base64 encoding (not `btoa()`) to handle emojis and multibyte characters.

### GitHub API Integration

All API calls use native `fetch` with the PAT in the `Authorization: token <PAT>` header. Target path for posts: `src/content/blog/<slug>.md`.

## Key Technical Constraints

- **Static output only**: `output: 'static'` in `astro.config.mjs`. No server-side rendering.
- **No backend**: The editor communicates directly with the GitHub API from the browser.
- **Slug preservation**: Migration must preserve exact Writefreely slugs so existing eamonn.org URLs do not break.
- **btoa() is unsafe**: Always use Unicode-safe encoding when base64-encoding file content for the GitHub API.
- **File update requires sha**: Always fetch the current file's `sha` before attempting to update it via the GitHub API.

## Data Source

Original blog: SQLite database at `../scriobh/writefreely-main/writefreely.db`.  
Relevant tables: `posts` (content, slug, title, created timestamp) and `collections` (blog identity).  
Migration script extracts posts, finds the first image URL in each post's Markdown content, and writes `.md` files with YAML frontmatter to `src/content/blog/`.
