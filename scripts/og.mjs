// Genera public/og/og-{es,en}.png (1200×630) a partir de un SVG (specs/008 T2).
// Uso: node scripts/og.mjs   — volver a ejecutarlo solo si cambian los textos o la paleta.
// Las fuentes del SVG se resuelven con las del sistema (serif/monospace); no hace falta que coincidan
// exactamente con las del sitio.
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const variants = {
  es: { eyebrow: 'INGENIERÍA DE IA', line1: 'Construyo sistemas de IA', line2: 'que se pueden medir.', foot: 'RAG · Búsqueda vectorial · Voz · Machine learning' },
  en: { eyebrow: 'AI ENGINEERING', line1: 'I build AI systems', line2: 'you can measure.', foot: 'RAG · Vector search · Voice · Machine learning' },
};

const svg = ({ eyebrow, line1, line2, foot }) => `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#f4f1ea"/>
  <text x="80" y="120" font-family="Georgia, serif" font-size="36" fill="#1b1a17">Victor Mendez</text>
  <text x="1120" y="120" text-anchor="end" font-family="Consolas, monospace" font-size="22" letter-spacing="3" fill="#5f5b53">${eyebrow}</text>
  <line x1="80" y1="160" x2="1120" y2="160" stroke="#d6d0c3" stroke-width="2"/>
  <text x="80" y="330" font-family="Georgia, serif" font-size="84" letter-spacing="-2" fill="#1b1a17">${line1}</text>
  <text x="80" y="430" font-family="Georgia, serif" font-size="84" letter-spacing="-2" fill="#b2401a">${line2}</text>
  <line x1="80" y1="520" x2="1120" y2="520" stroke="#d6d0c3" stroke-width="2"/>
  <text x="80" y="566" font-family="Consolas, monospace" font-size="22" fill="#5f5b53">${foot}</text>
</svg>`;

mkdirSync(new URL('../public/og/', import.meta.url), { recursive: true });
for (const [lang, text] of Object.entries(variants)) {
  const out = new URL(`../public/og/og-${lang}.png`, import.meta.url);
  await sharp(Buffer.from(svg(text))).png({ compressionLevel: 9 }).toFile(fileURLToPath(out));
  console.log(`og-${lang}.png`);
}
