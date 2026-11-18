# Portfolio · Victor Mendez

Sitio personal con mis proyectos de IA. Astro 7, estático, desplegado en Cloudflare Pages.

```bash
npm install
npm run dev      # http://localhost:4321
npm run check    # tipos y contenido
npm run build    # dist/
```

- **Contenido:** `src/content/projects/{es,en}/*.md` (un caso de estudio por idioma) y `src/content/pages/`.
- **Datos personales:** `src/config/site.ts`. La trayectoria vive en `src/data/cv.ts`; `npm run cv` regenera los PDF en `public/cv/`.
- **Metodología:** desarrollo guiado por especificaciones, en [`specs/`](specs/README.md). Las instrucciones para
  asistentes de código están en [`CLAUDE.md`](CLAUDE.md).
- **Deploy:** ver [`specs/009-deploy`](specs/009-deploy/spec.md).
