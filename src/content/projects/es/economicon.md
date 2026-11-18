---
title: Economicon, asistente FinOps
summary: Asistente multi-tenant que ingiere costes de Azure y responde preguntas en lenguaje natural con recuperación semántica filtrada por cliente. Mi Trabajo Fin de Máster, hecho en equipo.
repo: EconomiconFinOps/tfm-economicon
areas: [platform, rag, llm]
stack: [React, FastAPI, RabbitMQ, CockroachDB, Postgres + pgvector, LiteLLM, Turborepo, Docker Compose]
year: 2026
order: 1
context: Trabajo Fin de Máster · Máster en IA, Cloud Computing y DevOps (Pontia)
team: Equipo EconomiconFinOps
---

## Problema

Quien paga una nube ve la factura, pero responder algo concreto, como *qué servicio se disparó este mes y en qué
suscripción*, exige exportar datos, cruzarlos y entender el modelo de costes del proveedor. Economicon busca que
esas preguntas se respondan conversando, y con una condición innegociable: un cliente nunca puede ver los datos de otro.

## Enfoque

Un monorepo con Turborepo y cuatro aplicaciones, cada una con una única responsabilidad:

- **frontend** (React + TanStack Query): la interfaz y el chat.
- **backend** (FastAPI): autenticación, resolución obligatoria del *tenant* activo, persistencia operativa en
  CockroachDB y recuperación de contexto vectorial, **siempre filtrada por tenant**.
- **processor**: consume trabajos de RabbitMQ, genera embeddings y los guarda en Postgres con pgvector.
- **azure-cost-api**: simula el subconjunto de la API *Azure Cost Management Query*. Así todo el equipo desarrolla
  y prueba sin depender de una suscripción real.

Los modelos se consumen a través de un gateway LiteLLM. En desarrollo y en los tests, unos proveedores *mock*
explícitos permiten levantar el stack completo sin claves de API.

La infraestructura se trató como parte del producto: contenedores sin privilegios con el sistema de archivos de
solo lectura, imágenes base fijadas por digest, migraciones formales para las dos bases de datos y una CI en
GitHub Actions que valida gobernanza, especificaciones (OpenSpec), pruebas y build en cada pull request.

## Resultados

- Ingesta paginada e idempotente de costes por tenant desde la API simulada.
- Chat con recuperación semántica aislada por tenant, en modo mock y con IA real a través del gateway.
- Un *smoke test* local que recorre el camino mínimo de punta a punta: salud de los cuatro servicios, login,
  ingesta de costes, resumen y un trabajo que viaja por RabbitMQ hasta el processor.
- Arquitectura, ADR, roadmap y evidencias documentados y versionados junto al código.

Pendiente, y así consta en el repositorio: despliegue en la nube, observabilidad avanzada y una validación de
punta a punta del flujo RAG con embeddings y LLM reales.

## Qué aprendí

Que el aislamiento entre clientes tiene que diseñarse desde la primera migración y no añadirse después: el
`tenant_id` condiciona el esquema, las consultas vectoriales y los tests. También, que trabajar en equipo sobre un
monorepo solo escala con reglas explícitas: tarjetas, ramas cortas, pull requests y una CI que no se puede saltar.
