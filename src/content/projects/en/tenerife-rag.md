---
title: Tenerife travel assistant
summary: A chat over a PDF travel guide. It retrieves with ChromaDB, answers with GPT-4.1-mini and tool calling while citing its source, and ships as a Streamlit app built on a reusable Python package.
repo: Victorh1397/Entrega_Final_LLM
areas: [llm, rag, vector]
stack: [OpenAI API, ChromaDB, Streamlit, PyPDF, jsonschema, Python]
year: 2026
order: 4
context: Large Language Models · MSc in AI, Cloud Computing and DevOps (Pontia)
---

## Problem

Answer questions about tourism in Tenerife using only a PDF guide, so that the assistant cites where each fact comes
from and says explicitly when the guide doesn’t cover something.

## Approach

The project goes through three stages, each built on the previous one:

1. **Exploration notebook**: PDF extraction, overlapping *chunking*, `text-embedding-3-small` embeddings and a
   ChromaDB collection persisted to disk.
2. **`tenerife_rag` package**: the notebook logic refactored into modules (`config`, `vector_store`, `tools`,
   `tool_loop`) that can be imported and tested on their own.
3. **Streamlit app**: a multi-turn chat that reuses the package and the already-persisted database, with no
   re-ingestion of the PDF.

**Tool calling instead of an agent framework.** The assistant only needs two capabilities:
`search_tenerife_info` (guide search) and `get_weather` (simulated weather). A custom loop capped at 5 rounds, with
arguments validated against JSON Schema (`strict: true`) and a log of every execution, gives more control, lower
latency and simpler debugging than adding LangChain or AutoGen.

Also: `temperature` 0.2 to stay close to the context, history capped at 10 turns, input validation (1,000
characters max) and output sanitising that strips technical logs while keeping source attribution.

## Results

- Answers grounded in the guide, each with its attribution (`Source: TENERIFE.pdf (chunk N, score S)`), and an
  explicit refusal when the fact isn’t there.
- Correct tool selection depending on the question.
- Coherent multi-turn conversation: it resolves references like "and what can I eat there?" after talking about Mount Teide.
- Argument errors caught without interrupting the session.

## What I learned

Sometimes the best agent architecture is not having one. For two tools and a narrow domain, an explicit tool-calling
loop is more predictable and cheaper. And while a notebook proves something works, only a package with clear
boundaries makes it reusable.

A formal evaluation (RAGAS or an LLM judge) that puts numbers on faithfulness and relevance is still pending, and
is documented as a limitation.
