# 010 — Experience and web CV

- **Estado:** done
- **Fecha:** 2026-11-18
- **Depende de:** 007

## Contexto

La trayectoria previa de Victor es un punto fuerte de su perfil: casi diez años en petróleo y gas (Halliburton, NOV),
fintech (Ugami), salud y agritech (Digisalud) e inteligencia de negocio (PengCorp). Hasta ahora la web no la mostraba.

Además, los CV en PDF incluían teléfono y dirección, que no deben publicarse. En vez de editar los PDF originales,
la experiencia pasa a vivir en **un único archivo de datos** del que salen la sección web y el CV en PDF.

Pedido explícito de Victor (2026-11-18):
- Los CV publicados no llevan teléfono ni dirección.
- El Máster de Pontia aparece en la web, pero **no** en el CV hasta recibir el título.
- Toda la trayectoria del CV aparece en la web.

## Requisitos

- **R1.** EL SISTEMA DEBE definir la experiencia, la formación, las habilidades y el resumen profesional en un único archivo de datos bilingüe.
- **R2.** La página "Sobre mí" DEBE mostrar la trayectoria completa (empresa, sector, ubicación, cargos, fechas y logros), la formación y las habilidades.
- **R3.** EL SISTEMA DEBE generar un CV en PDF por idioma a partir de esos datos, con un solo comando.
- **R4.** El CV generado NO DEBE incluir teléfono ni dirección postal. Solo lleva email, LinkedIn, GitHub y la URL del portfolio.
- **R5.** CUANDO una entrada de formación esté marcada como `inCv: false`, EL SISTEMA DEBE mostrarla en la web y omitirla en el CV.
- **R6.** El CV generado DEBE caber en una página A4.
- **R7.** La página imprimible del CV NO DEBE indexarse ni aparecer en el sitemap.

### Fuera de alcance

- Editar o redactar los PDF originales.
- Generar el PDF durante el build de Cloudflare: no hay Chrome disponible. Los PDF se generan en local y se versionan, igual que las imágenes OG.

## Diseño

- `src/data/cv.ts`: tipos y datos (`summary`, `skills`, `experience[]` con `roles[]`, `education[]` con `inCv`).
  Los textos vienen de los CV originales de Victor, en ES y EN.
- `src/components/Experience.astro`: lista editorial (años en mono, empresa en serif, sector, cargos y logros).
  Se usa en `AboutView`, debajo del texto libre de `about.md`.
- `src/pages/cv/[lang].astro` → `/cv/es/` y `/cv/en/`: el CV en HTML con estilos de impresión (A4), sin header ni footer,
  con `noindex`, y excluido del sitemap.
- `scripts/cv-pdf.mjs`: sirve `dist/` con un servidor estático mínimo en Node, imprime cada página con Chrome headless
  (`--print-to-pdf`) en `public/cv/victor-mendez-cv-{es,en}.pdf` y avisa si un PDF tiene más de una página.
  `npm run cv` = `astro build && node scripts/cv-pdf.mjs`. Después hay que volver a hacer el build para que `dist/` incluya los PDF nuevos.
- Ubicación: el CV y la web muestran solo la ciudad y el país, nunca la dirección.

**Archivos afectados:** `src/data/cv.ts`, `src/components/Experience.astro`, `src/views/{AboutView,CvView}.astro`,
`src/pages/cv/[lang].astro`, `src/content/pages/{es,en}/about.md`, `src/i18n/ui.ts`, `astro.config.mjs`,
`scripts/cv-pdf.mjs`, `package.json`, `public/cv/*.pdf`.

## Tareas

- [x] T1 `cv.ts` con los datos de los CV en ES y EN, más el máster con `inCv: false` (R1, R5)
- [x] T2 `Experience.astro` y las secciones de trayectoria, formación y habilidades en "Sobre mí" (R2)
- [x] T3 Página imprimible `/cv/{es,en}/` con `noindex` y fuera del sitemap (R4, R6, R7)
- [x] T4 `scripts/cv-pdf.mjs` y `npm run cv` (R3, R6)
- [x] T5 Generar los PDF y reemplazar los originales en `public/cv/` (R3, R4)
- [x] T6 Actualizar el resumen de "Sobre mí" y la presentación de la home con la trayectoria (R2)

## Verificación

- [x] El texto extraído de los PDF generados no contiene el teléfono ni la dirección.
- [x] Los PDF tienen 1 página.
- [x] "Pontia" aparece en `/sobre-mi/` y no aparece en el PDF.
- [x] `/cv/es/` lleva `noindex` y no figura en `sitemap-0.xml`.
- [x] `npm run check` y `npm run build` sin errores.

## Hallazgos
- La primera versión ocupaba 2 páginas. Se resolvió moviendo Habilidades detrás del Perfil (como en el CV original),
  acortando la etiqueta "Programación y herramientas" y llevando la ubicación a la línea del cargo, para que el
  contacto quepa en una línea sin un separador huérfano.
- En la columna de años de la web, "actualidad" no cabía: se usa `cv.presentShort` ("hoy" / "now").
- Los textos de "De dónde vengo" (`about.md`) los redactó Claude a partir del CV: Victor debe revisarlos (spec 007 T5).
