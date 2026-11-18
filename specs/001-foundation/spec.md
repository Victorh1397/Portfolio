# 001 — Foundation

- **Estado:** done
- **Fecha:** 2026-11-18
- **Depende de:** 000

## Contexto

Partimos de una carpeta vacía. Hace falta el esqueleto del proyecto, la metodología versionada y unos comandos
estables, para que todas las specs siguientes se apoyen en la misma base.

## Requisitos

- **R1.** EL SISTEMA DEBE construirse con Astro 7 en modo estático y TypeScript estricto.
- **R2.** EL SISTEMA DEBE exponer los scripts `dev`, `build`, `preview` y `check`.
- **R3.** EL SISTEMA DEBE versionarse con git en la rama `main`, ignorando `node_modules`, `dist`, `.astro` y los ficheros `.env*`.
- **R4.** EL SISTEMA DEBE incluir la metodología: `CLAUDE.md`, `specs/README.md`, la plantilla y la constitution.
- **R5.** EL SISTEMA DEBE fijar la versión mínima de Node en `package.json` y en `.nvmrc`, para que Cloudflare use la misma.

### Fuera de alcance

- Tests automatizados de UI. Para un sitio estático de este tamaño basta con `astro check` y el build.

## Diseño

- Scaffold manual (sin `npm create astro`) para no arrastrar ficheros de ejemplo.
- `tsconfig.json` extiende `astro/tsconfigs/strict`.
- TypeScript 6, porque `@astrojs/check` todavía no admite TypeScript 7.

**Archivos afectados:** `package.json`, `astro.config.mjs`, `tsconfig.json`, `.gitignore`, `.nvmrc`, `CLAUDE.md`, `specs/**`.

## Tareas

- [x] T1 `git init` en `main` y `.gitignore` (R3)
- [x] T2 `package.json` con scripts y dependencias, `.nvmrc` (R1, R2, R5)
- [x] T3 `astro.config.mjs` y `tsconfig.json` estricto (R1)
- [x] T4 `CLAUDE.md`, `specs/README.md`, plantilla y constitution (R4)

## Verificación

- [x] `npm run check` termina sin errores.
- [x] `npm run build` genera `dist/`.
- [x] `git status` no muestra `node_modules`, `dist` ni `.astro`.

## Hallazgos

- En la fecha de inicio la versión estable de Astro es la 7.x (el plan inicial decía 5). Se usa la 7.
