"use client";

/**
 * Compact architecture-diagram preview for a project card. Data-driven: a list
 * of vertical layers (columns), each a list of short node labels. Nodes connect
 * fully between adjacent layers with thin lines — the visual language of the
 * hero diagram, scaled down and decorative.
 */
export function MiniDiagram({
  layers,
  className,
}: {
  layers: string[][];
  className?: string;
}) {
  const W = 300;
  const H = 150;
  const padX = 42;
  const colGap = layers.length > 1 ? (W - padX * 2) / (layers.length - 1) : 0;
  const nodeW = (label: string) => Math.max(46, label.length * 6.5 + 16);

  const pos = layers.map((col, ci) =>
    col.map((label, ni) => {
      const raw = layers.length === 1 ? W / 2 : padX + ci * colGap;
      const half = nodeW(label) / 2;
      // Keep every node fully inside the viewBox.
      const x = Math.min(Math.max(raw, half + 4), W - half - 4);
      const slot = (H / (col.length + 1)) * (ni + 1);
      return { x, y: slot, label };
    })
  );

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={className}
      role="img"
      aria-label="Architecture preview"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* edges between adjacent layers */}
      <g stroke="rgb(var(--border))" strokeWidth="1" fill="none" opacity="0.7">
        {pos.slice(0, -1).map((col, ci) =>
          col.flatMap((a) =>
            pos[ci + 1].map((b, bi) => (
              <line
                key={`${ci}-${a.label}-${bi}`}
                x1={a.x + 6}
                y1={a.y}
                x2={b.x - 6}
                y2={b.y}
                strokeDasharray="2 4"
              />
            ))
          )
        )}
      </g>

      {/* nodes */}
      {pos.flat().map((n, i) => {
        const w = nodeW(n.label);
        return (
          <g key={i} transform={`translate(${n.x - w / 2}, ${n.y - 11})`}>
            <rect
              width={w}
              height={22}
              rx={6}
              fill="rgb(var(--surface-2))"
              stroke="rgb(var(--border))"
              strokeWidth="1"
            />
            <circle cx={9} cy={11} r={2.4} fill="rgb(var(--accent) / 0.7)" />
            <text
              x={17}
              y={12}
              fontSize="8.5"
              fill="rgb(var(--muted))"
              dominantBaseline="middle"
              fontFamily="var(--font-mono)"
            >
              {n.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
