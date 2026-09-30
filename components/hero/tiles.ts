/**
 * Rebuilds the portrait tile by tile, outward from the face: each tile shrinks
 * into a dark voxel gap with an accent flash and re-emerges as the other photo.
 *
 * Both photos are decoded copies of the images the page already shows, drawn
 * with the same cover-cropping as CSS `object-cover` + `object-position:
 * 50% 25%`, so when the canvas hands back to the real image nothing jumps.
 */

const TILE = 20; // target tile size in CSS px
const FOCUS = { x: 0.5, y: 0.42 }; // the face: where the rebuild starts
const VOXEL = "#0a0e12";

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

export class TileRebuild {
  private ctx: CanvasRenderingContext2D;
  private w: number;
  private h: number;
  private dpr: number;
  private tiles: { x: number; y: number; s: number; key: number }[] = [];
  private cf: Cover;
  private ct: Cover;

  constructor(
    private canvas: HTMLCanvasElement,
    private from: HTMLImageElement,
    private to: HTMLImageElement,
    private rgb: string, // "r g b"
  ) {
    const { width, height } = canvas.getBoundingClientRect();
    this.w = width;
    this.h = height;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * this.dpr);
    canvas.height = Math.round(height * this.dpr);
    this.ctx = canvas.getContext("2d")!;
    this.cf = cover(from, width, height);
    this.ct = cover(to, width, height);

    const cols = Math.max(8, Math.round(width / TILE));
    const s = width / cols;
    const rows = Math.ceil(height / s);
    const fx = width * FOCUS.x;
    const fy = height * FOCUS.y;
    const far = Math.hypot(Math.max(fx, width - fx), Math.max(fy, height - fy));
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * s;
        const y = r * s;
        const d = Math.hypot(x + s / 2 - fx, y + s / 2 - fy) / far;
        this.tiles.push({
          x,
          y,
          s,
          key: Math.min(1, d * 0.82 + Math.random() * 0.18),
        });
      }
    }
  }

  private tile(
    img: HTMLImageElement,
    c: Cover,
    x: number,
    y: number,
    s: number,
    k: number,
  ) {
    // Source rect of this tile, then draw it scaled by k around its centre.
    const sx = (x - c.ox) / c.scale;
    const sy = (y - c.oy) / c.scale;
    const ss = s / c.scale;
    const d = s * k;
    this.ctx.drawImage(
      img,
      sx,
      sy,
      ss,
      ss,
      x + (s - d) / 2,
      y + (s - d) / 2,
      d,
      d,
    );
  }

  /** p: 0 → 1 over the whole rebuild. */
  draw(p: number) {
    const { ctx, w, h, rgb } = this;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.fillStyle = VOXEL;
    ctx.fillRect(0, 0, w, h);

    const [r, g, b] = rgb.trim().split(/\s+/).map(Number);
    const accent = (a: number) => `rgba(${r},${g},${b},${a})`;

    for (const t of this.tiles) {
      const lp = Math.min(1, Math.max(0, (p - t.key * 0.72) / 0.28));
      if (lp === 0) {
        this.tile(this.from, this.cf, t.x, t.y, t.s, 1);
      } else if (lp === 1) {
        this.tile(this.to, this.ct, t.x, t.y, t.s, 1);
      } else {
        const out = lp < 0.5;
        const q = out ? lp / 0.5 : (lp - 0.5) / 0.5;
        const k = out ? 1 - q * 0.78 : 0.22 + q * 0.78;
        this.tile(
          out ? this.from : this.to,
          out ? this.cf : this.ct,
          t.x,
          t.y,
          t.s,
          k,
        );
        // The tile being rewritten flashes in the accent, strongest mid-swap.
        const a = out ? q * 0.55 : (1 - q) * 0.6;
        const d = t.s * k;
        ctx.fillStyle = accent(a);
        ctx.fillRect(t.x + (t.s - d) / 2, t.y + (t.s - d) / 2, d, d);
        ctx.strokeStyle = accent(Math.min(1, a + 0.35));
        ctx.lineWidth = 1;
        ctx.strokeRect(t.x + 0.5, t.y + 0.5, t.s - 1, t.s - 1);
      }
    }

    // A faint wireframe grid over the whole portrait while it's rebuilding.
    const grid = Math.sin(Math.PI * Math.min(1, Math.max(0, p))) * 0.22;
    if (grid > 0.01) {
      ctx.strokeStyle = accent(grid);
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      const s = this.tiles[0]?.s ?? TILE;
      for (let x = s; x < w; x += s) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
      }
      for (let y = s; y < h; y += s) {
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
      }
      ctx.stroke();
    }
  }

  clear() {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
