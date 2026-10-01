/**
 * The portrait as a hologram, for the finale of a view switch: corner
 * brackets lock onto the photo and it takes on a holographic tint; a scan
 * beam sweeps down and the old photo derezzes behind it into glitching
 * scanlines; the beam sweeps back up and the new photo materialises line by
 * line; the tint flickers out. Sparks spray from the beam's ends into the
 * page-wide spark field.
 *
 * Both photos are drawn from decoded copies with the same cover-crop as the
 * CSS (`object-cover`, `object-position: 50% 25%`), so the canvas and the
 * real <img> are pixel-identical when they hand over.
 */

export interface HoloState {
  /** 0–1 darkening of the room around it. */
  dim: number;
  /** 0–1 corner brackets locked on. */
  lock: number;
  /** 0–1 holographic tint over the photo. */
  tint: number;
  /** Beam position: 0 = top of the frame, 1 = bottom. */
  beam: number;
  /** 0–1 beam visibility. */
  beamOn: number;
  /**
   * "old"/"new": that photo, whole. "out": the old photo derezzes above the
   * beam. "in": the new photo materialises below the beam.
   */
  mode: "old" | "out" | "in" | "new";
}

/** The photo frame in canvas space. */
export interface FrameRect {
  x: number;
  y: number;
  w: number;
  h: number;
  radius: number;
}

/** Where sparks go: canvas-space point and velocity. */
export type Emit = (x: number, y: number, vx: number, vy: number) => void;

interface Cover {
  scale: number;
  ox: number;
  oy: number;
}

function cover(img: HTMLImageElement, w: number, h: number): Cover {
  const nw = img.naturalWidth || w;
  const nh = img.naturalHeight || h;
  const scale = Math.max(w / nw, h / nh);
  return { scale, ox: (w - nw * scale) * 0.5, oy: (h - nh * scale) * 0.25 };
}

const ROW = 3; // scanline height, CSS px
const BAND = 30; // half-height of the glitch band around the beam
const OVERHANG = 22; // how far the beam reaches past the frame's sides

export class Hologram {
  private ctx: CanvasRenderingContext2D;
  private dpr: number;
  private rgb: [number, number, number] = [255, 255, 255];
  private cf: Cover;
  private ct: Cover;
  private rows: { seed: number; trace: boolean; x0: number; x1: number }[];
  private jitter: number[];
  private sinceJitter = 0;
  private carry = 0;
  private lastBeam = 0;
  private dimLayer: HTMLCanvasElement | null = null;

  constructor(
    private canvas: HTMLCanvasElement,
    private f: FrameRect,
    private from: HTMLImageElement,
    private to: HTMLImageElement,
    private emit: Emit,
  ) {
    this.ctx = canvas.getContext("2d")!;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = Math.round(width * this.dpr);
    canvas.height = Math.round(height * this.dpr);
    this.cf = cover(from, f.w, f.h);
    this.ct = cover(to, f.w, f.h);
    const n = Math.ceil(f.h / ROW);
    this.rows = Array.from({ length: n }, () => {
      const a = Math.random();
      const b = Math.random();
      return {
        seed: Math.random(),
        trace: Math.random() < 0.3,
        x0: Math.min(a, b),
        x1: Math.max(a, b),
      };
    });
    this.jitter = this.rows.map(() => Math.random() * 2 - 1);
  }

  /** The destination colour, as "r g b". */
  tint(rgb: string) {
    const [r, g, b] = rgb.trim().split(/\s+/).map(Number);
    this.rgb = [r, g, b];
  }

  /** The tint, washed toward white by k (0 = tint, 1 = white). */
  private color(k: number, a: number) {
    const mix = (c: number) => Math.round(c + (255 - c) * k);
    const [r, g, b] = this.rgb;
    return `rgba(${mix(r)},${mix(g)},${mix(b)},${a})`;
  }

