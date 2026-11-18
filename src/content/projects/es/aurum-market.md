---
title: Aurum Market, búsqueda semántica de catálogo
summary: Motor de descubrimiento sobre 15.000 productos en español con Qdrant y embeddings E5. Hace búsqueda por intención y detecta altas duplicadas, sin ningún LLM en tiempo de ejecución.
repo: Victorh1397/Actividad_BBDD_Vectorial
areas: [vector]
stack: [Qdrant, multilingual-e5-base, NumPy, Python, uv, Docker, pytest]
year: 2026
order: 3
context: Bases de datos vectoriales · Máster en IA, Cloud Computing y DevOps (Pontia)
metrics:
  - value: '0,92'
    label: MRR@10, el primer acierto casi siempre en primera posición
  - value: '1,0'
    label: fidelidad del índice ANN frente a la búsqueda exacta
  - value: 59 ms
    label: latencia p50 en CPU
  - value: '379'
    label: tests automáticos
---

## Problema

Un catálogo de 15.000 referencias en español plantea dos problemas de negocio. El primero es encontrar productos
por **intención** ("algo para regalar a un ciclista") y no solo por palabras exactas, a veces dentro de una marca
concreta. El segundo es impedir que se den de alta **productos duplicados**. Los dos se resuelven con una única base vectorial.

## Enfoque

- **Embeddings** `intfloat/multilingual-e5-base` (768 dimensiones) en CPU, con caché por modelo, rol y digest del
  texto. La primera ingesta tarda unos 13 minutos; las siguientes, alrededor de 1.
- **Qdrant** como motor, con parámetros HNSW explícitos (`m=24`, `ef_construct=120`, `ef_search=256`). El filtro por
  marca se resuelve dentro de la consulta.
- Un **oráculo exacto en NumPy** con la misma interfaz que Qdrant, para medir si el índice aproximado pierde
  candidatos o no.
- Una matriz de experimentos (E0–E3) para elegir qué texto de cada producto se convierte en vector.
- Un **umbral de duplicados** calibrado sobre el conjunto de desarrollo y **congelado** antes de aplicarlo al
  conjunto ciego.
- Una CLI (`aurum doctor`, `ingest`, `evaluate`, `deliver`…) que regenera todos los artefactos con un solo comando.

Lo desarrollé con *Spec Driven Development*: 29 requisitos, 8 ADR con las alternativas descartadas, y ningún
requisito se cierra sin una evidencia ejecutable.

## Resultados

| Métrica | Valor |
|---|---|
| nDCG@10 | 0,5422 |
| Recall@10 | 0,2481, sobre un techo de 0,5188 (el 48 % de lo alcanzable) |
| MRR@10 | 0,9167 |
| Fidelidad ANN | 1,0000 |
| Latencia p50 / p95 | 59 / 85 ms |
| Duplicados P / R / F1 | 1,0 / 1,0 / 1,0 en desarrollo, con umbral 0,9191 |
| Consultas filtradas por marca | 10/10, sin intrusos |

## Qué aprendí

Una métrica sin contexto engaña. Con unos 25 productos relevantes por consulta y solo 10 posiciones, ningún sistema
puede superar un Recall@10 de 0,5188, así que un 0,25 parece un fracaso hasta que se compara con ese techo.

Que la fidelidad del índice sea 1,0 tiene una consecuencia fuerte: **todo el error está en la representación, no en
el índice**, y eso se demuestra con un análisis de atribución en vez de suponerse.

Y un detalle que cuesta encontrar: el umbral de indexación de Qdrant se mide en **kilobytes por segmento**, no en
número de vectores. Con los valores por defecto, Qdrant responde por fuerza bruta sin avisar y cualquier medida de
fidelidad sale trivialmente perfecta.
