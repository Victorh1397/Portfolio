// Textos de interfaz. El diccionario inglés está tipado contra el español:
// si falta una clave, `astro check` falla (specs/003-i18n R5).

export const languages = { es: 'Español', en: 'English' } as const;
export type Lang = keyof typeof languages;
export const defaultLang: Lang = 'es';

const es = {
  'meta.siteName': 'Victor Mendez',
  'meta.home.title': 'Victor Mendez · Ingeniería de IA',
  'meta.home.description':
    'Portfolio de Victor Mendez: sistemas RAG, asistentes conversacionales y modelos de machine learning, con el código y las métricas a la vista.',

  'a11y.skip': 'Saltar al contenido',
  'nav.label': 'Principal',
  'nav.projects': 'Proyectos',
  'nav.about': 'Sobre mí',
  'theme.dark': 'Tema oscuro',
  'lang.switch': 'Read in English',
  'lang.short': 'EN',

  'home.eyebrow': 'Ingeniería de IA',
  'home.title': 'Construyo sistemas de IA que se pueden medir.',
  'home.intro':
    'Soy Victor Mendez. Después de casi una década en petróleo y gas y más de cinco años en BI y datos para fintech, salud y agritech, hoy trabajo en recuperación aumentada (RAG), asistentes conversacionales y modelos predictivos, y respaldo cada decisión con especificaciones, tests y métricas reproducibles.',
  'home.projects': 'Proyectos',

  'filter.label': 'Filtrar por área',
  'filter.all': 'Todos',
  'filter.count.one': '1 proyecto',
  'filter.count.other': '{n} proyectos',

  'area.llm': 'LLM',
  'area.rag': 'RAG',
  'area.vector': 'Búsqueda vectorial',
  'area.voice': 'Voz',
  'area.ml': 'Machine learning',
  'area.platform': 'Plataforma',

  'project.metrics': 'Resultados clave',
  'project.details': 'Ficha del proyecto',
  'project.context': 'Contexto',
  'project.team': 'Equipo',
  'project.year': 'Año',
  'project.areas': 'Áreas',
  'project.stack': 'Stack',
  'project.language': 'Lenguaje principal',
  'project.updated': 'Última actividad',
  'project.repo': 'Código en GitHub',
  'project.demo': 'Ver demo',
  'project.prev': 'Anterior',
  'project.next': 'Siguiente',
  'project.all': 'Todos los proyectos',
  'project.pagination': 'Más proyectos',

  'about.contact': 'Contacto',
  'about.cv': 'Descargar CV (PDF)',
  'about.experience': 'Trayectoria',
  'about.education': 'Formación',
  'about.skills': 'Herramientas',

  'cv.title': 'Currículum',
  'cv.summary': 'Perfil',
  'cv.experience': 'Experiencia',
  'cv.education': 'Formación',
  'cv.skills': 'Habilidades',
  'cv.present': 'actualidad',
  'cv.presentShort': 'hoy',
  'cv.portfolio': 'Portfolio',

  'contact.github': 'GitHub',
  'contact.linkedin': 'LinkedIn',
  'contact.email': 'Email',

  'footer.colophon': 'Sitio estático hecho con Astro. Tipografías Newsreader e IBM Plex.',

  'notFound.title': 'Página no encontrada',
  'notFound.body': 'La dirección no existe o ha cambiado.',
  'notFound.back': 'Volver al inicio',
} as const;

type Keys = keyof typeof es;

const en: Record<Keys, string> = {
  'meta.siteName': 'Victor Mendez',
  'meta.home.title': 'Victor Mendez · AI Engineering',
  'meta.home.description':
    'Portfolio of Victor Mendez: RAG systems, conversational assistants and machine learning models, with the code and the metrics in plain sight.',

  'a11y.skip': 'Skip to content',
  'nav.label': 'Main',
  'nav.projects': 'Projects',
  'nav.about': 'About',
  'theme.dark': 'Dark theme',
  'lang.switch': 'Leer en español',
  'lang.short': 'ES',

  'home.eyebrow': 'AI Engineering',
  'home.title': 'I build AI systems you can measure.',
  'home.intro':
    'I’m Victor Mendez. After almost a decade in oil and gas and 5+ years in BI and data across fintech, healthcare and agritech, I now work on retrieval-augmented generation, conversational assistants and predictive models, backing every decision with specs, tests and reproducible metrics.',
  'home.projects': 'Projects',

  'filter.label': 'Filter by area',
  'filter.all': 'All',
  'filter.count.one': '1 project',
  'filter.count.other': '{n} projects',

  'area.llm': 'LLM',
  'area.rag': 'RAG',
  'area.vector': 'Vector search',
  'area.voice': 'Voice',
  'area.ml': 'Machine learning',
  'area.platform': 'Platform',

  'project.metrics': 'Key results',
  'project.details': 'Project details',
  'project.context': 'Context',
  'project.team': 'Team',
  'project.year': 'Year',
  'project.areas': 'Areas',
  'project.stack': 'Stack',
  'project.language': 'Main language',
  'project.updated': 'Last activity',
  'project.repo': 'Code on GitHub',
  'project.demo': 'Watch demo',
  'project.prev': 'Previous',
  'project.next': 'Next',
  'project.all': 'All projects',
  'project.pagination': 'More projects',

  'about.contact': 'Contact',
  'about.cv': 'Download CV (PDF)',
  'about.experience': 'Experience',
  'about.education': 'Education',
  'about.skills': 'Tools',

  'cv.title': 'Résumé',
  'cv.summary': 'Profile',
  'cv.experience': 'Experience',
  'cv.education': 'Education',
  'cv.skills': 'Skills',
  'cv.present': 'present',
  'cv.presentShort': 'now',
  'cv.portfolio': 'Portfolio',

  'contact.github': 'GitHub',
  'contact.linkedin': 'LinkedIn',
  'contact.email': 'Email',

  'footer.colophon': 'Static site built with Astro. Set in Newsreader and IBM Plex.',

  'notFound.title': 'Page not found',
  'notFound.body': 'This address doesn’t exist or has moved.',
  'notFound.back': 'Back to home',
};

const ui = { es, en } as const;

export type UIKey = Keys;

export function useTranslations(lang: Lang) {
  return function t(key: UIKey, vars?: Record<string, string | number>): string {
    let text: string = ui[lang][key] ?? ui[defaultLang][key];
    if (vars) {
      for (const [name, value] of Object.entries(vars)) {
        text = text.replaceAll(`{${name}}`, String(value));
      }
    }
    return text;
  };
}

export function otherLang(lang: Lang): Lang {
  return lang === 'es' ? 'en' : 'es';
}

/** Etiqueta BCP 47 para `lang`, `og:locale` e `Intl`. */
export const locales: Record<Lang, { html: string; og: string }> = {
  es: { html: 'es', og: 'es_ES' },
  en: { html: 'en', og: 'en_US' },
};
