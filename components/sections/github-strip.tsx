import { cacheLife } from "next/cache";

import { ArrowUpRightIcon } from "@/components/ui/icons";

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

export async function GitHubStrip() {
  const { repos, live } = await getRepoStats();
  return (
    <div className="mt-24">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h3 className="font-display text-h4">On GitHub</h3>
        <p className="type-label text-fg-muted">
          {live
            ? "Refreshed daily from the GitHub API"
            : "Live stats unavailable"}
        </p>
      </div>
      <ul className="mt-8 grid border-t border-l border-line sm:grid-cols-2 lg:grid-cols-3">
        {repos.map((repo) => (
          <li key={repo.name} className="border-r border-b border-line">
            <a
              href={repo.url}
              className="group flex h-full flex-col gap-3 p-6 transition-colors duration-(--dur-ui) hocus:bg-bg-elevated"
            >
              <span className="flex items-center justify-between gap-4">
                <span className="font-mono text-small">
                  mugabosam/{repo.name}
                </span>
                <ArrowUpRightIcon className="size-3 shrink-0 transition-transform duration-(--dur-ui) group-hocus:translate-x-1 group-hocus:-translate-y-1" />
              </span>
              <span className="text-fg-muted">{repo.label}</span>
              {live && (
                <span className="mt-auto flex flex-wrap gap-x-4 gap-y-1 type-label text-fg-muted">
                  {repo.language && <span>{repo.language}</span>}
                  {repo.pushedAt && (
                    <span>
                      Updated {monthYear.format(new Date(repo.pushedAt))}
                    </span>
                  )}
                  <span>
                    {repo.stars} {repo.stars === 1 ? "star" : "stars"}
                  </span>
                </span>
              )}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
