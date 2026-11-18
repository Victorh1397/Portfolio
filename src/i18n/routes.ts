// URLs de cada página por idioma. Español sin prefijo, inglés bajo /en/ (specs/003-i18n R1).
import type { Lang } from './ui';

export type Alternates = Record<Lang, string>;

export const routes = {
  home: (lang: Lang) => (lang === 'es' ? '/' : '/en/'),
  about: (lang: Lang) => (lang === 'es' ? '/sobre-mi/' : '/en/about/'),
  project: (lang: Lang, slug: string) =>
    lang === 'es' ? `/proyectos/${slug}/` : `/en/projects/${slug}/`,
};

/** Construye las URLs equivalentes en ambos idiomas para una misma página. */
export function alternates(build: (lang: Lang) => string): Alternates {
  return { es: build('es'), en: build('en') };
}
