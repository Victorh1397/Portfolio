# 009 — Deploy (Cloudflare Pages)

- **Estado:** approved
- **Fecha:** 2026-11-18
- **Depende de:** 001–008

## Contexto

Publicar el sitio en Cloudflare Pages (plan gratuito) con deploy automático en cada push a `main`
y previews automáticas en cada rama.

## Requisitos

- **R1.** CUANDO se haga push a `main`, EL SISTEMA DEBE desplegarse automáticamente en `https://<proyecto>.pages.dev`.
- **R2.** CUANDO se haga push a otra rama, EL SISTEMA DEBE generar un deploy de preview con su propia URL.
- **R3.** El build de Cloudflare DEBE usar la misma versión de Node que en local (`.nvmrc`).
- **R4.** `SITE_URL` DEBE coincidir con la URL pública final, para que canonical, OG y sitemap sean correctos.

## Diseño

Pasos (los que requieren cuentas los hace Victor):

1. **GitHub:** el repositorio vacío `Victorh1397/Portfolio` ya existe. El remoto `origin` está configurado en local.
2. **Local:**
   ```bash
   git remote add origin https://github.com/Victorh1397/Portfolio.git
   git push -u origin main
   ```
3. **Cloudflare:** Dashboard → *Workers & Pages* → *Create* → pestaña *Pages* → *Connect to Git*, y elegir el repo.
   - Framework preset: **Astro**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Variables de entorno (Production y Preview):
     - `SITE_URL` = `https://<nombre-del-proyecto>.pages.dev`
     - `GITHUB_TOKEN` = token *fine-grained* de solo lectura de repos públicos (opcional; evita el límite de 60 req/h)
   - El nombre del proyecto define el subdominio: si `victor-mendez` está libre, la URL será `victor-mendez.pages.dev`.
4. **Analytics:** en el proyecto de Pages → *Metrics* → *Web Analytics* → *Enable*.
5. Si el subdominio final no es `victor-mendez.pages.dev`, actualizar el valor por defecto de `SITE_URL` en `astro.config.mjs`.

**Archivos afectados:** `.nvmrc`, `astro.config.mjs` (si cambia el dominio).

## Tareas

- [x] T1a Repo `Victorh1397/Portfolio` creado y remoto `origin` configurado (R1)
- [ ] T1b Push de `main` (R1)
- [ ] T2 Victor conecta el repo en Cloudflare Pages con la configuración de arriba (R1, R2, R3)
- [ ] T3 Ajustar `SITE_URL` al subdominio real (R4)
- [ ] T4 Activar Web Analytics (spec 008 R5)

## Verificación

- [ ] La URL `*.pages.dev` carga la home ES, `/en/` carga la home EN.
- [ ] Un push a una rama de prueba genera una URL de preview.
- [ ] `https://<dominio>/sitemap-index.xml` responde y usa el dominio real.
- [ ] El panel de Web Analytics registra visitas en las 24 h siguientes.

## Hallazgos
