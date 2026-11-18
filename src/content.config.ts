import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

export const AREAS = ['llm', 'rag', 'vector', 'voice', 'ml', 'platform'] as const;
export type Area = (typeof AREAS)[number];

// specs/004-projects-content R1: el build falla si el frontmatter no cumple.
const projects = defineCollection({
  loader: glob({ pattern: '{es,en}/*.md', base: './src/content/projects' }),
  schema: z
    .object({
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
