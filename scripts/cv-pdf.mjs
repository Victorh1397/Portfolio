// Genera public/cv/victor-mendez-cv-{es,en}.pdf a partir de /cv/{es,en}/ (specs/010 T4).
// Uso: npm run cv   (= astro build && node scripts/cv-pdf.mjs). Después, `npm run build` otra vez para que
// dist/ incluya los PDF nuevos. Requiere Chrome, Chromium o Edge; se puede forzar con CHROME_PATH.
import { createServer } from 'node:http';
import { existsSync, mkdtempSync, readFileSync, rmSync, statSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { tmpdir } from 'node:os';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = join(root, 'dist');
const outDir = join(root, 'public', 'cv');
const LANGS = ['es', 'en'];

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
};

function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
  ].filter(Boolean);
  const found = candidates.find((p) => existsSync(p));
  if (!found) throw new Error('No se encontró Chrome/Edge. Define CHROME_PATH.');
  return found;
}

/** Servidor estático mínimo sobre dist/ (las rutas absolutas de /_astro/ necesitan un origen HTTP). */
function serve() {
  const server = createServer((req, res) => {
    const url = new URL(req.url ?? '/', 'http://localhost');
    let file = normalize(join(dist, decodeURIComponent(url.pathname)));
    if (!file.startsWith(dist)) {
      res.writeHead(403).end();
      return;
    }
    if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
    if (!existsSync(file)) {
      res.writeHead(404).end();
      return;
    }
    res.writeHead(200, { 'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream' });
    res.end(readFileSync(file));
  });
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server)));
}

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: 'ignore' });
    child.on('error', reject);
    child.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} terminó con código ${code}`))));
  });
}

function pageCount(pdfPath) {
  const text = readFileSync(pdfPath).toString('latin1');
  return (text.match(/\/Type\s*\/Page(?!s)/g) ?? []).length;
}

if (!existsSync(join(dist, 'cv', 'es', 'index.html'))) {
  throw new Error('Falta dist/cv/. Ejecuta primero `npm run build` (o usa `npm run cv`).');
}

const chrome = findChrome();
const server = await serve();
const { port } = server.address();
const profile = mkdtempSync(join(tmpdir(), 'cv-pdf-'));

try {
  for (const lang of LANGS) {
    const out = join(outDir, `victor-mendez-cv-${lang}.pdf`);
    await run(chrome, [
      '--headless=new',
      '--disable-gpu',
      '--no-first-run',
      `--user-data-dir=${profile}`,
      '--no-pdf-header-footer',
      '--virtual-time-budget=5000',
      `--print-to-pdf=${out}`,
      `http://127.0.0.1:${port}/cv/${lang}/`,
    ]);
    const pages = pageCount(out);
    console.log(`victor-mendez-cv-${lang}.pdf · ${pages} página(s)`);
    if (pages !== 1) console.warn(`  Aviso: el CV en ${lang} ocupa ${pages} páginas (specs/010 R6).`);
  }
  console.log('Listo. Ejecuta `npm run build` para que dist/ incluya los PDF nuevos.');
} finally {
  server.close();
  rmSync(profile, { recursive: true, force: true });
}
