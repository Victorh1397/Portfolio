# 007 — About and CV

- **Estado:** in-progress
- **Fecha:** 2026-11-18
- **Depende de:** 003

## Contexto

Un reclutador que llega desde un proyecto necesita saber quién es Victor, qué está estudiando o haciendo y
cómo contactarlo, y poder descargar su CV.

## Requisitos

- **R1.** La página "Sobre mí" DEBE incluir una bio breve, formación, áreas de trabajo y enlaces de contacto.
- **R2.** EL SISTEMA DEBE leer los datos personales (GitHub, LinkedIn, email, CV) de un único archivo de configuración.
- **R3.** SI un enlace de contacto está vacío en la configuración, ENTONCES EL SISTEMA DEBE omitirlo sin dejar huecos.
- **R4.** SI el PDF del CV no existe en `public/`, ENTONCES EL SISTEMA DEBE omitir el enlace de descarga.
- **R5.** El footer DEBE repetir los enlaces de contacto disponibles.

### Fuera de alcance

- Formulario de contacto. Se descartó en la planificación: basta con email y LinkedIn.

## Diseño

- `src/config/site.ts`: `name`, `github`, `linkedin`, `email`, `cv` (`{ es, en }`, rutas bajo `public/cv/`).
- `AboutView.astro` comprueba con `fs.existsSync` en tiempo de build si el CV existe.
- El email se ofusca mínimamente: se arma en el HTML como `mailto:`. No se ofusca con JS, para no romper P4.

**Archivos afectados:** `src/config/site.ts`, `src/views/AboutView.astro`, `src/components/Footer.astro`, `public/cv/`.

## Tareas

- [x] T1 `site.ts` con los datos conocidos (R2)
- [x] T2 `AboutView` con la bio, la formación y los enlaces condicionales (R1, R3, R4)
- [x] T3 Enlaces de contacto en el footer (R5)
- [x] T4 Victor aporta LinkedIn, email público y los CV `public/cv/victor-mendez-cv-{es,en}.pdf` (R1)
- [ ] T5 **Victor revisa** la bio de `src/content/pages/{es,en}/about.md` (R1)

## Verificación

- [x] Sin CV en `public/cv/`, la página no muestra el enlace de descarga. Con el CV, el enlace descarga el PDF.
- [x] Con `linkedin: ''`, no aparece el enlace ni queda un separador suelto.

## Hallazgos
