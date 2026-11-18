# 008 — SEO and analytics

- **Estado:** done
- **Fecha:** 2026-11-18
- **Depende de:** 006, 007

## Contexto

El sitio tiene que verse bien cuando se comparte en LinkedIn o Slack, ser indexable y permitir saber si recibe visitas,
sin cookies ni banner de consentimiento.

## Requisitos

- **R1.** Cada página DEBE tener un `title` y una `meta description` propios, con URL canónica absoluta.
- **R2.** Cada página DEBE incluir etiquetas Open Graph y Twitter Card, con una imagen de 1200×630.
- **R3.** EL SISTEMA DEBE generar `sitemap-index.xml` con las alternativas de idioma y un `robots.txt` que lo referencie.
- **R4.** EL SISTEMA DEBE servir cabeceras de seguridad (`X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`) y caché inmutable para `/_astro/*`.
- **R5.** SI existe `PUBLIC_CF_ANALYTICS_TOKEN` en el build, ENTONCES EL SISTEMA DEBE incluir el beacon de Cloudflare Web Analytics. Si no existe, no incluye nada.
- **R6.** El detalle de proyecto DEBE incluir datos estructurados JSON-LD (`SoftwareSourceCode`) y la home `Person`.

### Fuera de alcance

- Imágenes OG por proyecto generadas dinámicamente. Basta con una imagen OG por idioma.

## Diseño

- `site` en `astro.config.mjs` se lee de `SITE_URL`, con `https://victor-mendez.pages.dev` por defecto.
- `@astrojs/sitemap` con la opción `i18n`. `robots.txt` como endpoint estático (`src/pages/robots.txt.ts`), para usar `site`.
- La imagen OG se genera una vez con un script (`scripts/og.mjs`, sharp desde SVG) y se versiona en `public/og/`.
- `public/_headers` para Cloudflare Pages.
- Analytics: hay dos opciones equivalentes, y el beacon solo se incluye en la segunda.
  1. Activar Web Analytics desde el panel del proyecto de Pages: Cloudflare inyecta el script solo.
  2. Definir `PUBLIC_CF_ANALYTICS_TOKEN` en las variables de build.

**Archivos afectados:** `src/layouts/Base.astro`, `astro.config.mjs`, `src/pages/robots.txt.ts`, `public/_headers`, `public/og/*`, `scripts/og.mjs`.

## Tareas

- [x] T1 Meta, canonical, OG y Twitter en `Base.astro` (R1, R2)
- [x] T2 Imágenes OG ES/EN (R2)
- [x] T3 Sitemap con i18n y `robots.txt` (R3)
- [x] T4 `_headers` (R4)
- [x] T5 Beacon condicional de Web Analytics (R5)
- [x] T6 JSON-LD (R6)

## Verificación

- [x] `dist/sitemap-index.xml` y `dist/robots.txt` existen y usan el dominio correcto.
- [x] Sin la variable, `grep cloudflareinsights dist -r` no encuentra nada; con ella, aparece en todas las páginas.
- [ ] Tras el deploy, el inspector de LinkedIn (Post Inspector) muestra título, descripción e imagen.

## Hallazgos
- Astro inserta inline los scripts pequeños (tema y filtro): no hay ficheros `.js` en `dist/`, y el JS total es de unos 1,1 KB.
- `scripts/og.mjs` usa `sharp`, que llega como dependencia de Astro. Se ejecuta con `npm run og`.
