/**
 * The portal on the portrait: a spinning hexagonal aperture with a plasma
 * rim and electric arcs crackling along its sides, and, inside it, a warp
 * tunnel — hexagons rushing out of the depth around a bright core — through
 * which the other photo arrives. Sparks shower off the rim into the page-wide
 * spark field (they're free to fall across the page, not clipped to here).
 *
 * No canvas shadows (slow without a GPU): glow is a wide faint stroke under a
 * thin bright one. It only draws while the finale plays — the caller drives
 * `frame()` from GSAP's ticker and calls `clear()` when done.
 */

export interface PortalState {
  /** Aperture centre and circumradius in CSS px, in canvas space. */
  cx: number;
  cy: number;
  r: number;
  /** Aperture rotation, radians. */
  rot: number;
  /** 0–1 visibility of the rim. */
  ring: number;
  /** 0–1 visibility of the warp tunnel inside the aperture. */
  tunnel: number;
  /** 0–1 darkening around the portal. */
  dim: number;
  /** Sparks shed per second along the rim. */
  rate: number;
  /** +1 clockwise, −1 counter-clockwise. */
  spin: number;
  /** The photo frame in canvas space: the tunnel stays inside it. */
  frame: { x: number; y: number; w: number; h: number; radius: number };
}

/** Where sparks go: canvas-space point and velocity. */
export type Emit = (x: number, y: number, vx: number, vy: number) => void;

/** The aperture's six corners (the first one points up at rot = 0). */
export function hexCorners(cx: number, cy: number, r: number, rot: number) {
  return Array.from({ length: 6 }, (_, i) => {
    const a = rot - Math.PI / 2 + (i * Math.PI) / 3;
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r] as const;
  });
}

const RINGS = 4; // tunnel hexagons in flight

export class Portal {
  private ctx: CanvasRenderingContext2D;
  private dpr: number;
  private carry = 0;
  private depth = 0;
  private rgb: [number, number, number] = [255, 255, 255];

  constructor(
    private canvas: HTMLCanvasElement,
    private dark: boolean,
    private emit: Emit,
  ) {
    this.ctx = canvas.getContext("2d")!;
    this.dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = Math.round(width * this.dpr);
    canvas.height = Math.round(height * this.dpr);
  }

  /** The destination colour, as "r g b". */
  tint(rgb: string) {
    const [r, g, b] = rgb.trim().split(/\s+/).map(Number);
    this.rgb = [r, g, b];
  }

  /** Colour at heat h (1 = white-hot, 0 = the plain tint), with alpha. */
  private heat(h: number, a: number) {
    const [r, g, b] = this.rgb;
    // On light pages, white-hot would vanish: stay in the (darker) tint.
    const k = this.dark ? h * 0.85 : 0;
    const mix = (c: number) => Math.round(c + (255 - c) * k);
    return `rgba(${mix(r)},${mix(g)},${mix(b)},${a})`;
  }

  /** The tint washed toward white by k (0 = tint, 1 = white), with alpha. */
  private pale(k: number, a: number) {
    const mix = (c: number) => Math.round(c + (255 - c) * k);
    const [r, g, b] = this.rgb;
    return `rgba(${mix(r)},${mix(g)},${mix(b)},${a})`;
  }

