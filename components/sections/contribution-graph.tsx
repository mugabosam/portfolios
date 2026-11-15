import { summarize } from "@/lib/github/contributions";
import { getContributionCalendar } from "@/lib/github/fetch-contributions";

const CELL = 11;
const GAP = 3;
const STEP = CELL + GAP;
const LEFT = 30; // weekday labels
const TOP = 20; // month labels

/** White at five opacities: the whole graph stays inside the palette. */
const OPACITY = [0.08, 0.28, 0.5, 0.74, 1] as const;

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
 * A year of GitHub contributions as a monochrome heat map (Sam's request).
 * One path per shade keeps the SVG small (five elements instead of 365), so
 * the home page's HTML and parse time stay low. The headline numbers appear
 * as real text, and the SVG carries them in its accessible name.
 */
export async function ContributionGraph() {
  const calendar = await getContributionCalendar();
  if (!calendar) return null;

  const summary = summarize(calendar);
  const width = LEFT + calendar.weeks.length * STEP;
  const height = TOP + 7 * STEP;

  // One path per level: a tiny square sub-path for each day.
  const paths = OPACITY.map(() => [] as string[]);
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
    { value: number.format(summary.total), label: "Contributions, last year" },
    { value: String(summary.active), label: "Active days" },
    { value: String(summary.longestStreak), label: "Longest streak, days" },
    {
      value: String(summary.busiest.count),
      label: `Busiest day · ${month.format(utc(summary.busiest.date))} ${summary.busiest.date.slice(-2)}`,
    },
  ];

  return (
    <div className="mt-24">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h3 className="font-display text-h4">A year on GitHub</h3>
        <p className="type-label text-fg-muted">
          {calendar.source === "github"
            ? "From the GitHub API, refreshed daily"
            : "Public data, refreshed daily"}
        </p>
      </div>

      <dl className="mt-8 grid grid-cols-2 border-t border-l border-line sm:grid-cols-4">
        {tiles.map((item) => (
          <div
            key={item.label}
            className="flex flex-col gap-2 border-r border-b border-line p-5"
          >
            <dt className="order-2 type-label text-fg-muted">{item.label}</dt>
            <dd className="order-1 font-display text-h3 tabular-nums">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>

      <div
        className="mt-6 overflow-x-auto border border-line bg-bg-elevated p-6"
        tabIndex={0}
        role="region"
        aria-label="Contribution calendar (scrolls sideways on small screens)"
      >
        <svg
          viewBox={`0 0 ${width} ${height}`}
          width={width}
          height={height}
          role="img"
          aria-label={accessibleName}
          className="block h-auto max-w-none"
          style={{ minWidth: `${width}px` }}
        >
          {monthLabels.map((item) => (
            <text
              key={`${item.label}-${item.x}`}
              x={item.x}
              y={12}
              fontSize={11}
              fill="var(--fg-muted)"
              fontFamily="var(--font-mono)"
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
              fill="var(--fg-muted)"
              fontFamily="var(--font-mono)"
            >
              {label}
            </text>
          ))}
          {paths.map((d, level) =>
            d.length ? (
              <path
                key={level}
                d={d.join("")}
                fill="var(--fg)"
                fillOpacity={OPACITY[level]}
              />
            ) : null,
          )}
        </svg>
        <div
          className="mt-4 flex items-center justify-end gap-2 type-label text-fg-muted"
          aria-hidden="true"
        >
          <span>Less</span>
          {OPACITY.map((opacity) => (
            <span
              key={opacity}
              className="inline-block size-[11px] bg-fg"
              style={{ opacity }}
            />
          ))}
          <span>More</span>
        </div>
      </div>
      <p className="sr-only">{accessibleName}</p>
    </div>
  );
}