  /** Rows y0…y1 (frame px) of a photo, shifted sideways by dx. */
  private strip(
    img: HTMLImageElement,
    c: Cover,
    y0: number,
    y1: number,
    dx = 0,
  ) {
    if (y1 <= y0) return;
    const { f } = this;
    this.ctx.drawImage(
      img,
      -c.ox / c.scale,
      (y0 - c.oy) / c.scale,
      f.w / c.scale,
      (y1 - y0) / c.scale,
      f.x + dx,
      f.y + y0,
      f.w,
      y1 - y0,
    );
  }

  /** The derezzed state: an empty projection field with a few stray
   *  scanlines left behind. */
  private void(y0: number, y1: number) {
    if (y1 <= y0) return;
    const { ctx, f } = this;
    ctx.fillStyle = "rgba(4,8,12,0.94)";
    ctx.fillRect(f.x, f.y + y0, f.w, y1 - y0);
    ctx.fillStyle = this.color(0.3, 0.45);
    const i0 = Math.max(0, Math.floor(y0 / ROW));
    const i1 = Math.min(this.rows.length, Math.ceil(y1 / ROW));
    for (let i = i0; i < i1; i++) {
      const r = this.rows[i];
      if (!r.trace || Math.random() < 0.15) continue;
      ctx.fillRect(f.x + r.x0 * f.w, f.y + i * ROW, (r.x1 - r.x0) * f.w, 1);
    }
  }

  /** A row of a photo in the glitch band: shifted by up to `amp` px. */
  private row(img: HTMLImageElement, c: Cover, i: number, amp: number) {
    const y = i * ROW;
    this.strip(img, c, y, Math.min(this.f.h, y + ROW), this.jitter[i] * amp);
  }

