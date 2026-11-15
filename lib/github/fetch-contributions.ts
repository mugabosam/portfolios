import "server-only";

import { cacheLife } from "next/cache";

import {
  type ContributionCalendar,
  GITHUB_USER,
  normalizeGraphQL,
  normalizeMirror,
} from "./contributions";

const QUERY = `query($login: String!) {
  user(login: $login) {
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks { contributionDays { date contributionCount contributionLevel } }
      }
    }
  }
}`;

async function fromGitHub(token: string): Promise<ContributionCalendar | null> {
  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "portfolio-build",
    },
    body: JSON.stringify({ query: QUERY, variables: { login: GITHUB_USER } }),
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error(`GitHub GraphQL ${response.status}`);
  return normalizeGraphQL(await response.json());
}

async function fromMirror(): Promise<ContributionCalendar | null> {
  const response = await fetch(
    `https://github-contributions-api.jogruber.de/v4/${GITHUB_USER}?y=last`,
    {
      headers: { "User-Agent": "portfolio-build" },
      signal: AbortSignal.timeout(8000),
    },
  );
  if (!response.ok) throw new Error(`Contributions mirror ${response.status}`);
  return normalizeMirror(await response.json());
}

/**
 * Fetched at build time and refreshed daily (brief §5.7). Returns null when
 * neither source answers, in which case the section renders nothing rather
 * than a stale or invented graph.
 */
export async function getContributionCalendar(): Promise<ContributionCalendar | null> {
  "use cache";
  const token = process.env.GITHUB_TOKEN;
  try {
    const calendar = token ? await fromGitHub(token).catch(() => null) : null;
    const result = calendar ?? (await fromMirror());
    cacheLife("days");
    return result;
  } catch (error) {
    console.warn(
      "[github] contribution calendar unavailable:",
      error instanceof Error ? error.message : error,
    );
    cacheLife("hours");
    return null;
  }
}
