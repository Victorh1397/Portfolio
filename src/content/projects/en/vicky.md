---
title: Vicky, a voice assistant for a clinic
summary: Books medical appointments and answers patients’ questions out loud. Built on Dialogflow, a FastAPI webhook and Gemini over OCR-processed documents, and it doesn’t make things up when it doesn’t know.
repo: Victorh1397/Chat-Grupo-Medico-Visoria
areas: [voice, llm, rag, vector]
stack: [Dialogflow ES, FastAPI, Gemini, FAISS, OCR, SSML, Telegram, Python]
year: 2026
order: 2
context: Classical AI Tools · MSc in AI, Cloud Computing and DevOps (Pontia)
team: With Lucia Mateo
demo: https://www.loom.com/share/c8feadcc5a224d9badd42c9ce93e4c14
metrics:
  - value: 9/9
    label: unanswerable questions handled without hallucinating
  - value: 18/18
    label: correct answers with vector retrieval
  - value: 2.1 s
    label: median turn time in a spoken conversation
  - value: '313'
    label: automated tests
diagram:
  caption: A spoken turn makes a single round trip. OCR and the index are prepared beforehand, offline.
  lanes:
    - label: On every turn
      steps:
        - label: Channels
          nodes:
            - title: Voice
              detail: microphone, ends on silence
            - title: Telegram
              detail: messages and buttons
        - label: Dialogue
          nodes:
            - title: Dialogflow ES
              detail: native STT and TTS, 13 intents
        - label: Rules
          nodes:
            - title: FastAPI webhook
              detail: ID regex, scheduling, SSML
              accent: true
        - label: Retrieval
          nodes:
            - title: FAISS
              detail: passages closest to the question
        - label: Answer
          nodes:
            - title: Gemini
              detail: documents only, or NO_DISPONIBLE
    - label: Offline, once
      offline: true
      steps:
        - nodes:
            - title: Documents D1–D5
              detail: scanned JPGs, fictional
        - nodes:
            - title: Tesseract OCR
              detail: Spanish, with preprocessing
        - nodes:
            - title: Regex
              detail: price and schedule validation
        - nodes:
            - title: Index
              detail: passages and embeddings, loaded at startup
figures:
  - src: ../../../assets/projects/vicky/tarifario.jpg
    alt: Fictional scanned document "Tarifario de consultas" (consultation fees) from Grupo Médico Visoria, with a table of specialties, doctors and prices in US dollars.
    caption: One of the five fictional documents the pipeline reads with OCR. Vicky answers only from what they contain.
---

## Problem

The front desk at a clinic, Grupo Médico Visoria (six specialties, twelve doctors), handles two kinds of phone
calls: booking an appointment and asking common questions about prices, opening hours, insurance or directions.
Vicky handles both **by voice**. In a healthcare setting, a made-up answer is worse than no answer. All clinic,
doctor and patient data is fictional.

## Approach

A spoken request makes a single round trip:

1. The voice client records until it detects silence and sends the audio to Dialogflow, which transcribes it and classifies the intent.
2. A **FastAPI webhook** applies the clinic’s rules: it validates the national ID with a two-level regex, respects
   each doctor’s real schedule, recognises returning patients and offers them the same doctor.
3. For common questions, the webhook retrieves the closest passages of five clinic documents (OCR’d beforehand)
   from a **FAISS** index and sends only those passages to **Gemini**.
4. The answer comes back as SSML and Dialogflow speaks it.

OCR and indexing run once, offline, and never inside a request.

**Three layers of hallucination control:** strict instructions (documents only, no medical advice, and the
question is treated as data, never as instructions), a `NO_DISPONIBLE` signal the model returns when the fact
isn’t there and the webhook turns into a standard reply, and a safety net that catches refusals the model writes
in its own words.

It also works in Telegram with buttons, and lets patients check their history, cancel an appointment, correct one
field without repeating the rest and ask for a human.

## Results

- **17/18** correct answers with the real Gemini in the document evaluation, and **9/9** unanswerable questions
  declined without inventing anything, including manipulation attempts ("ignore your instructions…") and requests for medical advice.
- With vector retrieval: **18/18 and 9/9**, with a median of 1.00 s per answer.
- Over the real voice channel, turns of 1.85 to 3.24 s. In a 10-turn reference conversation: median of 2.1 s,
  with no turn above 5 s.
- OCR with 99.8 % average similarity; 12/12 prices and 12/12 schedules validated.
- 313 automated tests, offline, and a clean `ruff` run.

## What I learned

Measure before assuming. Vector retrieval didn’t improve accuracy over sending the full text (both reached 18/18)
and added about 0.26 s of median latency. Its value lies in scaling to more documents, not at this volume.

I also learned that defensive rules can break correct answers. The first version of the safety net looked for
refusals anywhere in the answer and discarded valid sentences like "if your insurance isn’t listed, you can claim
a refund". Limiting the check to the first sentence fixed it.
