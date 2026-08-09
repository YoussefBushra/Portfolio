import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";

export const runtime = "edge";
export const alt = `${profile.name} — ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const nodes = [
    { x: 150, y: 120 },
    { x: 1040, y: 150 },
    { x: 1080, y: 470 },
    { x: 180, y: 500 },
    { x: 620, y: 70 },
    { x: 600, y: 560 },
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0d1030 0%, #070910 55%)",
          color: "#e7edf8",
          padding: "80px",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* node dots */}
        {nodes.map((n, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: n.x,
              top: n.y,
              width: 14,
              height: 14,
              borderRadius: 999,
              background: i % 2 ? "#2dd4bf" : "#7c7aff",
              boxShadow: "0 0 24px #7c7aff",
            }}
          />
        ))}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 26,
            fontFamily: "monospace",
            color: "#94a0b8",
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 999,
              background: "#34d399",
            }}
          />
          ONLINE · youssef.systems
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 92,
            fontWeight: 700,
            lineHeight: 1.05,
            marginTop: 28,
            letterSpacing: -2,
          }}
        >
          Youssef Bushra Fouad
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 40,
            marginTop: 18,
            color: "#7c7aff",
            fontFamily: "monospace",
          }}
        >
          {profile.role}
        </div>

        <div
          style={{
            display: "flex",
            gap: 28,
            marginTop: 44,
            fontSize: 26,
            color: "#94a0b8",
            fontFamily: "monospace",
          }}
        >
          <span>10M+ records</span>
          <span style={{ color: "#3a4258" }}>·</span>
          <span>600ms p95</span>
          <span style={{ color: "#3a4258" }}>·</span>
          <span>microservices</span>
        </div>
      </div>
    ),
    size
  );
}
