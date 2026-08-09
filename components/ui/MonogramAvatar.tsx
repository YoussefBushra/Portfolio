"use client";

import { motion } from "framer-motion";

interface MonogramAvatarProps {
  size?: number;
  className?: string;
}

/**
 * Generated, theme-aware "node-graph" avatar in place of a photo.
 * A central node (the engineer) wired to satellite service-nodes, with
 * initials "YB" at the core. Animation is subtle and respects
 * reduced-motion via Framer Motion's global reduced-motion handling.
 */
export function MonogramAvatar({ size = 220, className }: MonogramAvatarProps) {
  const satellites = [
    { x: 30, y: 30 },
    { x: 170, y: 26 },
    { x: 188, y: 110 },
    { x: 150, y: 182 },
    { x: 58, y: 184 },
    { x: 18, y: 108 },
  ];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      className={className}
      role="img"
      aria-label="Youssef Bushra — node-graph monogram"
    >
      <defs>
        <radialGradient id="core-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgb(var(--accent))" stopOpacity="0.9" />
          <stop offset="100%" stopColor="rgb(var(--accent))" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgb(var(--accent))" />
          <stop offset="100%" stopColor="rgb(var(--accent-2))" />
        </linearGradient>
      </defs>

      {/* connective edges */}
      <g stroke="rgb(var(--accent) / 0.35)" strokeWidth="1">
        {satellites.map((s, i) => (
          <line key={i} x1="100" y1="100" x2={s.x} y2={s.y} />
        ))}
      </g>

      {/* rotating dashed ring */}
      <motion.circle
        cx="100"
        cy="100"
        r="76"
        fill="none"
        stroke="url(#ring)"
        strokeWidth="1.5"
        strokeDasharray="4 10"
        opacity="0.5"
        style={{ transformOrigin: "100px 100px" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 40, ease: "linear", repeat: Infinity }}
      />

      {/* satellite nodes */}
      {satellites.map((s, i) => (
        <motion.circle
          key={i}
          cx={s.x}
          cy={s.y}
          r="5"
          fill="rgb(var(--accent-2))"
          initial={{ opacity: 0.4 }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.4,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* core */}
      <circle cx="100" cy="100" r="46" fill="url(#core-glow)" />
      <circle
        cx="100"
        cy="100"
        r="34"
        fill="rgb(var(--surface))"
        stroke="rgb(var(--accent))"
        strokeWidth="1.5"
      />
      <text
        x="100"
        y="100"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="var(--font-mono)"
        fontSize="26"
        fontWeight="700"
        fill="rgb(var(--text))"
      >
        YB
      </text>
    </svg>
  );
}
