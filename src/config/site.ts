// Datos personales. Un campo vacío oculta su enlace en todo el sitio (specs/007-about-cv R3).

interface SiteConfig {
  name: string;
  github: string;
  linkedin: string;
  email: string;
  cv: { es: string; en: string };
}

export const site: SiteConfig = {
  name: 'Victor Mendez',

  /** Usuario de GitHub, sin URL. */
  github: 'Victorh1397',

  /** URL completa del perfil, p. ej. 'https://www.linkedin.com/in/usuario/'. */
  linkedin: 'https://www.linkedin.com/in/victorhmd/',

  /** Email público. Vacío = no se muestra. */
  email: 'victorh1397@gmail.com',

  /**
   * CV en PDF por idioma, con rutas relativas a `public/`. Si el archivo no existe,
   * el enlace se omite. Puede ser el mismo archivo para ambos idiomas.
   */
  cv: {
    es: 'cv/victor-mendez-cv-es.pdf',
    en: 'cv/victor-mendez-cv-en.pdf',
  },
};

export function contactLinks() {
  const links: { key: 'github' | 'linkedin' | 'email'; href: string; label: string }[] = [];
  if (site.github) {
    links.push({ key: 'github', href: `https://github.com/${site.github}`, label: `github.com/${site.github}` });
  }
  if (site.linkedin) {
    links.push({ key: 'linkedin', href: site.linkedin, label: site.linkedin.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '') });
  }
  if (site.email) {
    links.push({ key: 'email', href: `mailto:${site.email}`, label: site.email });
  }
  return links;
}
