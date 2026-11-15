/**
 * GitHub contribution calendar for the last year, normalised to one shape.
 *
 * Source order: GitHub's GraphQL API when GITHUB_TOKEN is set (the official
 * data), otherwise the public mirror at github-contributions-api.jogruber.de.
 * Fetching lives in `getContributionCalendar` (server only); the pure
 * normalisers are exported for unit tests.
 */

export type ContributionDay = {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
};
export type ContributionCalendar = {
  total: number;
  /** Oldest week first; each week has up to seven days, Sunday first. */
  weeks: ContributionDay[][];
  /** Which source produced the data. */
  source: "github" | "mirror";
};

export const GITHUB_USER = "mugabosam";

type GraphQLResponse = {
  data?: {
    user?: {
      contributionsCollection?: {
        contributionCalendar?: {
          totalContributions: number;
          weeks: {
            contributionDays: {
              date: string;
              contributionCount: number;
              contributionLevel: string;
            }[];
          }[];
        };
      };
    };
  };
};

type MirrorResponse = {
  total?: Record<string, number>;
  contributions?: { date: string; count: number; level: number }[];
};

const LEVELS: Record<string, ContributionDay["level"]> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

function clampLevel(level: number): ContributionDay["level"] {
  return Math.max(
    0,
    Math.min(4, Math.round(level)),
  ) as ContributionDay["level"];
}

export function normalizeGraphQL(
  payload: GraphQLResponse,
): ContributionCalendar | null {
  const calendar =
    payload.data?.user?.contributionsCollection?.contributionCalendar;
  if (
    !calendar ||
    !Array.isArray(calendar.weeks) ||
    calendar.weeks.length === 0
  )
    return null;
  return {
    total: calendar.totalContributions,
    source: "github",
    weeks: calendar.weeks.map((week) =>
      week.contributionDays.map((day) => ({
        date: day.date,
        count: day.contributionCount,
        level: LEVELS[day.contributionLevel] ?? 0,
      })),
    ),
  };
}

/** Groups the mirror's flat day list into Sunday-first weeks. */
export function normalizeMirror(
  payload: MirrorResponse,
): ContributionCalendar | null {
  const days = payload.contributions;
  if (!Array.isArray(days) || days.length === 0) return null;
  const weeks: ContributionDay[][] = [];
  for (const day of days) {
    const weekday = new Date(`${day.date}T00:00:00Z`).getUTCDay();
    if (weeks.length === 0 || weekday === 0) weeks.push([]);
    weeks[weeks.length - 1]!.push({
      date: day.date,
      count: day.count,
      level: clampLevel(day.level),
    });
  }
  const total =
    payload.total?.lastYear ?? days.reduce((sum, day) => sum + day.count, 0);
  return { total, source: "mirror", weeks };
}

/** Headline facts for the summary line and the SVG's accessible name. */
export function summarize(calendar: ContributionCalendar) {
  const days = calendar.weeks.flat();
  const busiest = days.reduce(
    (best, day) => (day.count > best.count ? day : best),
    days[0]!,
  );
  const active = days.filter((day) => day.count > 0).length;
  let streak = 0;
  let longest = 0;
  for (const day of days) {
    streak = day.count > 0 ? streak + 1 : 0;
    longest = Math.max(longest, streak);
  }
  return {
    total: calendar.total,
    active,
    busiest,
    longestStreak: longest,
    from: days[0]!.date,
    to: days[days.length - 1]!.date,
  };
}
