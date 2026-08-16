import Image from "next/image";
import { profile } from "@/content/profile";
import { CVButton } from "@/components/ui/CVButton";
import { ContactLink } from "@/components/ui/ContactLink";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { ServiceTopology } from "@/components/system/ServiceTopology";

const PORTRAIT = "/portrait.jpg";

/**
 * The identity band, framed as the header of a control plane: who is on call,
 * the claim, the actions, and — as the signature — a live schematic of the
 * systems the rest of the page describes, with the headline figures read off
 * it like telemetry.
 */
export function Hero() {
  return (
    <section id="hero" className="px-6 md:px-10">
      <div className="mx-auto max-w-page pb-12 pt-24 md:pb-16 md:pt-28">
        {/* status line */}
        <div className="mb-8 flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-faint">
          <span className="live-dot" aria-hidden="true" />
          <span className="text-accent-text">online</span>
          <span aria-hidden="true">/</span>
          <span>{profile.availability}</span>
        </div>

        <div className="grid gap-8 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-3">
            <div className="relative aspect-[4/5] w-full max-w-[220px] overflow-hidden rounded-lg border border-line bg-surface md:max-w-none">
              <Image
                src={PORTRAIT}
                alt={`${profile.name}, ${profile.role}`}
                fill
                priority
                sizes="(max-width: 768px) 220px, 22vw"
                className="object-cover object-[50%_12%]"
              />
              <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-accent/10" />
            </div>
          </div>

          <div className="md:col-span-6">
            <h1 className="font-display text-[2.1rem] font-semibold leading-[1.03] tracking-tight sm:text-[2.75rem]">
              {profile.name}
            </h1>
            <p className="mt-2.5 font-mono text-xs uppercase tracking-[0.14em] text-accent-text">
              {profile.role}
            </p>

            <p className="mt-6 font-display text-xl font-medium leading-snug tracking-tight text-text sm:text-2xl">
              {profile.thesis}
            </p>
            <p className="mt-3 max-w-prose text-[15px] leading-relaxed text-muted">
              {profile.tagline}
            </p>

            <div className="mt-7 flex flex-wrap gap-2.5">
              <CVButton from="hero" variant="primary" />
              <ContactLink />
            </div>
          </div>

          <div className="md:col-span-3">
            <dl className="space-y-4 text-sm">
              <div>
                <dt className="block-label">Based in</dt>
                <dd className="mt-1 text-text">{profile.location}</dd>
              </div>
              <div>
                <dt className="block-label">Status</dt>
                <dd className="mt-1 text-text">{profile.availability}</dd>
              </div>
              <div>
                <dt className="block-label">Elsewhere</dt>
                <dd className="mt-1.5">
                  <SocialLinks from="hero" />
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Signature: the architecture, live, with the figures read off it. */}
        <div className="panel mt-12 overflow-hidden">
          <div className="flex items-center justify-between gap-4 border-b border-line px-4 py-2.5 md:px-6">
            <h2 className="block-label">Architecture</h2>
            <p className="font-mono text-[11px] text-faint">multi-tenant SaaS platform</p>
          </div>

          {/* On narrow screens the schematic scrolls inside its own panel
              rather than shrinking its labels past legibility; the page body
              never scrolls sideways. */}
          <div className="overflow-x-auto px-4 py-6 md:px-8 md:py-8">
            <div className="min-w-[520px]">
              <ServiceTopology />
            </div>
          </div>

          {/* Figures, all of them defended further down the page. */}
          <dl className="grid grid-cols-2 border-t border-line lg:grid-cols-4">
            {profile.facts.map((f, i) => (
              <div
                key={f.label}
                className={`border-line px-4 py-4 md:px-6 md:py-5 ${
                  i % 2 === 1 ? "border-l" : ""
                } ${i >= 2 ? "border-t" : ""} lg:border-t-0 ${
                  i !== 0 ? "lg:border-l" : ""
                }`}
              >
                <dt className="num font-display text-2xl font-semibold tracking-tight text-accent-text">
                  {f.value}
                </dt>
                <dd className="mt-1 text-[13px] leading-tight text-text">{f.label}</dd>
                <dd className="mt-0.5 font-mono text-[11px] leading-tight text-faint">
                  {f.hint}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