  frame(dt: number, s: HoloState) {
    const { ctx, dpr, f } = this;
    const w = this.canvas.width / dpr;
    const h = this.canvas.height / dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.globalCompositeOperation = "source-over";

    // Fresh glitch offsets a dozen times a second: a flicker, not a blur.
    this.sinceJitter += dt;
    if (this.sinceJitter > 0.07) {
      this.sinceJitter = 0;
      for (let i = 0; i < this.jitter.length; i++)
        this.jitter[i] = Math.random() * 2 - 1;
    }

    // Around the portrait, the room darkens. The gradient is rendered once
    // and stamped with the current strength — far cheaper than re-filling a
    // radial gradient across the whole stage every frame.
    if (s.dim > 0.01) {
      if (!this.dimLayer) {
        const layer = document.createElement("canvas");
        layer.width = this.canvas.width;
        layer.height = this.canvas.height;
        const lc = layer.getContext("2d")!;
        lc.setTransform(dpr, 0, 0, dpr, 0, 0);
        const cx = f.x + f.w / 2;
        const cy = f.y + f.h * 0.42;
        const g = lc.createRadialGradient(
          cx,
          cy,
          0,
          cx,
          cy,
          Math.min(w, h) * 0.48,
        );
        g.addColorStop(0, "rgba(5,9,13,0.5)");
        g.addColorStop(0.55, "rgba(5,9,13,0.3)");
        g.addColorStop(1, "rgba(5,9,13,0)");
        lc.fillStyle = g;
        lc.fillRect(0, 0, w, h);
        this.dimLayer = layer;
      }
      ctx.globalAlpha = Math.min(1, s.dim);
      ctx.drawImage(this.dimLayer, 0, 0, w, h);
      ctx.globalAlpha = 1;
    }

    // The photo, inside the frame's rounded corners.
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(f.x, f.y, f.w, f.h, f.radius);
    ctx.clip();
    ctx.clearRect(f.x, f.y, f.w, f.h);

    // The beam overshoots the frame a little at both ends (so its glitch
    // band clears the edge): row ranges are clamped to the frame's rows.
    const by = s.beam * f.h;
    const amp = 16;
    const n = this.rows.length;
    const rowAt = (y: number) => Math.max(0, Math.min(n, Math.floor(y / ROW)));
    const above = rowAt(by - BAND); // first row of the band above the beam
    const at = rowAt(by); // the beam's row
    const below = rowAt(by + BAND); // first row past the band below it
    const [img, c] =
      s.mode === "old" || s.mode === "out"
        ? [this.from, this.cf]
        : [this.to, this.ct];

    if (s.mode === "old" || s.mode === "new") this.strip(img, c, 0, f.h);
    else {
      // Above the band: the void. In the band above the beam, rows break up
      // ("out": the old photo derezzing) or flicker into being ("in": the
      // new one materialising). At and below the beam: the photo, glitching
      // near it and settled beyond.
      this.void(0, above * ROW);
      for (let i = above; i < at; i++) {
        const k = (by - i * ROW) / BAND; // 0 at the beam → 1 at the band edge
        const keep =
          s.mode === "out"
            ? this.rows[i].seed > k
            : this.rows[i].seed > 0.35 + k * 0.65;
        if (keep)
          this.row(img, c, i, s.mode === "out" ? amp * (1 - k / 2) : amp);
        else this.void(i * ROW, i * ROW + ROW);
      }
      for (let i = at; i < below; i++)
        this.row(img, c, i, amp * (1 - (i * ROW - by) / BAND));
      this.strip(img, c, Math.min(f.h, below * ROW), f.h);
    }

    // Holographic tint and scanlines over whatever is showing.
    if (s.tint > 0.01) {
      const flick = 0.85 + Math.random() * 0.15;
      ctx.globalCompositeOperation = "source-atop";
      ctx.fillStyle = this.color(0.1, s.tint * flick * 0.32);
      ctx.fillRect(f.x, f.y, f.w, f.h);
      ctx.fillStyle = `rgba(0,0,0,${0.22 * s.tint})`;
      for (let y = 0; y < f.h; y += ROW) ctx.fillRect(f.x, f.y + y, f.w, 1);
      ctx.globalCompositeOperation = "source-over";
    }
    ctx.restore();

    // The scan beam: a glowing band and a hot core, reaching past the frame.
    if (s.beamOn > 0.01) {
      const y = f.y + Math.max(0, Math.min(f.h, by));
      const x0 = f.x - OVERHANG;
      const x1 = f.x + f.w + OVERHANG;
      const g = ctx.createLinearGradient(0, y - 18, 0, y + 18);
      g.addColorStop(0, this.color(0, 0));
      g.addColorStop(0.5, this.color(0, 0.4 * s.beamOn));
      g.addColorStop(1, this.color(0, 0));
      ctx.fillStyle = g;
      ctx.fillRect(x0, y - 18, x1 - x0, 36);
      ctx.fillStyle = this.color(0.75, s.beamOn);
      ctx.fillRect(x0, y - 1, x1 - x0, 2);
      ctx.beginPath();
      ctx.arc(x0, y, 2.5, 0, Math.PI * 2);
      ctx.arc(x1, y, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Sparks spray from both ends while the beam travels.
      const moving = Math.abs(s.beam - this.lastBeam) > 0.0005;
      if (moving) {
        this.carry += 300 * dt;
        for (; this.carry >= 1; this.carry--) {
          const left = Math.random() < 0.5;
          this.emit(
            left ? x0 : x1,
            y,
            (left ? -1 : 1) * (80 + Math.random() * 240),
            -140 + Math.random() * 200,
          );
        }
      }
    }
    this.lastBeam = s.beam;

    // Corner brackets: they fly in and lock onto the frame.
    if (s.lock > 0.01) {
      const off = 7 + (1 - s.lock) * 26;
      const len = 16;
      const L = f.x - off;
      const R = f.x + f.w + off;
      const T = f.y - off;
      const B = f.y + f.h + off;
      ctx.strokeStyle = this.color(0.15, s.lock);
      ctx.lineWidth = 2;
      ctx.lineCap = "square";
      ctx.beginPath();
      for (const [x, y, dx, dy] of [
        [L, T, 1, 1],
        [R, T, -1, 1],
        [L, B, 1, -1],
        [R, B, -1, -1],
      ]) {
        ctx.moveTo(x, y + dy * len);
        ctx.lineTo(x, y);
        ctx.lineTo(x + dx * len, y);
      }
      ctx.stroke();
    }
  }

  clear() {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
