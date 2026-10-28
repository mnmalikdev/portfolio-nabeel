---
title: Industrial monitoring + agent layer
summary: Backend and infra for real-time multimodal monitoring, with a multi-agent LLM layer on top. Observability and IaC from day one.
year: "2026"
role: Backend & infra
client: Platform · R&D
tags: [AI, Infra, Backend]
stack: [FastAPI, PostgreSQL, AWS, Terraform, OpenTelemetry, Agents]
art: agents
order: 4
featured: true
---

## What it is

A platform for real-time, multimodal industrial monitoring, with autonomous LLM agents that can reason over the incoming data.

## Architecture

- **Ingestion & API:** FastAPI services over PostgreSQL.
- **Infra:** AWS, fully defined in Terraform.
- **Observability:** OpenTelemetry from the first commit, not bolted on later.
- **Agents:** a multi-agent layer that queries the system through tools rather than raw database access.

*(Work in progress — update as it evolves.)*
