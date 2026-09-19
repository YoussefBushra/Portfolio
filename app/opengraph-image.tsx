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
        {/* squid-ink service bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            background: "#232f3e",
            padding: "0 64px",
            height: 96,
            color: "#ffffff",
          }}
        >
          <div style={{ display: "flex", fontSize: 30 }}>
            <span style={{ color: "#ec7211", fontWeight: 700 }}>▣</span>
          </div>
          <div style={{ display: "flex", fontSize: 30, fontWeight: 700 }}>
            {profile.name.split(" ").slice(0, 2).join(" ")}
          </div>
          <div style={{ display: "flex", fontSize: 22, color: "#9aa5b1" }}>
            / {profile.role}
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
              alignItems: "center",
              gap: 12,
              fontSize: 24,
              color: "#037f0c",
            }}
          >
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: 999,
                background: "#037f0c",
              }}
            />
            Available — open to backend / software engineer roles
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 60,
              fontWeight: 700,
              lineHeight: 1.1,
              marginTop: 24,
              color: "#16191f",
              maxWidth: 980,
            }}
          >
            {profile.thesis}
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 40 }}>
            {[
              "~40 services",
              "10M+ records",
              "600ms p95",
              "event-driven",
            ].map((t) => (
              <div
                key={t}
                style={{
                  display: "flex",
                  border: "1px solid #c8cdd0",
                  background: "#ffffff",
                  borderRadius: 8,
                  padding: "10px 16px",
                  fontSize: 22,
                  color: "#16191f",
                }}
              >
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    size
  );
}
