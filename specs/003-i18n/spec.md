# 003 — i18n (ES / EN)

- **Estado:** done
- **Fecha:** 2026-11-18
- **Depende de:** 002

## Contexto

El público son reclutadores y equipos técnicos de habla hispana e inglesa. Español es el idioma por defecto.

## Requisitos

- **R1.** EL SISTEMA DEBE servir español en la raíz (`/`, `/proyectos/<slug>/`, `/sobre-mi/`) e inglés bajo `/en/` (`/en/`, `/en/projects/<slug>/`, `/en/about/`).
- **R2.** CUANDO el usuario use el selector de idioma, EL SISTEMA DEBE llevarlo a la página equivalente en el otro idioma.
- **R3.** EL SISTEMA DEBE declarar `lang` en `<html>` y enlaces `<link rel="alternate" hreflang>` para ambos idiomas y `x-default`.
- **R4.** EL SISTEMA DEBE obtener todos los textos de interfaz de un único diccionario tipado.
- **R5.** SI falta una clave en inglés, ENTONCES `astro check` DEBE fallar (el diccionario inglés está tipado contra el español).

### Fuera de alcance

- Detección automática del idioma del navegador con redirección. Penaliza el SEO y molesta. Basta con el selector.

## Diseño

- Config de i18n de Astro: `defaultLocale: 'es'`, `locales: ['es', 'en']`, `prefixDefaultLocale: false`.
- `src/i18n/ui.ts`: `const es = {...} as const` y `const en: Record<keyof typeof es, string>`, más el helper `useTranslations(lang)`.
- `src/i18n/routes.ts`: funciones que generan la URL de cada página por idioma (`home`, `about`, `project(slug)`).
  Cada vista calcula sus `alternates` y se los pasa al layout, que los usa para el selector y para `hreflang`.
- Las páginas reales viven en `src/views/*View.astro` y reciben `lang`. `src/pages/` solo contiene envoltorios de 3 o 4 líneas.

**Archivos afectados:** `astro.config.mjs`, `src/i18n/*`, `src/components/LangSwitch.astro`, `src/views/*`, `src/pages/**`.

## Tareas

- [x] T1 Config de i18n en `astro.config.mjs` (R1)
- [x] T2 `ui.ts` con el diccionario tipado y `routes.ts` (R4, R5)
- [x] T3 `LangSwitch.astro` usando `alternates` (R2)
- [x] T4 `hreflang` y `lang` en `Base.astro` (R3)
- [x] T5 Envoltorios de página ES y EN (R1)

## Verificación

- [x] Desde `/proyectos/vicky/`, el selector lleva a `/en/projects/vicky/` y viceversa.
- [x] El HTML generado de cada página contiene `hreflang="es"`, `hreflang="en"` y `x-default`.
- [x] Borrar una clave del diccionario inglés hace fallar `npm run check`.

## Hallazgos
