import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";

export const runtime = "edge";
export const alt = `${profile.name}, ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Mirrors the hero: ink ground, one amber mark, the thesis in large type. */
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
          background: "#0e1116",
          color: "#e6e9ee",
          padding: "84px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", width: 96, height: 10, background: "#f5a524" }} />

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
            borderTop: "1px solid #2a333e",
            fontSize: 28,
            color: "#98a2b0",
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
