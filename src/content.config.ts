import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

export const AREAS = ['llm', 'rag', 'vector', 'voice', 'ml', 'platform'] as const;
export type Area = (typeof AREAS)[number];

// Diagrama de arquitectura como datos (specs/011 R1–R4). Se renderiza con src/components/Flow.astro.
const node = z.object({
  title: z.string(),
  detail: z.string().optional(),
  /** La pieza central del sistema. Como mucho una por diagrama. */
  accent: z.boolean().optional(),
});

const diagram = z
  .object({
    caption: z.string(),
    lanes: z
      .array(
        z.object({
          label: z.string().optional(),
          /** Flujo fuera de línea / secundario: borde discontinuo. */
          offline: z.boolean().optional(),
          steps: z
            .array(z.object({ label: z.string().optional(), nodes: z.array(node).min(1).max(3) }))
            .min(1)
            .max(5),
        }),
      )
      .min(1)
      .max(3),
  })
  .refine((d) => d.lanes.flatMap((l) => l.steps.flatMap((s) => s.nodes)).filter((n) => n.accent).length <= 1, {
    message: 'Solo un nodo por diagrama puede llevar `accent`.',
  });

// specs/004-projects-content R1: el build falla si el frontmatter no cumple.
const projects = defineCollection({
  loader: glob({ pattern: '{es,en}/*.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().min(3),
      summary: z.string().min(20).max(240),
      repo: z.string().regex(/^[\w.-]+\/[\w.-]+$/, 'Formato esperado: owner/name'),
      areas: z.array(z.enum(AREAS)).min(1),
      stack: z.array(z.string()).min(1),
      year: z.number().int().min(2015).max(2100),
      order: z.number().int().positive(),
      context: z.string(),
      team: z.string().optional(),
      demo: z.url().optional(),
      metrics: z
        .array(z.object({ value: z.string(), label: z.string() }))
        .max(4)
        .optional(),
      diagram: diagram.optional(),
      /** Capturas reales (specs/011 R5). Archivos en src/assets/projects/<slug>/. */
      figures: z
        .array(z.object({ src: image(), alt: z.string().min(10), caption: z.string() }))
        .max(4)
        .optional(),
    })
    .strict(),
});

// Páginas de texto libre (por ahora solo "Sobre mí").
const pages = defineCollection({
  loader: glob({ pattern: '{es,en}/*.md', base: './src/content/pages' }),
  schema: z
    .object({
      title: z.string(),
      description: z.string().max(200),
      lead: z.string(),
    })
    .strict(),
});

export const collections = { projects, pages };
