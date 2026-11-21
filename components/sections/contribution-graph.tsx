import { RevealOnce } from "@/components/motion/reveal-once";
import { summarize } from "@/lib/github/contributions";
import { getContributionCalendar } from "@/lib/github/fetch-contributions";

const CELL = 11;
const GAP = 3;
const STEP = CELL + GAP;
const LEFT = 30; // weekday labels
const TOP = 20; // month labels

/** Empty, then four steps from pale peach to deep orange: the site palette. */
const LEVELS = ["#efe9e2", "#ffd0b8", "#ff9a66", "#e8520f", "#a83000"] as const;

const month = new Intl.DateTimeFormat("en-US", {
  month: "short",
  timeZone: "UTC",
});
const longDate = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});
const number = new Intl.NumberFormat("en-US");

const utc = (date: string) => new Date(`${date}T00:00:00Z`);

/**
 * A year of GitHub contributions as a heat map in the site's orange ramp.
 * One path per shade keeps the SVG small (five elements instead of 365), so
 * the home page's HTML and parse time stay low. The headline numbers appear
 * as real text, and the SVG carries them in its accessible name.
 */
export async function ContributionGraph({ className }: { className?: string }) {
  const calendar = await getContributionCalendar();
  if (!calendar) return null;

  const summary = summarize(calendar);
  const width = LEFT + calendar.weeks.length * STEP;
  const height = TOP + 7 * STEP;

  // One path per level: a tiny square sub-path for each day.
  const paths = LEVELS.map(() => [] as string[]);
  calendar.weeks.forEach((week, w) => {
    for (const day of week) {
      const x = LEFT + w * STEP;
      const y = TOP + utc(day.date).getUTCDay() * STEP;
      paths[day.level]!.push(`M${x} ${y}h${CELL}v${CELL}h-${CELL}z`);
    }
  });

  // Month label at the first week that starts a new month, at least three weeks apart.
  const monthLabels: { x: number; label: string }[] = [];
  let lastMonth = "";
  calendar.weeks.forEach((week, index) => {
    const first = week[0];
    if (!first) return;
    const label = month.format(utc(first.date));
    if (label !== lastMonth) {
      const previous = monthLabels.at(-1);
      if (!previous || index - (previous.x - LEFT) / STEP > 2)
        monthLabels.push({ x: LEFT + index * STEP, label });
      lastMonth = label;
    }
  });

  const accessibleName = `${number.format(summary.total)} GitHub contributions between ${longDate.format(utc(summary.from))} and ${longDate.format(utc(summary.to))}, on ${summary.active} days. Busiest day: ${longDate.format(utc(summary.busiest.date))} with ${summary.busiest.count} contributions.`;

  const tiles = [
    {
      count: summary.total,
      value: number.format(summary.total),
      label: "Contributions, last year",
    },
    {
      count: summary.active,
      value: String(summary.active),
      label: "Active days",
    },
    {
      count: summary.longestStreak,
      value: String(summary.longestStreak),
      label: "Longest streak, days",
    },
    {
      count: summary.busiest.count,
      value: String(summary.busiest.count),
      label: `Busiest day (${month.format(utc(summary.busiest.date))} ${Number(summary.busiest.date.slice(-2))})`,
    },
  ];

  return (
    <div className={className}>
      <div className="overflow-hidden rounded-[1.75rem] border border-line bg-surface">
        <dl className="grid grid-cols-2 border-b border-line sm:grid-cols-4">
          {tiles.map((item, index) => (
            <div
              key={item.label}
              className={`flex flex-col gap-1 p-5 sm:p-6 ${index % 2 === 1 ? "border-l border-line" : ""} ${index > 1 ? "border-t border-line sm:border-t-0" : ""} ${index === 2 ? "sm:border-l" : ""}`}
            >
              <dt className="text-caption text-ink-3">{item.label}</dt>
              <dd
                data-count={item.count}
                className="order-first text-[clamp(1.75rem,3vw,2.5rem)] leading-none font-[780] [font-stretch:90%] tabular-nums"
              >
                {item.value}
              </dd>
            </div>
          ))}
        </dl>

        <div
          className="overflow-x-auto p-5 sm:p-6"
          tabIndex={0}
          role="region"
          aria-label="Contribution calendar (scrolls sideways on small screens)"
        >
          <RevealOnce className="graph-sweep">
            <svg
              viewBox={`0 0 ${width} ${height}`}
              width={width}
              height={height}
              role="img"
              aria-label={accessibleName}
              className="block h-auto w-full max-w-none"
              style={{ minWidth: `${width}px` }}
            >
              {monthLabels.map((item) => (
                <text
                  key={`${item.label}-${item.x}`}
                  x={item.x}
                  y={12}
                  fontSize={11}
                  fill="var(--ink-3)"
                  fontFamily="var(--font-sans)"
                >
                  {item.label}
                </text>
              ))}
              {["Mon", "Wed", "Fri"].map((label, i) => (
                <text
                  key={label}
                  x={0}
                  y={TOP + (1 + i * 2) * STEP + CELL - 2}
                  fontSize={11}
                  fill="var(--ink-3)"
                  fontFamily="var(--font-sans)"
                >
                  {label}
                </text>
              ))}
              {paths.map((d, level) =>
                d.length ? (
                  <path key={level} d={d.join("")} fill={LEVELS[level]} />
                ) : null,
              )}
            </svg>
          </RevealOnce>
          <div
            className="mt-4 flex items-center justify-end gap-1.5 text-caption text-ink-3"
            aria-hidden="true"
          >
            <span className="mr-1">Less</span>
            {LEVELS.map((color) => (
              <span
                key={color}
                className="inline-block size-[11px] rounded-[2px]"
                style={{ backgroundColor: color }}
              />
            ))}
            <span className="ml-1">More</span>
          </div>
        </div>
      </div>
      <p className="mt-3 text-small text-ink-3">
        {calendar.source === "github"
          ? "From the GitHub API, refreshed daily."
          : "Public GitHub data, refreshed daily."}
      </p>
      <p className="sr-only">{accessibleName}</p>
    </div>
  );
}
