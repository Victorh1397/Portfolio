import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '@/i18n/ui';

export type Project = CollectionEntry<'projects'> & { slug: string };

/** `es/vicky` → `{ lang: 'es', slug: 'vicky' }` */
function parseId(id: string): { lang: Lang; slug: string } {
  const [lang, ...rest] = id.split('/');
  return { lang: lang as Lang, slug: rest.join('/') };
}

let parityChecked = false;

/**
 * Comprueba que cada proyecto exista en ambos idiomas (specs/004 R3).
 * Si falta uno, lanza un error que nombra el slug y detiene el build.
 */
async function assertParity() {
  if (parityChecked) return;
  const all = await getCollection('projects');
  const byLang: Record<Lang, Set<string>> = { es: new Set(), en: new Set() };
  for (const entry of all) {
    const { lang, slug } = parseId(entry.id);
    byLang[lang].add(slug);
  }
  const missing: string[] = [];
  for (const slug of byLang.es) if (!byLang.en.has(slug)) missing.push(`en/${slug}.md`);
  for (const slug of byLang.en) if (!byLang.es.has(slug)) missing.push(`es/${slug}.md`);
  if (missing.length > 0) {
    throw new Error(
      `[projects] Faltan traducciones: ${missing.join(', ')}. Cada proyecto debe existir en es/ y en/ con el mismo nombre de archivo.`,
    );
  }
  parityChecked = true;
}

/** Proyectos de un idioma, ordenados por `order`. */
export async function getProjects(lang: Lang): Promise<Project[]> {
  await assertParity();
  const entries = await getCollection('projects', (entry) => parseId(entry.id).lang === lang);
  return entries
    .map((entry) => ({ ...entry, slug: parseId(entry.id).slug }))
    .sort((a, b) => a.data.order - b.data.order);
}

/** Rutas estáticas para las páginas de detalle, con vecinos para la navegación anterior/siguiente. */
export async function getProjectPaths(lang: Lang) {
  const projects = await getProjects(lang);
  return projects.map((project, i) => ({
    params: { slug: project.slug },
    props: {
      project,
      index: i,
      prev: projects[i - 1] ?? null,
      next: projects[i + 1] ?? null,
    },
  }));
}