  private hex(s: PortalState, r = s.r, rot = s.rot) {
    const { ctx } = this;
    ctx.beginPath();
    hexCorners(s.cx, s.cy, r, rot).forEach(([x, y], i) =>
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y),
    );
    ctx.closePath();
  }

  /** A jagged electric arc along part of one side of the aperture. */
  private arc(
    a: readonly [number, number],
    b: readonly [number, number],
    u0: number,
    u1: number,
    amp: number,
  ) {
    const { ctx } = this;
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;
    const steps = 8;
    ctx.beginPath();
    for (let i = 0; i <= steps; i++) {
      const u = u0 + ((u1 - u0) * i) / steps;
      const j = i === 0 || i === steps ? 0 : (Math.random() - 0.5) * amp;
      const x = a[0] + dx * u + nx * j;
      const y = a[1] + dy * u + ny * j;
      if (i) ctx.lineTo(x, y);
      else ctx.moveTo(x, y);
    }
    ctx.stroke();
  }

  /** Hexagons rushing out of the depth, twisting, around a bright core. On
   *  dark pages it is a dark well; on light pages, a pale field of light. */
  private tunnel(s: PortalState, dt: number) {
    const { ctx } = this;
    const a = s.tunnel;
    this.depth = (this.depth + dt * 1.5) % 1;

    ctx.save();
    // Inside the aperture, and inside the photo: the tunnel is in the photo,
    // only the rim reaches out to the gate.
    const f = s.frame;
    ctx.beginPath();
    ctx.roundRect(f.x, f.y, f.w, f.h, f.radius);
    ctx.clip();
    this.hex(s);
    ctx.clip();
    ctx.globalCompositeOperation = "source-over";
    const g = ctx.createRadialGradient(s.cx, s.cy, 0, s.cx, s.cy, s.r);
    if (this.dark) {
      g.addColorStop(0, `rgba(0,0,0,${0.95 * a})`);
      g.addColorStop(1, `rgba(4,10,16,${0.85 * a})`);
    } else {
      g.addColorStop(0, `rgba(255,255,255,${0.97 * a})`);
      g.addColorStop(1, this.pale(0.78, 0.92 * a));
    }
    ctx.fillStyle = g;
    ctx.fillRect(s.cx - s.r, s.cy - s.r, s.r * 2, s.r * 2);

    ctx.globalCompositeOperation = this.dark ? "lighter" : "source-over";
    ctx.lineJoin = "round";
    for (let k = 0; k < RINGS; k++) {
      const z = (k + this.depth) / RINGS; // 0 = far, 1 = at the rim
      const r = s.r * Math.pow(z, 2.2);
      if (r < 2) continue;
      const twist = s.rot + (1 - z) * 0.6 * s.spin;
      ctx.strokeStyle = this.heat(0.4 + z * 0.6, a * z * 0.85);
      ctx.lineWidth = 0.8 + z * 1.4;
      this.hex(s, r, twist);
      ctx.stroke();
    }
    // The bright core at the far end.
    const eye = ctx.createRadialGradient(s.cx, s.cy, 0, s.cx, s.cy, s.r * 0.24);
    if (this.dark) {
      eye.addColorStop(0, this.heat(1, 0.9 * a));
      eye.addColorStop(1, this.heat(0.5, 0));
    } else {
      eye.addColorStop(0, `rgba(255,255,255,${a})`);
      eye.addColorStop(0.45, this.pale(0.35, 0.55 * a));
      eye.addColorStop(1, this.pale(0.6, 0));
    }
    ctx.fillStyle = eye;
    ctx.fillRect(s.cx - s.r, s.cy - s.r, s.r * 2, s.r * 2);
    ctx.restore();
  }

  frame(dt: number, s: PortalState) {
    const { ctx, dpr } = this;
    const w = this.canvas.width / dpr;
    const h = this.canvas.height / dpr;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    // On dark pages the room darkens around the portrait; on light ones a
    // grey dim would just look dirty, so the air takes on the portal's tint
    // instead. Never inside the portal, and fully transparent before the
    // canvas edge, so it never shows a square boundary.
    if (s.dim > 0.01) {
      ctx.globalCompositeOperation = "source-over";
      const g = ctx.createRadialGradient(
        s.cx,
        s.cy,
        0,
        s.cx,
        s.cy,
        Math.min(w, h) * 0.48,
      );
      const a = s.dim * (this.dark ? 0.55 : 0.16);
      const tone = (x: number) =>
        this.dark ? `rgba(5,9,13,${x})` : this.pale(0.2, x);
      g.addColorStop(0, tone(a));
      g.addColorStop(0.55, tone(a * 0.6));
      g.addColorStop(1, tone(0));
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      if (s.r > 1) {
        ctx.globalCompositeOperation = "destination-out";
        this.hex(s);
        ctx.fill();
      }
    }

    if (s.r > 2 && s.tunnel > 0.01) this.tunnel(s, dt);

    ctx.globalCompositeOperation = this.dark ? "lighter" : "source-over";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (s.ring > 0.01 && s.r > 2) {
      // The rim: a wide soft band, a hot core, arcs crackling on it.
      ctx.strokeStyle = this.heat(0, 0.3 * s.ring);
      ctx.lineWidth = 10;
      this.hex(s);
      ctx.stroke();
      ctx.strokeStyle = this.heat(1, 0.95 * s.ring);
      ctx.lineWidth = 2;
      this.hex(s, s.r + (Math.random() - 0.5) * 1.5);
      ctx.stroke();

      const cs = hexCorners(s.cx, s.cy, s.r, s.rot);
      const arcs = 1 + Math.floor(Math.random() * 2);
      for (let k = 0; k < arcs; k++) {
        const i = Math.floor(Math.random() * 6);
        const u0 = Math.random() * 0.6;
        const u1 = Math.min(1, u0 + 0.25 + Math.random() * 0.4);
        const [a, b] = [cs[i], cs[(i + 1) % 6]];
        ctx.strokeStyle = this.heat(0.2, 0.3 * s.ring);
        ctx.lineWidth = 4;
        this.arc(a, b, u0, u1, 14);
        ctx.strokeStyle = this.heat(1, 0.9 * s.ring);
        ctx.lineWidth = 1;
        this.arc(a, b, u0, u1, 14);
      }
      // Hot corners.
      ctx.fillStyle = this.heat(1, 0.95 * s.ring);
      for (const [x, y] of cs) {
        ctx.beginPath();
        ctx.arc(x, y, 2.6, 0, Math.PI * 2);
        ctx.fill();
      }

      // Sparks shower off the rim: flung along the side as it spins, out
      // from the centre, and then they fall.
      if (s.rate > 0) {
        this.carry += s.rate * dt;
        while (this.carry >= 1) {
          this.carry -= 1;
          const i = Math.floor(Math.random() * 6);
          const [a, b] = [cs[i], cs[(i + 1) % 6]];
          // Corners spit the most.
          const u =
            Math.random() < 0.35 ? Math.round(Math.random()) : Math.random();
          const x = a[0] + (b[0] - a[0]) * u;
          const y = a[1] + (b[1] - a[1]) * u;
          const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
          const along = (160 + Math.random() * 260) * s.spin;
          const out = 60 + Math.random() * 180;
          const ox = (x - s.cx) / s.r;
          const oy = (y - s.cy) / s.r;
          this.emit(
            x,
            y,
            ((b[0] - a[0]) / len) * along + ox * out,
            ((b[1] - a[1]) / len) * along + oy * out - 60,
          );
        }
      }
    }
    ctx.globalCompositeOperation = "source-over";
  }

  clear() {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
