import { Fragment, useId } from "react";

export type DiagramNode = {
  id: string;
  label: string;
  sub?: string;
  /** Centre position in viewBox units. */
  x: number;
  y: number;
  w?: number;
};

export type DiagramEdge = {
  from: string;
  to: string;
  label?: string;
  dashed?: boolean;
};

type DiagramProps = {
  title: string;
  /** Plain-text description; shown as the caption and read by screen readers. */
  description: string;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  width?: number;
  height?: number;
};

const NODE_H = 64;
const DEFAULT_W = 168;

/** Where the line from a node's centre towards (dx, dy) leaves its box. */
function exit(node: DiagramNode, dx: number, dy: number, gap: number) {
  const halfW = (node.w ?? DEFAULT_W) / 2 + gap;
  const halfH = NODE_H / 2 + gap;
  const t = Math.min(
    dx === 0 ? Infinity : halfW / Math.abs(dx),
    dy === 0 ? Infinity : halfH / Math.abs(dy),
  );
  return { x: node.x + dx * t, y: node.y + dy * t };
}

/**
 * Architecture diagram as inline SVG: rounded boxes and sky arrows, real text
 * so it stays sharp and searchable. On narrow screens it scrolls sideways in
 * its own focusable region rather than shrinking the text.
 */
export function Diagram({
  title,
  description,
  nodes,
  edges,
  width = 960,
  height = 320,
}: DiagramProps) {
  const id = useId();
  const byId = new Map(nodes.map((node) => [node.id, node]));

  return (
    <figure className="my-16">
      <div
        className="overflow-x-auto rounded-xl border border-line bg-surface p-2"
        tabIndex={0}
        role="region"
        aria-label={`${title} (scrolls sideways on small screens)`}
      >
        <svg
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-labelledby={`${id}-title ${id}-desc`}
          className="block h-auto w-full"
          style={{ minWidth: `${Math.round(width * 0.72)}px` }}
        >
          <title id={`${id}-title`}>{title}</title>
          <desc id={`${id}-desc`}>{description}</desc>
          <defs>
            <marker
              id={`${id}-arrow`}
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="8"
              markerHeight="8"
              orient="auto-start-reverse"
            >
              <path d="M0 0L10 5L0 10z" fill="var(--sky)" />
            </marker>
          </defs>

          {edges.map((edge) => {
            const from = byId.get(edge.from);
            const to = byId.get(edge.to);
            if (!from || !to)
              throw new Error(
                `Diagram "${title}": unknown node in edge ${edge.from} to ${edge.to}`,
              );
            const dx = to.x - from.x;
            const dy = to.y - from.y;
            const start = exit(from, dx, dy, 4);
            const end = exit(to, -dx, -dy, 6);
            const mid = { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 };
            return (
              <Fragment key={`${edge.from}-${edge.to}`}>
                <line
                  x1={start.x}
                  y1={start.y}
                  x2={end.x}
                  y2={end.y}
                  stroke="var(--sky)"
                  strokeWidth={1.5}
                  strokeDasharray={edge.dashed ? "5 5" : undefined}
                  markerEnd={`url(#${id}-arrow)`}
                />
                {edge.label && (
                  <text
                    x={mid.x}
                    y={mid.y - 8}
                    textAnchor="middle"
                    fontSize={12}
                    fill="var(--ink-2)"
                    fontFamily="var(--font-mono)"
                  >
                    {edge.label}
                  </text>
                )}
              </Fragment>
            );
          })}

          {nodes.map((node) => {
            const w = node.w ?? DEFAULT_W;
            return (
              <g key={node.id}>
                <rect
                  x={node.x - w / 2}
                  y={node.y - NODE_H / 2}
                  width={w}
                  height={NODE_H}
                  rx={10}
                  fill="var(--paper)"
                  stroke="var(--line-strong)"
                />
                <text
                  x={node.x}
                  y={node.sub ? node.y - 4 : node.y + 5}
                  textAnchor="middle"
                  fontSize={15}
                  fontWeight={600}
                  fill="var(--ink)"
                  fontFamily="var(--font-sans)"
                >
                  {node.label}
                </text>
                {node.sub && (
                  <text
                    x={node.x}
                    y={node.y + 16}
                    textAnchor="middle"
                    fontSize={12}
                    fill="var(--ink-2)"
                    fontFamily="var(--font-sans)"
                  >
                    {node.sub}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
      <figcaption className="mt-3 max-w-(--measure) text-small text-ink-2">
        <span className="font-semibold text-ink">{title}.</span> {description}
      </figcaption>
    </figure>
  );
}
