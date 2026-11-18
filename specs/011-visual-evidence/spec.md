# 011 — Visual evidence (diagramas, capturas y foto)

- **Estado:** done
- **Fecha:** 2026-11-18
- **Depende de:** 002, 004, 006

## Contexto

Victor considera que el sitio es demasiado textual. Se acordó añadir **imágenes que funcionen como evidencia**:
diagramas de arquitectura, capturas reales y, más adelante, gráficos de resultados. Además, una foto suya en la home.
Siguen fuera las imágenes decorativas y los logos de tecnologías (constitution P2).

Decisiones de Victor (2026-11-18):
- Tenerife no tendrá capturas. Victor no ejecutará la app.
- Hay permiso del equipo de Economicon para usar las capturas de `docs/evidence/` de su repositorio.

## Requisitos

- **R1.** Cada caso de estudio PUEDE declarar un diagrama de arquitectura en su frontmatter, y EL SISTEMA DEBE renderizarlo en la página de detalle.
- **R2.** Los diagramas DEBEN usar los tokens del sitio (colores, tipografía), funcionar en claro y oscuro y estar traducidos.
- **R3.** MIENTRAS el ancho sea menor de 900 px, EL SISTEMA DEBE apilar los pasos del diagrama en vertical, sin scroll horizontal.
- **R4.** Los diagramas DEBEN ser accesibles: listas ordenadas semánticas dentro de un `<figure>` con `<figcaption>`.
- **R5.** Cada caso de estudio PUEDE declarar figuras (capturas) con `alt` y pie de foto obligatorios, y EL SISTEMA DEBE servirlas optimizadas (AVIF/WebP, tamaños responsivos, carga diferida).
- **R6.** SI existe una foto en `src/assets/profile/`, ENTONCES la home DEBE mostrarla junto a la presentación; si no existe, la home queda como hoy.
- **R7.** El JavaScript total no cambia: diagramas, figuras y foto son HTML y CSS.

### Fuera de alcance (fase 2)

- Gráficos de resultados (benchmark de cancelaciones, métricas de Aurum). Se harán en una spec propia, aplicando la guía de visualización de datos.
- Capturas de Tenerife.

## Diseño

**Diagramas como datos, no como imágenes.** El frontmatter declara `diagram: { caption, lanes[] }`. Cada *lane* es un
flujo horizontal (por ejemplo "En cada turno" y "Fuera de línea") con *steps* encadenados por flechas. Cada step tiene
una etiqueta opcional y uno o más *nodes* (`title`, `detail`, `accent`). `src/components/Flow.astro` lo renderiza con
CSS grid: en horizontal en escritorio y en vertical en móvil, con las flechas como pseudo-elementos. Solo un nodo por
diagrama lleva `accent`: la pieza central del sistema.

- Se descarta SVG dibujado a mano: no se adapta al móvil sin duplicar el dibujo, y traducirlo es más costoso.
- Se descarta pegar los PNG de los repos: tienen estilos heterogéneos y no tienen modo oscuro.

**Figuras.** `figures: [{ src, alt, caption }]` en el frontmatter, usando el helper `image()` del schema. Los
archivos viven en `src/assets/projects/<slug>/`, compartidos por los dos idiomas. Se renderizan con `<Image>` de
`astro:assets` al final del cuerpo del caso de estudio.

**Foto.** `import.meta.glob('/src/assets/profile/photo.*')`: si hay foto, el hero pasa a dos columnas (texto y retrato
4:5). En móvil, el retrato va entre el titular y la presentación. Carga `eager` con `fetchpriority="high"`, porque es
candidata a LCP.

**Constitution:** P2 se amplía con la regla "imágenes como evidencia".

**Material:**

| Proyecto | Diagrama | Figuras |
|---|---|---|
| Economicon | Interfaz → API → cola y procesado → datos, ingesta de costes, observabilidad | Panel de anomalías y asistente explicando una anomalía (repo del equipo, con permiso) |
| Vicky | Canales → Dialogflow → webhook → FAISS → Gemini, más la línea offline de OCR | Documento ficticio "Tarifario de consultas" que lee el OCR |
| Aurum Market | Ingesta → representación → almacén, más consulta y evaluación | — |
| Tenerife | Ingesta en el notebook, más el bucle de tool calling en la app | — |
| Cancelaciones | Datos → limpieza y fugas → feature sets, más benchmark → finalistas → Optuna → API | — (gráfico en fase 2) |

**Archivos afectados:** `specs/000-constitution.md`, `src/content.config.ts`, `src/components/Flow.astro`,
`src/views/{ProjectView,HomeView}.astro`, `src/content/projects/**`, `src/assets/projects/**`, `src/i18n/ui.ts`.

## Tareas

- [x] T1 Ampliar la constitution P2 con "imágenes como evidencia" (R5)
- [x] T2 Schema: `diagram` y `figures` con `image()` (R1, R5)
- [x] T3 `Flow.astro` responsivo y accesible (R2, R3, R4, R7)
- [x] T4 Diagramas ES/EN de los 5 proyectos (R1, R2)
- [x] T5 Figuras de Economicon y Vicky, recortadas y optimizadas (R5)
- [x] T6 Foto opcional en la home (R6)
- [x] T7 Victor aporta la foto en `src/assets/profile/photo.jpg` (R6)

## Verificación

- [x] Los 5 detalles muestran su diagrama, en claro y en oscuro.
- [x] A 360 px, los diagramas se apilan y no hay scroll horizontal.
- [x] Las figuras se sirven como WebP con `srcset` y `loading="lazy"`.
- [x] Sin foto, la home se ve igual que antes. Con una foto de prueba, aparece en las dos columnas y en móvil.
- [x] `npm run check` y `npm run build` sin errores. El JS total no aumenta.

## Hallazgos
- Astro genera WebP por defecto, no AVIF. Es suficiente: las capturas pesan entre 40 y 120 KB por tamaño.
- Tenerife tiene diagrama (lo dibujé yo, a partir del código) pero no capturas, como pidió Victor. Si prefiere
  dejarlo sin ninguna imagen, basta con borrar el bloque `diagram` de sus dos Markdown.
- Las etiquetas de los pasos quedaban a distinta altura cuando las columnas tenían distinto número de nodos.
  Se resolvió con la etiqueta arriba, los nodos centrados con `margin-block: auto` y la flecha anclada a los nodos.
- La foto se probó con un retrato de prueba generado (degradado gris), que se borró después de la verificación.
- La foto real (800×800, sin EXIF) se añadió el 2026-11-18. El recorte 4:5 deja la cara completa. Una versión de 1000 px o más se vería más nítida en pantallas retina.
