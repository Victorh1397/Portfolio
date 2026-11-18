# Portfolio Victor Mendez — instrucciones para Claude

Sitio estático (Astro 7 + TypeScript) que presenta los proyectos de IA de Victor Mendez.
Se despliega en Cloudflare Pages desde la rama `main`.

## Metodología: SDD ligero

Este repositorio sigue el flujo descrito en [specs/README.md](specs/README.md). Reglas:

1. **Antes de tocar código**, lee [specs/000-constitution.md](specs/000-constitution.md) y la spec activa.
2. **Ningún cambio de comportamiento sin una spec `approved`.** Si el usuario pide una feature nueva,
   primero se redacta `specs/NNN-nombre/spec.md` desde `specs/_templates/spec.md` y se le pide aprobación.
3. Se implementa **tarea por tarea**: se marca `[x]` en la spec al terminar cada una y se hace commit
   con el formato `feat(NNN): T<n> descripción` (o `fix`, `docs`, `chore`).
4. Una spec pasa a `done` solo cuando su sección **Verificación** se ha cumplido de verdad.
5. Excepciones sin spec: corregir erratas, actualizar contenido de un proyecto existente y
   **agregar un proyecto nuevo** (basta con los dos Markdown, ver más abajo).

## Comandos

```bash
npm run dev       # servidor local en http://localhost:4321
npm run check     # astro check (tipos + contenido)
npm run build     # genera dist/
npm run preview   # sirve dist/
npm run cv        # regenera public/cv/*.pdf desde src/data/cv.ts (requiere Chrome); luego npm run build
```

`npm run check` y `npm run build` deben pasar sin errores antes de cada commit.

## Mapa del código

- `src/content/projects/{es,en}/<slug>.md`: un caso de estudio por idioma. El nombre del archivo es el slug y
  **debe coincidir** en ambos idiomas. El schema está en `src/content.config.ts`.
- `src/lib/github.ts`: metadatos de GitHub en tiempo de build. Nunca rompe el build si la API falla.
- `src/i18n/`: textos de interfaz (`ui.ts`) y rutas por idioma (`routes.ts`).
- `src/views/`: las páginas reales, parametrizadas por idioma. `src/pages/` solo contiene envoltorios finos.
- `src/config/site.ts`: datos personales (enlaces, CV). Un campo vacío oculta su enlace.
- `src/data/cv.ts`: trayectoria, formación y habilidades. Alimenta "Sobre mí" y el CV en PDF. **Nunca** incluir teléfono ni dirección.
- `src/styles/tokens.css`: la única fuente de colores, tipografía y espaciado.

## Agregar un proyecto

1. Crear `src/content/projects/es/<slug>.md` y `src/content/projects/en/<slug>.md`, copiando el frontmatter de uno existente.
2. Ajustar `order` (posición en el índice) y `repo` (`owner/name`).
3. `npm run check && npm run build`.

## Reglas de diseño

Las reglas anti-slop de la constitution son obligatorias. No agregues gradientes, sombras difusas, emojis,
iconos decorativos ni librerías de UI. Cualquier color nuevo se define como token en `tokens.css`, para claro y oscuro.
