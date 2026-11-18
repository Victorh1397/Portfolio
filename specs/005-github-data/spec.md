# 005 — GitHub data

- **Estado:** done
- **Fecha:** 2026-11-18
- **Depende de:** 004

## Contexto

Mostrar el lenguaje principal y la fecha de la última actividad de cada repositorio aporta credibilidad
(el proyecto está vivo y es real) sin mantener esos datos a mano.

## Requisitos

- **R1.** CUANDO se construye el sitio, EL SISTEMA DEBE consultar `GET /repos/{owner}/{repo}` por cada proyecto.
- **R2.** EL SISTEMA DEBE mostrar el lenguaje principal y la fecha del último push, con el formato del idioma de la página.
- **R3.** SI existe la variable de entorno `GITHUB_TOKEN`, ENTONCES EL SISTEMA DEBE usarla para autenticarse.
- **R4.** SI la API falla, tarda más de 8 s o responde con error, ENTONCES EL SISTEMA DEBE terminar el build, omitir esos datos y avisar en el log.
- **R5.** EL SISTEMA DEBE hacer como mucho una petición por repositorio en cada build, aunque el dato se use en varias páginas.
- **R6.** EL SISTEMA NO DEBE mostrar estrellas ni forks (constitution P1).

### Fuera de alcance

- Refresco periódico. Los datos se actualizan con cada deploy.

## Diseño

- `src/lib/github.ts` exporta `getRepoMeta(repo)` y guarda en una caché a nivel de módulo un `Map<string, Promise<RepoMeta | null>>`.
- `fetch` con `AbortSignal.timeout(8000)` y la cabecera `User-Agent` genérica.
- El enlace al repositorio se construye desde el frontmatter, así que existe aunque la API falle.

**Archivos afectados:** `src/lib/github.ts`, `src/views/ProjectView.astro`, `src/views/HomeView.astro`.

## Tareas

- [x] T1 `github.ts` con caché, timeout, token opcional y fallback (R1, R3, R4, R5)
- [x] T2 Mostrar lenguaje y fecha en el detalle (R2, R6). El índice muestra solo el año del frontmatter, para no recargar la fila.

## Verificación

- [x] Build normal: el detalle muestra "Python" y la fecha.
- [x] `GITHUB_TOKEN=invalido npm run build`: el build termina, avisa en el log y la página omite esos datos.

## Hallazgos
