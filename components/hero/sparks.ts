/**
 * The portal's energy ring: a spinning ring of plasma with electric arcs
 * crackling along it, shedding sparks that cool from white-hot into the
 * destination view's colour. Sparks don't fall like embers — they are flung
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
  /** Portal centre and radius in CSS px, in canvas space. */
  cx: number;
  cy: number;
  r: number;
  /** 0–1 visibility of the energy ring itself. */
  ring: number;
  /** 0–1 darkening around the portal. */
  dim: number;
  /** Particles emitted per second along the ring. */
  rate: number;
  /** +1 clockwise, −1 counter-clockwise. */
  spin: number;
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

  /** Sparks radiating from the ring (the portal flaring shut). */
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

  /** A jagged electric arc hugging the ring between two angles. */
  private arc(s: PortalState, a0: number, span: number, amp: number) {
    const { ctx } = this;
    const steps = 9;
    ctx.beginPath();
    for (let i = 0; i <= steps; i++) {
      const a = a0 + (span * i) / steps;
      const edge = i === 0 || i === steps;
      const r = s.r + (edge ? 0 : (Math.random() - 0.5) * amp);
      const x = s.cx + Math.cos(a) * r;
      const y = s.cy + Math.sin(a) * r;
      if (i) ctx.lineTo(x, y);
      else ctx.moveTo(x, y);
    }
    ctx.stroke();
  }

  frame(dt: number, s: PortalState) {
    const { ctx, dpr } = this;
    const w = this.canvas.width / dpr;
    const h = this.canvas.height / dpr;

    // Emit along the ring: flung tangentially (the ring spins) and outward.
    if (s.rate > 0 && s.r > 2) {
      this.carry += s.rate * dt;
      while (this.carry >= 1 && this.ps.length < this.max) {
        this.carry -= 1;
        const a = Math.random() * Math.PI * 2;
        const tan = (200 + Math.random() * 260) * s.spin;
        const out = 20 + Math.random() * 110;
        this.ps.push({
          x: s.cx + Math.cos(a) * s.r,
          y: s.cy + Math.sin(a) * s.r,
          vx: -Math.sin(a) * tan + Math.cos(a) * out,
          vy: Math.cos(a) * tan + Math.sin(a) * out,
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
        ctx.beginPath();
        ctx.arc(s.cx, s.cy, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.globalCompositeOperation = this.dark ? "lighter" : "source-over";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // The energy ring: a wide soft band, a hot core, and arcs crackling on it.
    if (s.ring > 0.01 && s.r > 2) {
      ctx.strokeStyle = this.heat(0, 0.28 * s.ring);
      ctx.lineWidth = 9;
      ctx.beginPath();
      ctx.arc(s.cx, s.cy, s.r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = this.heat(1, 0.95 * s.ring);
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(s.cx, s.cy, s.r + (Math.random() - 0.5) * 1.5, 0, Math.PI * 2);
      ctx.stroke();

      const arcs = 2 + Math.floor(Math.random() * 3);
      for (let i = 0; i < arcs; i++) {
        const a0 = Math.random() * Math.PI * 2;
        const span = (0.25 + Math.random() * 0.45) * s.spin;
        ctx.strokeStyle = this.heat(0.2, 0.3 * s.ring);
        ctx.lineWidth = 4;
        this.arc(s, a0, span, 16);
        ctx.strokeStyle = this.heat(1, 0.9 * s.ring);
        ctx.lineWidth = 1;
        this.arc(s, a0, span, 16);
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
