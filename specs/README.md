# Specs: cómo trabajamos

Desarrollo guiado por especificaciones, en versión ligera: Markdown en el repo, sin herramientas externas.

## Flujo

```
draft ──► approved ──► in-progress ──► done
  │           │              │
  │           │              └─ tareas marcadas [x], commit por tarea
  │           └─ requisitos y tareas aceptados por Victor
  └─ propuesta escrita desde _templates/spec.md
```

1. **Propuesta.** Copiar `_templates/spec.md` a `NNN-nombre/spec.md` (número siguiente, nombre en kebab-case). Estado `draft`.
2. **Requisitos.** Cada requisito tiene un ID (`R1`, `R2`…) y se escribe en formato EARS:
   - Ubicuo: `EL SISTEMA DEBE <respuesta>.`
   - Por evento: `CUANDO <evento>, EL SISTEMA DEBE <respuesta>.`
   - Por estado: `MIENTRAS <estado>, EL SISTEMA DEBE <respuesta>.`
   - No deseado: `SI <condición>, ENTONCES EL SISTEMA DEBE <respuesta>.`
3. **Diseño.** Decisiones técnicas, alternativas descartadas en una línea y archivos afectados.
4. **Tareas.** Checklist `- [ ] T1 descripción (R1, R2)`. Cada requisito debe estar cubierto por al menos una tarea.
   Cuando Victor lo aprueba, el estado pasa a `approved`.
5. **Implementación.** Estado `in-progress`. Una tarea a la vez; al terminarla se marca `[x]` y se hace commit
   (`feat(NNN): T3 …`). Si aparece algo no previsto, se anota en **Hallazgos** y, si cambia el alcance, se actualizan
   los requisitos antes de seguir.
6. **Verificación.** Se ejecuta lo que dice la sección. Solo entonces el estado pasa a `done`.

## Índice

| Spec | Estado |
|---|---|
| [000 Constitution](000-constitution.md) | vigente |
| [001 Foundation](001-foundation/spec.md) | done |
| [002 Design system](002-design-system/spec.md) | done |
| [003 i18n](003-i18n/spec.md) | done |
| [004 Projects content](004-projects-content/spec.md) | in-progress (revisión de Victor) |
| [005 GitHub data](005-github-data/spec.md) | done |
| [006 Home and detail](006-home-and-detail/spec.md) | done |
| [007 About and CV](007-about-cv/spec.md) | in-progress (revisión de la bio) |
| [008 SEO and analytics](008-seo-analytics/spec.md) | done |
| [009 Deploy](009-deploy/spec.md) | in-progress (falta conectar Cloudflare) |
| [010 Experience and web CV](010-experience-and-web-cv/spec.md) | done |
| [011 Visual evidence](011-visual-evidence/spec.md) | done |

## Cuándo NO hace falta spec

Erratas, ajustes de contenido de un proyecto existente y agregar un proyecto nuevo (ver `CLAUDE.md`).
Cualquier cambio de comportamiento, de diseño o una sección nueva (por ejemplo un blog) sí requiere spec.
