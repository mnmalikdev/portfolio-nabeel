# nabeel-malik-site

Portfolio + blog. SvelteKit 5, mdsvex, GSAP, Lenis. Fully prerendered: every page is static HTML at build time.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173 — drafts are visible here
npm run build    # production build
```

Deploy: push to GitHub → import the repo in Vercel (framework: SvelteKit). Output is fully static (adapter-static → `build/`).

`npm run build:preview` makes a hash-routed copy (`#/blog/`) that works from any folder or static host that can only serve `index.html`. Don't use it for the real site.

## Write a blog post

1. Copy `src/content/blog/_template.md` → `src/content/blog/my-post.md` (the filename becomes the URL: `/blog/my-post`).
2. Fill in the frontmatter, write Markdown below it.
3. `git push`. Done.

```md
---
title: Kafka for people who hate Kafka
date: 2026-11-01
excerpt: One sentence for the list, RSS and link previews.
tags: [Kafka, Backend]
draft: true        # only shows in `npm run dev` — remove to publish
---
```

Code blocks are highlighted at build time (Shiki). Images go in `static/images/` → `![alt](/images/x.jpg)`.
You can even use Svelte components inside posts (it's mdsvex).

## Add a project

Copy `src/content/projects/_template.md`. Key fields:

| field      | what it does |
|------------|--------------|
| `featured` | `true` → appears in the horizontal carousel on the home page |
| `order`    | sort order (lower first) |
| `art`      | generated cover: `log`, `voice`, `cavity`, `agents`, `gym`, `grid` |
| `cover`    | real image (`/images/foo.jpg`), overrides `art` |
| `tags`     | power the filter on `/projects` |
| `nda`      | shows "Under NDA" instead of links |

Files starting with `_` are ignored.

## Where things live

```
src/content/          ← all your writing (blog/, projects/)
src/lib/content.ts    ← loads + sorts content, site info (email, links)
src/lib/motion.ts     ← GSAP helpers: use:reveal, use:lines, use:chars, use:magnetic
src/lib/components/   ← Cursor, Loader, Nav, Marquee, Molten (hero canvas), ProjectArt, Contact
src/routes/           ← pages: /, /projects, /projects/[slug], /blog, /blog/[slug], /rss.xml
```

Respects `prefers-reduced-motion` (animations off, smooth scroll off).
