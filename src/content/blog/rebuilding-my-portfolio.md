---
title: Rebuilding my portfolio, four years later
date: 2026-10-27
excerpt: The old site said "sleek web & mobile apps". The work changed, so the site had to as well — here's how the new one is put together.
tags: [SvelteKit, Meta]
---

My last portfolio was built when I graduated. It listed a Netflix UI clone. Time for an update.

## The stack

- **SvelteKit 5** with everything prerendered to static HTML.
- **mdsvex**, so every blog post and project is just a Markdown file.
- **GSAP + ScrollTrigger** for the motion, **Lenis** for smooth scrolling.
- **Shiki** for code highlighting at build time — zero JS shipped for it.

## Publishing a post

Writing a post is one file:

```md
---
title: My new post
date: 2026-11-01
excerpt: One line that shows up in the list.
tags: [Kafka]
---

Write here.
```

Then:

```bash
git add . && git commit -m "new post" && git push
```

Vercel picks it up and deploys. No CMS, no database, nothing to babysit.

## Why Markdown

> The best CMS is the one you don't have to maintain.

Posts live in git next to the code, so they're versioned, reviewable and portable forever.
