---
title: Claire — injection-molding AI agent
summary: OSPHIM's injection-molding AI agent. Ask about any job and Claire explains its problems, anomalies and experiment results from real production data, and says so when the data has gaps.
year: "2026"
role: Full-stack AI engineer
client: OSPHIM · AI
tags: [AI, Industrial, Backend]
stack: [Python, FastAPI, SQLAlchemy, Claude (Anthropic), Agent harness, Tool calling]
art: agents
order: 0
featured: true
nda: true
---

## The problem

A molding job leaves data everywhere: experiments, machine settings, quality checks, shift notes, recurring problems. Engineers know the answer is in there somewhere. Finding it means clicking through five screens and asking whoever was on shift.

## What Claire does

Claire is an injection-molding AI agent that sits on top of that data. You ask in plain language and it answers from the actual records, not from vibes.

- **Explain any job.** Its problems, anomalies and experiment results, in one answer.
- **Follow a job across its life.** Experiment → setup → validation → production, so you can see how a decision early on shows up later.
- **Quality and settings views.** What changed, and what happened to quality when it did.
- **Shift handovers.** Pulls in what operators reported at handover, so context doesn't disappear between shifts.
- **Problem catalogue.** Links what's happening now to known problems and how they were fixed before.

## How it's built

Claire runs on an **agent harness**: the model never touches the database directly. It gets a set of tools — find a job, fetch its chain, read its settings and quality data, look up handovers and the problem catalogue — and the harness decides what it can call, validates the results and keeps everything scoped to the right tenant.

The service is **Python + FastAPI**, with **SQLAlchemy** as the data layer the tools read through. It runs on Anthropic's Claude models (Sonnet), with the harness choosing the model per task.

## Honest by design

The rule that shaped everything: **if the data isn't there, Claire says so.** No smoothing over missing measurements, no guessing a value that sounds right. On a factory floor a confident wrong answer is worse than "I don't have that."

## Scope on purpose

Trends, OEE and weekly summaries are deliberately out of scope for now. Doing a few questions really well beats doing everything a bit.

## What's next

Reading real production chat transcripts to find bugs, inconsistent answers and the features customers keep asking for. That loop will likely become its own pipeline.
