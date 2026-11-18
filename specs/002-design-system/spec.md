# 002 — Design system

- **Estado:** done
- **Fecha:** 2026-11-18
- **Depende de:** 001

## Contexto

La dirección elegida es editorial y tipográfica. Este documento fija los tokens y los componentes base para que
el resto del sitio no invente estilos sobre la marcha.

## Requisitos

- **R1.** EL SISTEMA DEBE definir colores, tipografía, espaciado y anchos como custom properties en `tokens.css`.
- **R2.** EL SISTEMA DEBE seguir la preferencia de color del sistema operativo cuando el usuario no haya elegido tema.
- **R3.** CUANDO el usuario pulse el toggle de tema, EL SISTEMA DEBE cambiar entre claro y oscuro y recordar la elección en `localStorage`.
- **R4.** EL SISTEMA DEBE aplicar el tema guardado antes del primer pintado, sin destello del tema equivocado.
- **R5.** SI `localStorage` no está disponible, ENTONCES EL SISTEMA DEBE seguir funcionando con el tema del sistema.
- **R6.** EL SISTEMA DEBE autoalojar las fuentes (Newsreader, IBM Plex Sans, IBM Plex Mono), solo con el subconjunto latino.
- **R7.** EL SISTEMA DEBE cumplir contraste AA en ambos temas para el texto, el texto secundario y el acento.
- **R8.** EL SISTEMA DEBE mostrar un foco visible en todos los elementos interactivos y un enlace "saltar al contenido".
- **R9.** MIENTRAS el usuario tenga `prefers-reduced-motion: reduce`, EL SISTEMA DEBE desactivar transiciones y view transitions.

### Fuera de alcance

- Página de styleguide pública. Los tokens se documentan aquí.

## Diseño

**Paleta** (contrastes calculados sobre el fondo de cada tema):

| Token | Claro | Oscuro | Uso |
|---|---|---|---|
| `--bg` | `#f4f1ea` | `#151412` | fondo (papel / tinta) |
| `--fg` | `#1b1a17` | `#ece8df` | texto principal (≈16:1 / ≈15:1) |
| `--muted` | `#5f5b53` | `#a8a296` | metadatos (≈6:1 / ≈7:1) |
| `--rule` | `#d6d0c3` | `#33302b` | líneas finas |
| `--accent` | `#b2401a` | `#f08a5d` | bermellón: enlaces y hover (≈5,4:1 / ≈7:1) |
| `--surface` | `#ebe6db` | `#1d1c19` | fondos sutiles (código, filtro activo) |

**Tipografía:** escala modular de 1,25. `--font-display` Newsreader Variable (eje `opsz`), `--font-body` IBM Plex Sans
(400/500/600), `--font-mono` IBM Plex Mono (400/500). Medida de lectura de unos 68 caracteres.

**Layout:** contenedor de `72rem` como máximo con gutter de `clamp(1rem, 4vw, 2.5rem)`. Grilla de 12 columnas desde 900 px.

**Tema:** atributo `data-theme` en `<html>`. Un script inline en `<head>` lo fija desde `localStorage` antes del pintado.
El CSS define el oscuro en `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) }` y en `[data-theme="dark"]`.

**View transitions:** cross-document por CSS (`@view-transition { navigation: auto }`), sin el router de Astro: cero JS
y nada que reinicializar entre páginas. Los navegadores sin soporte simplemente navegan.

**Archivos afectados:** `src/styles/{tokens,base,prose}.css`, `src/layouts/Base.astro`, `src/components/{Header,Footer,ThemeToggle}.astro`.

## Tareas

- [x] T1 `tokens.css` con paleta claro/oscuro, tipografía, espaciado (R1, R2, R7)
- [x] T2 `base.css`: reset, tipografía base, enlaces, foco, skip-link, reduced motion (R8, R9)
- [x] T3 `prose.css` para el cuerpo de los casos de estudio (R1)
- [x] T4 Fuentes vía `@fontsource`, solo el subconjunto latino (R6)
- [x] T5 `Base.astro` con el script inline de tema y view transitions (R4, R5, R9)
- [x] T6 `ThemeToggle.astro` accesible (`aria-pressed`, etiqueta i18n) (R3, R5)
- [x] T7 `Header.astro` y `Footer.astro` (R8)

## Verificación

- [x] Con el sistema en modo oscuro y sin preferencia guardada, la página carga en oscuro.
- [x] Al pulsar el toggle y recargar, se mantiene el tema elegido, sin destello.
- [ ] Al tabular desde el inicio, el primer foco es "Saltar al contenido" y es visible.
- [ ] Contraste verificado con DevTools en los dos temas.

## Hallazgos
- Newsreader Variable no tiene un CSS solo latino. Se importa `opsz.css`, cuyos `unicode-range` hacen que el navegador
  descargue únicamente el subconjunto latino. Plex Sans y Plex Mono sí se importan con `latin-*.css`.
- Los componentes con `display` propio anulaban el atributo `hidden`. Se añadió `[hidden] { display: none !important }` en `base.css`.
- Pendiente manual: revisar el contraste con DevTools y probar el skip-link con el teclado en un navegador real.
