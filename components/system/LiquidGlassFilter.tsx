/**
 * SVG displacement filter that gives the nav a genuine liquid-glass refraction
 * — it ripples/bends the real content scrolling behind the bar, which plain
 * `backdrop-filter: blur()` cannot do. Rendered once, referenced by the
 * `.glass-liquid` class via `backdrop-filter: url(#nav-liquid)`.
 *
 * Chromium honours SVG filters in backdrop-filter; Safari/Firefox treat the
 * `url()` value as invalid and quietly fall back to the plain `.glass` blur —
 * so this is a progressive enhancement with a safe floor.
 */
export function LiquidGlassFilter() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      style={{ position: "absolute", width: 0, height: 0, pointerEvents: "none" }}
    >
      <defs>
        <filter
          id="nav-liquid"
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
          colorInterpolationFilters="sRGB"
        >
          {/* Smooth low-frequency noise = the glass's uneven surface. */}
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.008 0.016"
            numOctaves={2}
            seed={11}
            result="noise"
          />
          {/* Soften the backdrop first, then bend it through the noise so the
              content behind the bar warps like it's seen through liquid glass. */}
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="soft" />
          <feDisplacementMap
            in="soft"
            in2="noise"
            scale="16"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}
