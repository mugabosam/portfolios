import { cacheLife } from "next/cache";

import { ExternalIcon } from "@/components/ui/icons";

/** The public repositories behind the case studies, in display order. */
const REPOS = [
  { name: "Malaria-Detection", label: "MalariaCheck" },
  { name: "Zunga", label: "Zunga" },
  { name: "BlueSnap", label: "BlueSnap" },
  { name: "Blockchain-Health", label: "MediChain" },
  { name: "Inventory", label: "Inventory Pro" },
  { name: "rock-paper-scissor", label: "RPS Arena" },
] as const;

type RepoStats = {
  name: string;
  label: string;
  url: string;
  language: string | null;
  pushedAt: string | null;
  stars: number;
};

type GitHubRepo = {
  name: string;
  html_url: string;
  language: string | null;
  pushed_at: string;
  stargazers_count: number;
};

/**
 * Live repository stats, fetched at build time and refreshed daily
 * (brief §5.7). If GitHub is unreachable or rate-limited, the strip still
 * renders with links only.
 */
async function getRepoStats(): Promise<{ repos: RepoStats[]; live: boolean }> {
  "use cache";
  const fallback = REPOS.map((repo) => ({
    ...repo,
    url: `https://github.com/mugabosam/${repo.name}`,
    language: null,
    pushedAt: null,
    stars: 0,
  }));

  try {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
      "User-Agent": "portfolio-build",
    };
    if (process.env.GITHUB_TOKEN)
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    const response = await fetch(
      "https://api.github.com/users/mugabosam/repos?per_page=100&type=owner",
      {
        headers,
        signal: AbortSignal.timeout(8000),
      },
    );
    if (!response.ok) throw new Error(`GitHub API ${response.status}`);
    const data = (await response.json()) as GitHubRepo[];
    const byName = new Map(data.map((repo) => [repo.name.toLowerCase(), repo]));
    cacheLife("days");
    return {
      live: true,
      repos: REPOS.map((repo) => {
        const found = byName.get(repo.name.toLowerCase());
        return found
          ? {
              ...repo,
              url: found.html_url,
              language: found.language,
              pushedAt: found.pushed_at,
              stars: found.stargazers_count,
            }
          : fallback.find((f) => f.name === repo.name)!;
      }),
    };
  } catch {
    cacheLife("hours");
    return { live: false, repos: fallback };
  }
}

const monthYear = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

/** Language dot colours, drawn from the site palette. */
const languageColor: Record<string, string> = {
  Python: "var(--sky)",
  Dart: "var(--sky-bright)",
  Solidity: "var(--ink)",
  TypeScript: "var(--sky)",
  JavaScript: "var(--sun-deep)",
  PHP: "var(--ink-3)",
  HTML: "var(--sun-deep)",
};

export async function GitHubStrip() {
  const { repos, live } = await getRepoStats();
  return (
    <div className="mt-16">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h3 className="type-h3">Public repositories</h3>
        <p className="text-small text-ink-3">
          {live
            ? "Refreshed daily from the GitHub API"
            : "Live stats unavailable right now"}
        </p>
      </div>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {repos.map((repo) => (
          <li key={repo.name} className="flex">
            <a
              href={repo.url}
              className="card-lift group flex w-full flex-col gap-2 rounded-lg border border-line bg-surface p-5"
            >
              <span className="flex items-start justify-between gap-4">
                <span className="font-mono text-small break-all">
                  <span className="text-ink-3">mugabosam/</span>
                  <span className="font-semibold text-ink">{repo.name}</span>
                </span>
                <ExternalIcon className="mt-0.5 size-4 shrink-0 text-ink-3 transition-[translate,color] duration-(--dur-ui) group-hocus:translate-x-0.5 group-hocus:-translate-y-0.5 group-hocus:text-sky" />
              </span>
              <span className="text-small text-ink-2">{repo.label}</span>
              {live && (
                <span className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 pt-2 text-caption text-ink-3">
                  {repo.language && (
                    <span className="inline-flex items-center gap-1.5">
                      <span
                        aria-hidden="true"
                        className="size-2 rounded-full"
                        style={{
                          backgroundColor:
                            languageColor[repo.language] ?? "var(--ink-3)",
                        }}
                      />
                      {repo.language}
                    </span>
                  )}
                  {repo.pushedAt && (
                    <span>
                      Updated {monthYear.format(new Date(repo.pushedAt))}
                    </span>
                  )}
                  {repo.stars > 0 && (
                    <span>
                      {repo.stars} {repo.stars === 1 ? "star" : "stars"}
                    </span>
                  )}
                </span>
              )}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
