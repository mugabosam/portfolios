/**
 * Decorative illustration for the featured project: an abstract binary
 * tree (not the real trained tree, which the case study links to).
 */
export function DecisionTreeArt() {
  const levels = 4;
  const nodes: { x: number; y: number; level: number }[] = [];
  const edges: [number, number, number, number][] = [];
  for (let level = 0; level < levels; level++) {
    const count = 2 ** level;
    for (let i = 0; i < count; i++) {
      const x = ((i + 0.5) / count) * 400;
      const y = 50 + level * 100;
      nodes.push({ x, y, level });
      if (level > 0) {
        const parentX = ((Math.floor(i / 2) + 0.5) / 2 ** (level - 1)) * 400;
        edges.push([parentX, y - 100, x, y]);
      }
    }
  }
  return (
    <svg
      viewBox="0 0 400 400"
      className="h-auto w-full max-w-md"
      aria-hidden="true"
      focusable="false"
    >
      {edges.map(([x1, y1, x2, y2], i) => (
        <line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="var(--line-strong)"
          strokeWidth="1"
        />
      ))}
      {nodes.map((node, i) => (
        <rect
          key={i}
          x={node.x - (node.level === levels - 1 ? 9 : 14)}
          y={node.y - 9}
          width={node.level === levels - 1 ? 18 : 28}
          height={18}
          fill={
            node.level === levels - 1
              ? i % 3 === 0
                ? "var(--fg)"
                : "var(--bg)"
              : "var(--bg-elevated)"
          }
          stroke="var(--fg-muted)"
          strokeWidth="1"
        />
      ))}
    </svg>
  );
}
