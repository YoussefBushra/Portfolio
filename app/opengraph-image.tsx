import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";

export const runtime = "edge";
export const alt = `${profile.name}, ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Mirrors the hero: aurora ground, a glass mark, the thesis in large type. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background:
            "radial-gradient(40% 60% at 15% 20%, #7c5cff88, transparent), radial-gradient(45% 65% at 85% 15%, #40c4ff77, transparent), radial-gradient(50% 70% at 75% 90%, #ec54a877, transparent), #0a0a14",
          color: "#eceef5",
          padding: "84px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 72,
            height: 72,
            borderRadius: 20,
            background: "linear-gradient(135deg, #8b74ff, #40c4ff)",
            border: "1px solid rgba(255,255,255,0.4)",
            boxShadow: "inset 0 2px 0 rgba(255,255,255,0.5)",
          }}
        />

        <div
          style={{
            display: "flex",
            fontSize: 78,
            fontWeight: 800,
            lineHeight: 1.06,
            letterSpacing: -2.5,
            marginTop: 44,
            maxWidth: 940,
          }}
        >
          {profile.thesis}
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 56,
            paddingTop: 28,
            borderTop: "1px solid rgba(255,255,255,0.18)",
            fontSize: 28,
            color: "#b9bdd0",
            fontFamily: "monospace",
          }}
        >
          {profile.name}
          <span style={{ color: "#6b7684", padding: "0 14px" }}>/</span>
          {profile.role}
        </div>
      </div>
    ),
    size
  );
}
