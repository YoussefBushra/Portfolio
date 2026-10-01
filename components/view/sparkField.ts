/**
 * Sparks for the whole view switch, on one fixed canvas over the viewport, so
 * they can fly and fall anywhere: off the charge line along the nav, off the
 * sweeping front, off the portal's rim, and off the work cards as they land.
 *
 * Each spark is a short streak along its velocity that cools from white-hot
 * into the destination view's colour, under gravity and drag. They are drawn
 * in a handful of heat bands — one path per band — so hundreds of sparks
 * cost a few strokes per frame. On dark pages they blend additively (glow);
 * on light ones they draw normally in the plain colour so they stay visible.
 */

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  g: number;
}

export interface SparkOptions {
  /** Lifetime range, seconds. */
  life?: [number, number];
  /** Gravity, px/s². */
  g?: number;
}

const BANDS = 5;

export class SparkField {
  private ctx: CanvasRenderingContext2D;
  private ps: Spark[] = [];
  private dpr = 1;
  private w = 0;
  private h = 0;
  private rgb: [number, number, number] = [255, 255, 255];
  dark = true;

  constructor(
    private canvas: HTMLCanvasElement,
    private max = 700,
  ) {
    this.ctx = canvas.getContext("2d")!;
  }

  /** Size the canvas to the viewport and set the colour (as "r g b"). */
  begin(rgb: string, dark: boolean, max?: number) {
    this.dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    this.canvas.width = Math.round(this.w * this.dpr);
    this.canvas.height = Math.round(this.h * this.dpr);
    const [r, g, b] = rgb.trim().split(/\s+/).map(Number);
    this.rgb = [r, g, b];
    this.dark = dark;
    if (max) this.max = max;
  }

  emit(x: number, y: number, vx: number, vy: number, o: SparkOptions = {}) {
    if (this.ps.length >= this.max) return;
    const [a, b] = o.life ?? [0.3, 0.7];
    this.ps.push({
      x,
      y,
      vx,
      vy,
      life: 0,
      max: a + Math.random() * (b - a),
      g: o.g ?? 800,
    });
  }

  /** Sparks flung in all directions from a point. */
  burst(x: number, y: number, n: number, speed = 320, o: SparkOptions = {}) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const v = speed * (0.35 + Math.random() * 0.65);
      this.emit(x, y, Math.cos(a) * v, Math.sin(a) * v - speed * 0.25, o);
    }
  }

  private color(heat: number, a: number) {
    const [r, g, b] = this.rgb;
    const k = this.dark ? heat * 0.9 : 0;
    const mix = (c: number) => Math.round(c + (255 - c) * k);
    return `rgba(${mix(r)},${mix(g)},${mix(b)},${a})`;
  }

  frame(dt: number) {
    const { ctx, dpr } = this;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, this.w, this.h);
    if (!this.ps.length) return;

    const alive: Spark[] = [];
    const bands: Spark[][] = Array.from({ length: BANDS }, () => []);
    for (const p of this.ps) {
      p.life += dt;
      if (p.life >= p.max) continue;
      p.vy += p.g * dt;
      p.vx *= 1 - 1.4 * dt;
      p.vy *= 1 - 1.4 * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      if (p.y > this.h + 40 || p.x < -40 || p.x > this.w + 40) continue;
      alive.push(p);
      const t = p.life / p.max;
      bands[Math.min(BANDS - 1, Math.floor(t * BANDS))].push(p);
    }
    this.ps = alive;

    ctx.globalCompositeOperation = this.dark ? "lighter" : "source-over";
    ctx.lineCap = "round";
    bands.forEach((group, i) => {
      if (!group.length) return;
      const t = (i + 0.5) / BANDS;
      // A faint wide pass for the glow, then the bright core.
      for (const [width, alpha, heat] of [
        [4, 0.2, 0.3],
        [1.6, 1, 1],
      ] as const) {
        ctx.strokeStyle = this.color((1 - t) * heat, (1 - t) * alpha);
        ctx.lineWidth = width * (1 - t * 0.45);
        ctx.beginPath();
        for (const p of group) {
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - p.vx * 0.028, p.y - p.vy * 0.028);
        }
        ctx.stroke();
      }
    });
    ctx.globalCompositeOperation = "source-over";
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
