---
title: Voice shift-handover pipeline
summary: Operators talk, the system listens. Speech-to-text plus LLM extraction turns a rambling handover into structured, searchable shift data.
year: "2025"
role: Full-stack engineer
client: OSPHIM · AI
tags: [AI, Industrial, Backend]
stack: [FastAPI, Python, Speech-to-text, LLM extraction]
art: voice
order: 2
featured: true
nda: true
---

## The problem

Shift handovers are where knowledge goes to die. People talk fast, nobody writes it down properly, and the next shift starts half-blind.

## The approach

1. Operator records a voice handover.
2. Speech-to-text produces a transcript.
3. An LLM extraction step pulls out structured fields — machine, issue, action taken, open points.
4. The result lands in the system as data, linked to the right entities.

```json
{ "machine": "IMM-07", "issue": "short shot", "action": "raise hold pressure" }
```

## Notes

The interesting part isn't the model, it's the schema you extract into and how you handle low-confidence output. *(Replace with the real details.)*
