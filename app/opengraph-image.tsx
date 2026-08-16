import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";

export const runtime = "edge";
export const alt = `${profile.name}, ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Mirrors the hero: console ground, one teal signal mark, thesis in large type. */
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
          background: "#090c11",
          backgroundImage:
            "linear-gradient(#94c5ff0a 1px, transparent 1px), linear-gradient(90deg, #94c5ff0a 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          color: "#e4e9f0",
          padding: "84px",
          fontFamily: "sans-serif",
        }}
      >
        <svg width="120" height="44" viewBox="0 0 120 44">
          <path d="M12 22 L60 10 M12 22 L60 34" stroke="#2de0c2" strokeWidth="2.4" opacity="0.6" />
          <circle cx="12" cy="22" r="6.5" fill="#2de0c2" />
          <circle cx="60" cy="10" r="6.5" fill="#2de0c2" />
          <circle cx="60" cy="34" r="6.5" fill="#2de0c2" />
        </svg>

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
            borderTop: "1px solid #232c3b",
            fontSize: 28,
            color: "#97a3b3",
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
