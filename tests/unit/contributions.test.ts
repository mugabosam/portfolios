import { describe, expect, it } from "vitest";

import {
  normalizeGraphQL,
  normalizeMirror,
  summarize,
} from "@/lib/github/contributions";

const graphql = {
  data: {
    user: {
      contributionsCollection: {
        contributionCalendar: {
          totalContributions: 7,
          weeks: [
            {
              contributionDays: [
                {
                  date: "2026-11-01",
                  contributionCount: 0,
                  contributionLevel: "NONE",
                },
                {
                  date: "2026-11-02",
                  contributionCount: 3,
                  contributionLevel: "SECOND_QUARTILE",
                },
                {
                  date: "2026-11-03",
                  contributionCount: 4,
                  contributionLevel: "FOURTH_QUARTILE",
                },
              ],
            },
            {
              contributionDays: [
                {
                  date: "2026-11-08",
                  contributionCount: 0,
                  contributionLevel: "NONE",
                },
              ],
            },
          ],
        },
      },
    },
  },
};

const mirror = {
  total: { lastYear: 7 },
  contributions: [
    { date: "2026-11-01", count: 0, level: 0 }, // Sunday
    { date: "2026-11-02", count: 3, level: 2 },
    { date: "2026-11-03", count: 4, level: 4 },
    { date: "2026-11-08", count: 0, level: 0 }, // next Sunday starts a new week
  ],
};

describe("contribution calendar", () => {
  it("normalises the GraphQL shape", () => {
    const calendar = normalizeGraphQL(graphql);
    expect(calendar?.source).toBe("github");
    expect(calendar?.total).toBe(7);
    expect(calendar?.weeks[0]?.[2]).toEqual({
      date: "2026-11-03",
      count: 4,
      level: 4,
    });
  });

  it("groups the mirror's flat list into Sunday-first weeks", () => {
    const calendar = normalizeMirror(mirror);
    expect(calendar?.source).toBe("mirror");
    expect(calendar?.weeks).toHaveLength(2);
    expect(calendar?.weeks[1]?.[0]?.date).toBe("2026-11-08");
  });

  it("returns null for empty or malformed payloads", () => {
    expect(normalizeGraphQL({})).toBeNull();
    expect(normalizeMirror({ contributions: [] })).toBeNull();
  });

  it("summarises totals, active days, busiest day and streak", () => {
    const summary = summarize(normalizeMirror(mirror)!);
    expect(summary.total).toBe(7);
    expect(summary.active).toBe(2);
    expect(summary.longestStreak).toBe(2);
    expect(summary.busiest.date).toBe("2026-11-03");
    expect(summary.from).toBe("2026-11-01");
    expect(summary.to).toBe("2026-11-08");
  });
});
