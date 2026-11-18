# 006 — Home and detail

- **Estado:** done
- **Fecha:** 2026-11-18
- **Depende de:** 004, 005

## Contexto

Son las dos páginas que importan: la home, que debe decir quién es Victor y listar los proyectos, y el detalle,
donde se cuenta cada caso de estudio.

## Requisitos

- **R1.** La home DEBE abrir con una presentación de 2 o 3 líneas: nombre, foco profesional y el enfoque de trabajo.
- **R2.** La home DEBE listar los proyectos como un índice numerado (1, 2…), ordenado por `order`, con título, resumen, áreas y año.
- **R3.** CUANDO el usuario elija un área en el filtro, EL SISTEMA DEBE mostrar solo los proyectos de esa área y anunciar el número de resultados a lectores de pantalla.
- **R4.** SI JavaScript no está disponible, ENTONCES EL SISTEMA DEBE mostrar todos los proyectos y ocultar el filtro.
- **R5.** Toda la fila del índice DEBE ser clicable y llevar al detalle.
- **R6.** El detalle DEBE mostrar título, resumen, métricas (si hay), cuerpo del caso de estudio y una columna de metadatos: contexto, equipo, año, áreas, stack, lenguaje, última actualización y enlaces (repo y demo).
- **R7.** El detalle DEBE ofrecer navegación al proyecto anterior y al siguiente, y volver al índice.
- **R8.** EL SISTEMA DEBE tener una página 404 bilingüe.

### Fuera de alcance

- Búsqueda de texto. Con 5–10 proyectos no aporta.

## Diseño

- `ProjectRow.astro`: `<li>` con un `<a>` que cubre la fila. Grid: número (mono) · título + resumen · áreas · año.
  Al hacer hover, el título toma el color de acento y la flecha se desplaza 4 px.
- `ProjectFilter.astro`: un grupo de botones con `aria-pressed`, renderizado con `hidden` y revelado por el script.
  Las filas llevan `data-areas`. Hay una región `aria-live="polite"` con "N proyectos".
- `ProjectView.astro`: en escritorio, el cuerpo ocupa 8 columnas y los metadatos 4 (sticky). En móvil, los metadatos van arriba, compactos.
- Métricas: fila tipográfica (cifra en serif grande y etiqueta en mono). Sin animación.
- `view-transition-name` en el título del proyecto para enlazar visualmente el índice con el detalle.

**Archivos afectados:** `src/views/{HomeView,ProjectView}.astro`, `src/components/{ProjectRow,ProjectFilter}.astro`, `src/pages/404.astro`.

## Tareas

- [x] T1 `HomeView` con la presentación y el índice (R1, R2, R5)
- [x] T2 `ProjectFilter` con mejora progresiva y anuncio aria-live (R3, R4)
- [x] T3 `ProjectView` con métricas, cuerpo y metadatos (R6)
- [x] T4 Navegación anterior/siguiente (R7)
- [x] T5 Página 404 (R8)

## Verificación

- [x] El filtro "RAG" deja 3 proyectos y el lector de pantalla anuncia "3 proyectos".
- [x] Con JS desactivado (DevTools), no aparece el filtro y se ven los 5 proyectos.
- [x] La fila es clicable en toda su superficie, y Tab enfoca una sola vez por fila.
- [x] A 360 px de ancho no hay scroll horizontal.

## Hallazgos
- Se quitó el contador "05" junto al título "Proyectos": repetía el estado del filtro ("5 proyectos").
- El eyebrow del detalle muestra `NN · año`. El contexto completo ya está en la ficha lateral.
- Chrome headless impone un viewport mínimo de unos 550 px; la prueba a 360 px se hizo dentro de un iframe.
- La numeración pasó de "01, 02…" a "1, 2…" (2026-11-18): Victor la considera una marca típica de las plantillas generadas por IA. También cambia el eyebrow del detalle ("2 · 2026").
