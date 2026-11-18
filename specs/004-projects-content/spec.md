# 004 — Projects content

- **Estado:** in-progress
- **Fecha:** 2026-11-18
- **Depende de:** 003

## Contexto

Cada proyecto se presenta como un caso de estudio corto, escrito a partir del README de su repositorio.
El contenido es curado: GitHub solo aporta metadatos (spec 005).

Proyectos iniciales:

| Slug | Repo | Contexto |
|---|---|---|
| `economicon` | `EconomiconFinOps/tfm-economicon` | Trabajo Fin de Máster, en equipo |
| `vicky` | `Victorh1397/Chat-Grupo-Medico-Visoria` | Herramientas de IA Clásica, con Lucia Mateo |
| `aurum-market` | `Victorh1397/Actividad_BBDD_Vectorial` | Módulo de bases de datos vectoriales |
| `tenerife-rag` | `Victorh1397/Entrega_Final_LLM` | Módulo de Large Language Models |
| `hotel-cancellations` | `Victorh1397/proyecto-final-ml` | Módulo de Machine Learning, con Alejandro Aguado |

## Requisitos

- **R1.** EL SISTEMA DEBE validar el frontmatter de cada proyecto con un schema estricto y fallar el build si algo no cumple.
- **R2.** EL SISTEMA DEBE tener cada proyecto en español y en inglés con el mismo slug.
- **R3.** SI un proyecto existe en un idioma y no en el otro, ENTONCES el build DEBE fallar con un mensaje que nombre el slug.
- **R4.** Cada caso de estudio DEBE seguir la estructura Problema → Enfoque → Resultados → Qué aprendí.
- **R5.** Cada caso de estudio DEBE incluir solo métricas que aparezcan en el repositorio, y dejar claro el trabajo en equipo cuando lo hubo.

### Fuera de alcance

- Capturas de pantalla e imágenes de portada. El schema admite `cover`, pero la v1 es solo tipográfica.

## Diseño

Frontmatter:

```yaml
title: string
summary: string              # 1–2 frases, se muestra en el índice
repo: owner/name
areas: [llm | rag | vector | voice | ml | platform]   # alimenta el filtro
stack: string[]
year: number
order: number                # posición en el índice (1 = primero)
context: string              # p. ej. "Trabajo Fin de Máster"
team?: string                # p. ej. "Con Lucia Mateo"
demo?: url
metrics?: [{ value, label }] # máx. 4, cifras del repo
```

- Se usan `areas` en lugar de una sola `category`: con 5 proyectos, filtrar por categoría única deja una fila por
  filtro. Las áreas se solapan (RAG aparece en 3 proyectos) y el filtro sí tiene sentido.
- La comprobación de R3 vive en `src/lib/projects.ts` y se ejecuta al generar las rutas.

**Archivos afectados:** `src/content.config.ts`, `src/lib/projects.ts`, `src/content/projects/{es,en}/*.md`.

## Tareas

- [x] T1 Schema Zod en `content.config.ts` (R1)
- [x] T2 `lib/projects.ts`: carga por idioma, orden y comprobación de paridad (R2, R3)
- [x] T3 Borradores ES de los 5 casos de estudio a partir de los README (R4, R5)
- [x] T4 Traducción EN de los 5 casos (R2)
- [ ] T5 **Revisión de Victor**: confirmar su rol en cada proyecto, sobre todo en `economicon`, y validar las cifras (R5)

## Verificación

- [x] `npm run check` valida el contenido.
- [x] Renombrar temporalmente `en/vicky.md` hace fallar el build con un mensaje que nombra `vicky`.
- [ ] Victor ha leído y aprobado los 10 textos.

## Hallazgos
- Los valores numéricos con punto de miles en YAML (`119.390`) se interpretan como decimales: hay que escribirlos entre comillas.
- `economicon`: el README no detalla qué partes hizo Victor. El texto habla del proyecto en conjunto hasta que él lo precise.
