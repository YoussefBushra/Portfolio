/**
 * Sling-ring sparks: a tiny particle system for the portal edge. Particles are
 * drawn as short motion streaks that cool from white-hot through amber to deep
 * orange. On dark backgrounds they blend additively (they glow); on light ones
 * they draw normally in saturated colour so they stay visible.
 *
 * It only draws while a spell is playing — the caller drives `frame()` from
 * GSAP's ticker and calls `clear()` when done.
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
  /** 0–1 visibility of the burning ring itself. */
  ring: number;
  /** 0–1 darkening around the portal ("the room darkens"). */
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

  constructor(
    private canvas: HTMLCanvasElement,
    private dark: boolean,
    private max: number
  ) {
    this.ctx = canvas.getContext("2d")!;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = Math.round(width * this.dpr);
    canvas.height = Math.round(height * this.dpr);
  }

  /** Burst of sparks radiating from a point (the portal flaring shut). */
  burst(cx: number, cy: number, r: number, count: number) {
    for (let i = 0; i < count && this.ps.length < this.max; i++) {
      const a = Math.random() * Math.PI * 2;
      const speed = 260 + Math.random() * 420;
      this.ps.push({
        x: cx + Math.cos(a) * r,
        y: cy + Math.sin(a) * r,
        vx: Math.cos(a) * speed,
        vy: Math.sin(a) * speed,
        life: 0,
        max: 0.35 + Math.random() * 0.45,
        size: 1 + Math.random() * 1.6,
      });
    }
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
        const tan = (180 + Math.random() * 260) * s.spin;
        const out = 30 + Math.random() * 120;
        this.ps.push({
          x: s.cx + Math.cos(a) * s.r,
          y: s.cy + Math.sin(a) * s.r,
          vx: -Math.sin(a) * tan + Math.cos(a) * out,
          vy: Math.cos(a) * tan + Math.sin(a) * out,
          life: 0,
          max: 0.3 + Math.random() * 0.5,
          size: 0.8 + Math.random() * 1.5,
        });
      }
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    // The room darkens around the spell — but not inside the portal, which is
    // a bright window onto the other side.
    if (s.dim > 0.01) {
      ctx.globalCompositeOperation = "source-over";
      // Fully transparent before the stage edge, so the dim never shows a
      // square boundary.
      const g = ctx.createRadialGradient(s.cx, s.cy, 0, s.cx, s.cy, Math.min(w, h) * 0.48);
      const a = s.dim * (this.dark ? 0.55 : 0.42);
      g.addColorStop(0, `rgba(12,8,4,${a})`);
      g.addColorStop(0.55, `rgba(12,8,4,${a * 0.7})`);
      g.addColorStop(1, "rgba(12,8,4,0)");
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

    // The burning ring: a soft outer glow and a hot core, jittered so it
    // flickers like it's made of sparks.
    if (s.ring > 0.01 && s.r > 2) {
      const jitter = () => s.r + (Math.random() - 0.5) * 2.5;
      ctx.lineCap = "round";
      ctx.shadowColor = "rgba(255,150,30,0.9)";
      ctx.shadowBlur = 16;
      ctx.strokeStyle = `rgba(255,140,20,${0.55 * s.ring})`;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(s.cx, s.cy, jitter(), 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 6;
      ctx.strokeStyle = `rgba(255,236,190,${0.95 * s.ring})`;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(s.cx, s.cy, jitter(), 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // Particles: gravity, drag, then a streak along the velocity.
    const alive: Particle[] = [];
    for (const p of this.ps) {
      p.life += dt;
      if (p.life >= p.max) continue;
      p.vy += 520 * dt;
      p.vx *= 1 - 1.6 * dt;
      p.vy *= 1 - 1.6 * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;

      const t = p.life / p.max;
      // white-hot → amber → deep orange, fading out
      const hue = 48 - t * 26;
      const light = this.dark ? 92 - t * 40 : 62 - t * 18;
      const alpha = (1 - t) * (this.dark ? 1 : 0.95);
      ctx.strokeStyle = `hsla(${hue},100%,${light}%,${alpha})`;
      ctx.lineWidth = p.size * (1 - t * 0.5);
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x - p.vx * 0.022, p.y - p.vy * 0.022);
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
