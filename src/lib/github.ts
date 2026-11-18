// Metadatos de GitHub en tiempo de build (specs/005-github-data).
// Nunca rompe el build: ante cualquier fallo devuelve null y avisa en el log.

export interface RepoMeta {
  language: string | null;
  pushedAt: Date | null;
  topics: string[];
}

const TIMEOUT_MS = 8000;
const cache = new Map<string, Promise<RepoMeta | null>>();

function token(): string | undefined {
  return import.meta.env.GITHUB_TOKEN || process.env.GITHUB_TOKEN || undefined;
}

async function fetchRepo(repo: string): Promise<RepoMeta | null> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'portfolio-site-build',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  const auth = token();
  if (auth) headers.Authorization = `Bearer ${auth}`;

  try {
    const res = await fetch(`https://api.github.com/repos/${repo}`, {
      headers,
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) {
      console.warn(`[github] ${repo}: HTTP ${res.status}. Se omiten sus metadatos.`);
      return null;
    }
    const data = (await res.json()) as {
      language?: string | null;
      pushed_at?: string | null;
      topics?: string[];
    };
    return {
      language: data.language ?? null,
      pushedAt: data.pushed_at ? new Date(data.pushed_at) : null,
      topics: data.topics ?? [],
    };
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    console.warn(`[github] ${repo}: ${reason}. Se omiten sus metadatos.`);
    return null;
  }
}

/** Una sola petición por repositorio y build, aunque se llame desde varias páginas (R5). */
export function getRepoMeta(repo: string): Promise<RepoMeta | null> {
  let pending = cache.get(repo);
  if (!pending) {
    pending = fetchRepo(repo);
    cache.set(repo, pending);
  }
  return pending;
}

export function repoUrl(repo: string): string {
  return `https://github.com/${repo}`;
}

export function formatMonth(date: Date, lang: string): string {
  return new Intl.DateTimeFormat(lang, { year: 'numeric', month: 'long' }).format(date);
}
