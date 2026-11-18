---
title: Economicon, a FinOps assistant
summary: A multi-tenant assistant that ingests Azure costs and answers natural-language questions using semantic retrieval scoped to each customer. My master’s thesis, built as a team.
repo: EconomiconFinOps/tfm-economicon
areas: [platform, rag, llm]
stack: [React, FastAPI, RabbitMQ, CockroachDB, Postgres + pgvector, LiteLLM, Turborepo, Docker Compose]
year: 2026
order: 1
context: Master’s thesis · MSc in AI, Cloud Computing and DevOps (Pontia)
team: EconomiconFinOps team
---

## Problem

Anyone paying for cloud can see the bill, but answering something specific, like *which service spiked this month
and in which subscription*, means exporting data, joining it and understanding the provider’s cost model.
Economicon aims to answer those questions conversationally, with one non-negotiable rule: a customer must never see
another customer’s data.

## Approach

A Turborepo monorepo with four apps, each with a single responsibility:

- **frontend** (React + TanStack Query): the UI and the chat.
- **backend** (FastAPI): authentication, mandatory resolution of the active *tenant*, operational persistence in
  CockroachDB and vector context retrieval, **always scoped by tenant**.
- **processor**: consumes RabbitMQ jobs, generates embeddings and stores them in Postgres with pgvector.
- **azure-cost-api**: simulates the subset of the *Azure Cost Management Query* API used by the product, so the
  whole team can build and test without a real subscription.

Models are accessed through a LiteLLM gateway. In development and tests, explicit *mock* providers make it possible
to run the full stack without API keys.

Infrastructure was treated as part of the product: unprivileged containers with read-only filesystems, base images
pinned by digest, formal migrations for both databases, and GitHub Actions CI that checks governance, specs
(OpenSpec), tests and build on every pull request.

## Results

- Paginated, idempotent per-tenant cost ingestion from the simulated API.
- Chat with tenant-isolated semantic retrieval, in mock mode and with real AI through the gateway.
- A local *smoke test* covering the minimum end-to-end path: health of all four services, login, cost ingestion,
  cost summary and a job that travels through RabbitMQ to the processor.
- Architecture, ADRs, roadmap and evidence documented and versioned alongside the code.

Still pending, as the repository states: cloud deployment, advanced observability and an end-to-end validation of
the RAG flow with real embeddings and LLMs.

## What I learned

Tenant isolation has to be designed from the very first migration rather than bolted on later: `tenant_id` shapes
the schema, the vector queries and the tests. I also learned that teamwork on a monorepo only scales with explicit
rules: cards, short-lived branches, pull requests and a CI that nobody can skip.
