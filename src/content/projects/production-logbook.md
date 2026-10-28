---
title: Real-time production logbook
summary: Redesigned a single-asset log into a cross-entity, contextual schema — machines, molds, materials and shifts all linked, updating live.
year: "2025"
role: Full-stack engineer
client: OSPHIM
tags: [Industrial, Backend, Data modelling]
stack: [NestJS, WebSockets, PostgreSQL, Drizzle, SvelteKit]
art: log
order: 1
featured: true
nda: true
---

## The problem

The original logbook was tied to a single asset. On a real shop floor, that's not how problems happen: a defect involves a **machine**, a **mold**, a **material batch** and a **shift**, all at once. Engineers were stitching that context together by hand.

## The approach

- Remodelled the schema around entries that can reference any combination of entities, instead of hanging off one asset.
- Event-driven updates so the logbook reflects what's happening on the floor as it happens.
- A UI that lets you start from any entity and see everything connected to it.

## What I learned

Getting the data model right up front saved more time than any amount of clever frontend work. *(Edit this file — `src/content/projects/production-logbook.md` — to tell the real story.)*
