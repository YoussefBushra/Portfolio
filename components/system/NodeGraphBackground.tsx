"use client";

import { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

interface Packet {
  a: number; // node index
  b: number; // node index
  t: number; // 0..1 progress
  speed: number;
}

/**
 * A living, breathing distributed-system backdrop:
 * drifting service-nodes connected by proximity edges, with data
 * "packets" flowing along the links — the visual heart of the site.
 *
 * - Pauses when off-screen (IntersectionObserver) and when the tab is hidden.
 * - Fully disabled under prefers-reduced-motion (renders one static frame).
 * - Colors read from CSS theme variables so it adapts to dark/light.
 */
export function NodeGraphBackground({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let nodes: Node[] = [];
    let packets: Packet[] = [];
    let raf = 0;
    let running = true;

    const readColors = () => {
      const styles = getComputedStyle(document.documentElement);
      const accent = styles.getPropertyValue("--accent").trim() || "124 122 255";
      const accent2 = styles.getPropertyValue("--accent-2").trim() || "45 212 191";
      const grid = styles.getPropertyValue("--grid").trim() || "130 150 200";
      return { accent, accent2, grid };
    };
    let colors = readColors();

    const resize = () => {
      const parent = canvas.parentElement;
      width = parent?.clientWidth ?? window.innerWidth;
      height = parent?.clientHeight ?? window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const density = Math.max(
        14,
        Math.min(46, Math.round((width * height) / 26000))
      );
      nodes = Array.from({ length: density }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() * 1.6 + 1.1,
      }));
      packets = [];
    };

    const LINK_DIST = 150;

    const spawnPacket = () => {
      if (nodes.length < 2) return;
      const a = Math.floor(Math.random() * nodes.length);
      let b = Math.floor(Math.random() * nodes.length);
      if (b === a) b = (b + 1) % nodes.length;
      packets.push({ a, b, t: 0, speed: 0.006 + Math.random() * 0.01 });
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const { accent, accent2 } = colors;

      // update + draw edges
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        if (!reduceMotion) {
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < 0 || n.x > width) n.vx *= -1;
          if (n.y < 0 || n.y > height) n.vy *= -1;
        }
        for (let j = i + 1; j < nodes.length; j++) {
          const m = nodes[j];
          const dx = n.x - m.x;
          const dy = n.y - m.y;
          const dist = Math.hypot(dx, dy);
          if (dist < LINK_DIST) {
            const alpha = (1 - dist / LINK_DIST) * 0.5;
            ctx.strokeStyle = `rgb(${colors.grid} / ${alpha * 0.5})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(m.x, m.y);
            ctx.stroke();
          }
        }
      }

      // nodes
      for (const n of nodes) {
        ctx.fillStyle = `rgb(${accent} / 0.75)`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // packets
      if (!reduceMotion) {
        for (let i = packets.length - 1; i >= 0; i--) {
          const p = packets[i];
          const a = nodes[p.a];
          const b = nodes[p.b];
          if (!a || !b) {
            packets.splice(i, 1);
            continue;
          }
          p.t += p.speed;
          if (p.t >= 1) {
            packets.splice(i, 1);
            continue;
          }
          const x = a.x + (b.x - a.x) * p.t;
          const y = a.y + (b.y - a.y) * p.t;
          const glow = ctx.createRadialGradient(x, y, 0, x, y, 6);
          glow.addColorStop(0, `rgb(${accent2} / 0.95)`);
          glow.addColorStop(1, `rgb(${accent2} / 0)`);
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(x, y, 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = `rgb(${accent2})`;
          ctx.beginPath();
          ctx.arc(x, y, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
        if (packets.length < Math.min(10, nodes.length) && Math.random() < 0.06) {
          spawnPacket();
        }
      }
    };

    const loop = () => {
      if (!running) return;
      draw();
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running) return;
      running = true;
      loop();
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    resize();
    if (reduceMotion) {
      draw(); // single static frame
    } else {
      for (let i = 0; i < 5; i++) spawnPacket();
      loop();
    }

    const onResize = () => {
      colors = readColors();
      resize();
      if (reduceMotion) draw();
    };
    window.addEventListener("resize", onResize);

    const onVisibility = () => {
      if (document.hidden) stop();
      else if (!reduceMotion) start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    // Re-read colors when theme class toggles.
    const themeObserver = new MutationObserver(() => {
      colors = readColors();
      if (reduceMotion) draw();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // Pause when scrolled off-screen.
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries[0]?.isIntersecting;
        if (reduceMotion) return;
        if (visible) start();
        else stop();
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    return () => {
      stop();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      themeObserver.disconnect();
      io.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
    />
  );
}
