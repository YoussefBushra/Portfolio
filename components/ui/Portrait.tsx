"use client";

import { useState } from "react";
import { MonogramAvatar } from "@/components/ui/MonogramAvatar";

/**
 * Portrait photo. Drop a file at `public/portrait.jpg` (or pass `src`) and it
 * appears here; until then the generated monogram shows underneath, so a
 * missing file never leaves a broken image.
 */
export function Portrait({
  src = "/portrait.jpg",
  className = "",
}: {
  src?: string;
  className?: string;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className={`relative aspect-square w-full overflow-hidden rounded-2xl border border-border bg-surface-2 ${className}`}
    >
      <div className="absolute inset-0 grid place-items-center">
        <MonogramAvatar size={150} />
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt="Youssef Bushra Fouad"
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(false)}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
