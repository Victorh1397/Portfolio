// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const site = process.env.SITE_URL ?? 'https://victor-mendez.pages.dev';

export default defineConfig({
  site,
  output: 'static',
  trailingSlash: 'ignore',
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'es',
        locales: { es: 'es-ES', en: 'en' },
      },
      // Fuera del sitemap: la 404 y las páginas imprimibles del CV (specs/010 R7).
      filter: (page) => !page.includes('/404') && !/\/cv\/(es|en)\/$/.test(page),
    }),
  ],
});
