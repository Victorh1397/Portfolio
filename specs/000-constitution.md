# 000 — Constitution

Principios no negociables. Cuando dos decisiones chocan, se resuelve con este documento.
Cambiarlo requiere una spec propia.

## P1. El contenido manda

El sitio existe para que alguien entienda en menos de un minuto **qué construyó Victor, cómo y con qué resultado**.
Cada elemento visual tiene que ayudar a eso o desaparece.

- Las afirmaciones van con evidencia: métricas reales del repositorio, no adjetivos.
- No se muestran métricas de vanidad (estrellas, forks, seguidores).
- Los textos están en primera persona y son concretos. Prohibido: "unlocking the power of AI",
  "soluciones innovadoras", "apasionado por la tecnología", "aprovechando la IA" y similares.

## P2. Diseño editorial, no plantilla

- **Tipografía como protagonista:** Newsreader (serif de display) para los títulos, IBM Plex Sans para el texto
  e IBM Plex Mono para los metadatos. Todas autoalojadas.
- **Paleta:** neutros cálidos (papel y tinta) y **un único color de acento**. Todos los colores son tokens en
  `src/styles/tokens.css`.
- **Estructura:** índice numerado con filas separadas por líneas finas. No hay grids de tarjetas.
- **Imágenes como evidencia** (añadido en la spec 011): solo entran imágenes que demuestran algo, como diagramas de
  arquitectura, capturas reales, gráficos de resultados o el retrato de Victor. Cada una lleva `alt` y pie de foto.
  Los diagramas se generan con HTML y CSS a partir de datos, no como imágenes. Quedan fuera las imágenes de stock,
  las ilustraciones decorativas y las rejillas de logos de tecnologías. El índice de la home sigue siendo solo texto.
- **Prohibido:** gradientes decorativos, glassmorphism, blobs, glow, sombras difusas grandes, emojis decorativos,
  iconos genéricos de IA (cerebros, chispas, robots), contadores animados, animaciones al hacer scroll,
  cursores personalizados, texto con efecto máquina de escribir.
- **Movimiento:** solo transiciones de hover/focus y view transitions entre páginas, siempre desactivadas con
  `prefers-reduced-motion: reduce`.

## P3. Rendimiento

- Sitio 100 % estático. JavaScript solo donde aporta: el toggle de tema y el filtro de proyectos, ambos en JS vanilla.
- Presupuesto: **menos de 30 KB de JS** y **Lighthouse ≥ 95** en las cuatro categorías (móvil).
- Sin frameworks de UI, sin librerías CSS y sin scripts de terceros, salvo Cloudflare Web Analytics.

## P4. Accesibilidad

- Contraste WCAG 2.2 AA en los dos temas.
- Navegación completa por teclado, foco visible y un enlace para saltar al contenido.
- HTML semántico: un `h1` por página, landmarks y `lang` correcto en cada idioma.
- Todo funciona sin JavaScript. El filtro y el toggle son mejoras progresivas.

## P5. Bilingüe por diseño

- Español es el idioma por defecto (sin prefijo) e inglés vive en `/en/`.
- Toda página tiene su equivalente en el otro idioma, y el selector de idioma lleva a esa página, no a la home.
- Ningún texto de interfaz está escrito a mano en un componente: todos salen de `src/i18n/ui.ts`.

## P6. Build robusto

- Si un servicio externo (la API de GitHub) falla durante el build, **el build termina igual** y la interfaz omite
  el dato con elegancia.
- `npm run check` y `npm run build` sin errores son condición para hacer merge.

## P7. Simplicidad

- Agregar un proyecto = agregar dos Markdown. Nada más.
- Se prefiere borrar código a añadir configuración.
