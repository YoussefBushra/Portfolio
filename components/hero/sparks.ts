/**
 * The portal's energy edge: a spinning hexagonal aperture of plasma with
 * electric arcs crackling along its sides, shedding sparks that cool from
 * white-hot into the destination view's colour. Sparks don't fall like embers — they are flung
 * off the ring and bleed their speed away. On dark backgrounds everything
 * blends additively (it glows); on light ones it draws normally so it stays
 * visible.
 *
 * No canvas shadows (slow without a GPU): glow is a wide faint stroke under a
 * thin bright one. It only draws while the finale plays — the caller drives
 * `frame()` from GSAP's ticker and calls `clear()` when done.
 */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  size: number;
}

export interface PortalState {
  /** Aperture centre and circumradius in CSS px, in canvas space. */
  cx: number;
  cy: number;
  r: number;
  /** Aperture rotation, radians. */
  rot: number;
  /** 0–1 visibility of the energy edge itself. */
  ring: number;
  /** 0–1 darkening around the portal. */
  dim: number;
  /** Particles emitted per second along the edge. */
  rate: number;
  /** +1 clockwise, −1 counter-clockwise. */
  spin: number;
}

/** The aperture's six corners (the first one points up at rot = 0). */
export function hexCorners(cx: number, cy: number, r: number, rot: number) {
  return Array.from({ length: 6 }, (_, i) => {
    const a = rot - Math.PI / 2 + (i * Math.PI) / 3;
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r] as const;
  });
}

export class Sparks {
  private ctx: CanvasRenderingContext2D;
  private ps: Particle[] = [];
  private dpr: number;
  private carry = 0;
  private rgb: [number, number, number] = [255, 255, 255];

  constructor(
    private canvas: HTMLCanvasElement,
    private dark: boolean,
    private max: number,
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

  /** Sparks radiating from the edge (the aperture flaring shut). */
  burst(cx: number, cy: number, r: number, count: number) {
    for (let i = 0; i < count && this.ps.length < this.max; i++) {
      const a = Math.random() * Math.PI * 2;
      const speed = 280 + Math.random() * 460;
      this.ps.push({
        x: cx + Math.cos(a) * r,
        y: cy + Math.sin(a) * r,
        vx: Math.cos(a) * speed,
        vy: Math.sin(a) * speed,
        life: 0,
        max: 0.3 + Math.random() * 0.4,
        size: 1 + Math.random() * 1.4,
      });
    }
  }

  private hex(s: PortalState, r = s.r) {
    const { ctx } = this;
    ctx.beginPath();
    hexCorners(s.cx, s.cy, r, s.rot).forEach(([x, y], i) =>
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

  frame(dt: number, s: PortalState) {
    const { ctx, dpr } = this;
    const w = this.canvas.width / dpr;
    const h = this.canvas.height / dpr;

    // Emit along the edges: flung along the side (the aperture spins) and
    // outward.
    if (s.rate > 0 && s.r > 2) {
      const cs = hexCorners(s.cx, s.cy, s.r, s.rot);
      this.carry += s.rate * dt;
      while (this.carry >= 1 && this.ps.length < this.max) {
        this.carry -= 1;
        const i = Math.floor(Math.random() * 6);
        const [a, b] = [cs[i], cs[(i + 1) % 6]];
        const u = Math.random();
        const x = a[0] + (b[0] - a[0]) * u;
        const y = a[1] + (b[1] - a[1]) * u;
        const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
        const tx = ((b[0] - a[0]) / len) * s.spin;
        const ty = ((b[1] - a[1]) / len) * s.spin;
        const ox = (x - s.cx) / s.r;
        const oy = (y - s.cy) / s.r;
        const along = 200 + Math.random() * 260;
        const out = 20 + Math.random() * 110;
        this.ps.push({
          x,
          y,
          vx: tx * along + ox * out,
          vy: ty * along + oy * out,
          life: 0,
          max: 0.25 + Math.random() * 0.4,
          size: 0.7 + Math.random() * 1.3,
        });
      }
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    // The room darkens around the portrait — but not inside the portal, which
    // is a bright window onto the other side. Fully transparent before the
    // canvas edge, so the dim never shows a square boundary.
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
      const a = s.dim * (this.dark ? 0.55 : 0.4);
      g.addColorStop(0, `rgba(5,9,13,${a})`);
      g.addColorStop(0.55, `rgba(5,9,13,${a * 0.7})`);
      g.addColorStop(1, "rgba(5,9,13,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      if (s.r > 1) {
        ctx.globalCompositeOperation = "destination-out";
        this.hex(s);
        ctx.fill();
      }
    }

    ctx.globalCompositeOperation = this.dark ? "lighter" : "source-over";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // The energy edge: a wide soft band, a hot core, and arcs crackling on it.
    if (s.ring > 0.01 && s.r > 2) {
      ctx.strokeStyle = this.heat(0, 0.28 * s.ring);
      ctx.lineWidth = 9;
      this.hex(s);
      ctx.stroke();
      ctx.strokeStyle = this.heat(1, 0.95 * s.ring);
      ctx.lineWidth = 1.8;
      this.hex(s, s.r + (Math.random() - 0.5) * 1.5);
      ctx.stroke();

      const cs = hexCorners(s.cx, s.cy, s.r, s.rot);
      const arcs = 2 + Math.floor(Math.random() * 3);
      for (let k = 0; k < arcs; k++) {
        const i = Math.floor(Math.random() * 6);
        const u0 = Math.random() * 0.6;
        const u1 = u0 + 0.25 + Math.random() * 0.4;
        const [a, b] = [cs[i], cs[(i + 1) % 6]];
        ctx.strokeStyle = this.heat(0.2, 0.3 * s.ring);
        ctx.lineWidth = 4;
        this.arc(a, b, u0, Math.min(1, u1), 14);
        ctx.strokeStyle = this.heat(1, 0.9 * s.ring);
        ctx.lineWidth = 1;
        this.arc(a, b, u0, Math.min(1, u1), 14);
      }
      // Hot corners.
      ctx.fillStyle = this.heat(1, 0.9 * s.ring);
      for (const [x, y] of cs) {
        ctx.beginPath();
        ctx.arc(x, y, 2.4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Sparks: drag only, then a streak along the velocity.
    const alive: Particle[] = [];
    for (const p of this.ps) {
      p.life += dt;
      if (p.life >= p.max) continue;
      p.vx *= 1 - 2.2 * dt;
      p.vy *= 1 - 2.2 * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;

      const t = p.life / p.max;
      ctx.strokeStyle = this.heat(1 - t, (1 - t) * 0.95);
      ctx.lineWidth = p.size * (1 - t * 0.5);
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x - p.vx * 0.024, p.y - p.vy * 0.024);
      ctx.stroke();
      alive.push(p);
    }
    this.ps = alive;
  }

  get active() {
    return this.ps.length > 0;
  }

  clear() {
    this.ps = [];
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
