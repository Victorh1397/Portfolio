---
title: Aurum Market, semantic catalogue search
summary: A product discovery engine over 15,000 Spanish-language products, built on Qdrant and E5 embeddings. It searches by intent and catches duplicate listings, with no LLM at runtime.
repo: Victorh1397/Actividad_BBDD_Vectorial
areas: [vector]
stack: [Qdrant, multilingual-e5-base, NumPy, Python, uv, Docker, pytest]
year: 2026
order: 3
context: Vector Databases · MSc in AI, Cloud Computing and DevOps (Pontia)
metrics:
  - value: '0.92'
    label: MRR@10, the first hit almost always comes first
  - value: '1.0'
    label: ANN index fidelity against exact search
  - value: 59 ms
    label: p50 latency on CPU
  - value: '379'
    label: automated tests
---

## Problem

A catalogue of 15,000 Spanish-language products raises two business problems. The first is finding products by
**intent** ("a gift for a cyclist") rather than exact keywords, sometimes within a specific brand. The second is
preventing **duplicate products** from being listed. Both are solved with a single vector database.

## Approach

- **Embeddings** with `intfloat/multilingual-e5-base` (768 dimensions) on CPU, cached by model, role and text digest.
  The first ingestion takes about 13 minutes; later runs take around 1.
- **Qdrant** as the engine, with explicit HNSW parameters (`m=24`, `ef_construct=120`, `ef_search=256`). The brand
  filter is applied inside the query.
- An **exact NumPy oracle** with the same interface as Qdrant, to measure whether the approximate index drops candidates.
- An experiment matrix (E0–E3) to choose which text of each product becomes the vector.
- A **duplicate threshold** calibrated on the development set and **frozen** before being applied to the blind set.
- A CLI (`aurum doctor`, `ingest`, `evaluate`, `deliver`…) that regenerates every deliverable with one command.

I built it with *Spec Driven Development*: 29 requirements, 8 ADRs recording the rejected alternatives, and no
requirement closed without executable evidence.

## Results

| Metric | Value |
|---|---|
| nDCG@10 | 0.5422 |
| Recall@10 | 0.2481, against a ceiling of 0.5188 (48 % of what is achievable) |
| MRR@10 | 0.9167 |
| ANN fidelity | 1.0000 |
| p50 / p95 latency | 59 / 85 ms |
| Duplicates P / R / F1 | 1.0 / 1.0 / 1.0 on dev, threshold 0.9191 |
| Brand-filtered queries | 10/10, no intruders |

## What I learned

A metric without context is misleading. With around 25 relevant products per query and only 10 slots, no system
can exceed a Recall@10 of 0.5188, so 0.25 looks like a failure until you compare it with that ceiling.

An index fidelity of 1.0 has a strong implication: **all the error comes from the representation, not the index**,
and that is proven with an attribution analysis rather than assumed.

And a detail that is hard to find: Qdrant’s indexing threshold is measured in **kilobytes per segment**, not in
number of vectors. With the defaults, Qdrant silently falls back to brute force and any fidelity measurement comes
out trivially perfect.
