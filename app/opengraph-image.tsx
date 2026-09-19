import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";

export const runtime = "edge";
export const alt = `${profile.name} — ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#f2f3f3",
          fontFamily: "sans-serif",
        }}
      >
        {/* ink header bar with monogram */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            background: "#1a1d21",
            padding: "0 64px",
            height: 96,
            color: "#ffffff",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              borderRadius: 6,
              background: "#0f766e",
              color: "#ffffff",
              fontSize: 20,
              fontWeight: 600,
            }}
          >
            YB
          </div>
          <div style={{ display: "flex", fontSize: 28, fontWeight: 600 }}>
            {profile.name.split(" ").slice(0, 2).join(" ")}
          </div>
          <div style={{ display: "flex", fontSize: 22, color: "#9aa5b1" }}>
            {profile.role}
          </div>
        </div>

        {/* content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flex: 1,
            padding: "0 64px",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 56,
              fontWeight: 600,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: "#1a1d21",
              maxWidth: 900,
            }}
          >
            {profile.thesis}
          </div>

          <div
            style={{
              display: "flex",
              gap: 40,
              marginTop: 40,
              fontSize: 24,
              color: "#5c636e",
            }}
          >
            <div style={{ display: "flex", gap: 8 }}>
              <span style={{ color: "#1a1d21", fontWeight: 600 }}>10M+</span>
              records under geo-search
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <span style={{ color: "#1a1d21", fontWeight: 600 }}>600ms</span>
              geo-query p95
            </div>
          </div>

          <div style={{ display: "flex", marginTop: 28, fontSize: 20, color: "#8a909c" }}>
            Available for backend / software engineer roles
          </div>
        </div>
      </div>
    ),
    size
  );
}
