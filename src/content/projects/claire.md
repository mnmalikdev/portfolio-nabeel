---
title: Claire — injection-molding AI agent
summary: OSPHIM's AI production assistant for the plastics industry. Shop-floor teams ask in plain language and Claire answers from live process data and documented production knowledge. Live for all OSPHIM customers.
year: "2026"
role: Full-stack AI engineer
client: OSPHIM · AI
tags: [AI, Industrial, Backend]
stack: [Python, FastAPI, SQLAlchemy, Claude (Anthropic), Agent harness, Tool calling]
art: agents
order: 0
featured: true
nda: true
links:
  live: https://www.osphim.com/news/hello-claire-ki-basierten-fertigungsassistenten
---

## The problem

In a molding shop the answer to "what went wrong?" is spread across machine data, process curves, shift logs, documented anomalies and the heads of experienced people. During a stoppage, someone has to stitch that together by hand, under pressure.

## What Claire does

Claire is an injection-molding AI agent on the OSPHIM platform. People just ask:

> *"What happened on machine 12?"* · *"Anything unusual this shift?"* · *"Why did it stop?"*

Claire pulls the relevant data and knowledge together, answers, and lets you dig deeper with follow-up questions.

- **Explain any job.** Its problems, anomalies and experiment results in one answer.
- **Follow a job across its life.** Experiment → setup → validation → production, plus quality and settings views.
- **Downtime and root causes.** Why a machine stopped and what changed before it did.
- **Shift handovers.** What operators reported, so context survives the shift change.
- **Problem catalogue.** Spots recurring process problems and how they were fixed before.
- **Compare runs and pick machines.** Compare production runs, or find which machines suit a given mold.

## How it's built

A **Python + FastAPI** service with **SQLAlchemy** as the data layer, running on Anthropic's Claude models (Sonnet).

The core is an **agent harness**: the model never touches the database directly. It gets a set of tools to find jobs, walk their chain, read settings, quality and handover data, and query the problem catalogue. The harness controls what can be called, validates results and keeps every query scoped to the right tenant.

## Honest by design

The rule that shaped everything: **if the data isn't there, Claire says so.** No smoothing over missing measurements, no plausible-sounding guesses. On a factory floor a confident wrong answer is worse than "I don't have that."

## Outcome

- In production with customers, and rolled out to every OSPHIM customer in 2026.
- Shown live at **Fakuma 2026** and recognised at the **Best of Technology Award**.
- Trends, OEE and weekly summaries are deliberately out of scope for now. A few questions done really well beat everything done halfway.

## What's next

Reading real production chat transcripts across tenants to find bugs, inconsistent answers and the features customers keep asking for. That feedback loop will likely become its own pipeline.
