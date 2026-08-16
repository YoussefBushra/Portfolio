import Image from "next/image";
import { profile } from "@/content/profile";
import { CVButton } from "@/components/ui/CVButton";
import { ContactLink } from "@/components/ui/ContactLink";
import { SocialLinks } from "@/components/ui/SocialLinks";

const PORTRAIT = "/portrait.jpg";

/**
 * The identity band, as a pane of glass floating on the aurora: the photo,
 * the name, the claim, both actions, location, availability, profile links
 * and four figures on a single screen, because the first screen is the only
 * one some readers will look at.
 */
export function Hero() {
  return (
    <section id="hero" className="px-6 md:px-10">
      <div className="mx-auto max-w-page pb-10 pt-28 md:pb-14 md:pt-32">
        <div className="glass-strong rounded-xl p-6 sm:p-8 md:p-10">
          <div className="grid gap-8 md:grid-cols-12 md:gap-10">
            <div className="md:col-span-3">
              <div className="relative aspect-[4/5] w-full max-w-[220px] overflow-hidden rounded-lg border border-white/30 bg-surface/40 shadow-lg md:max-w-none">
                <Image
                  src={PORTRAIT}
                  alt={`${profile.name}, ${profile.role}`}
                  fill
                  priority
                  sizes="(max-width: 768px) 220px, 22vw"
                  className="object-cover object-[50%_12%]"
                />
              </div>
            </div>

            <div className="md:col-span-6">
              <h1 className="font-display text-[2.1rem] font-bold leading-[1.03] tracking-tight sm:text-[2.75rem]">
                {profile.name}
              </h1>
              <p className="mt-2.5 font-mono text-xs uppercase tracking-[0.14em] text-accent-text">
                {profile.role}
              </p>

              <p className="mt-6 font-display text-xl font-semibold leading-snug tracking-tight text-text sm:text-2xl">
                {profile.thesis}
              </p>
              <p className="mt-3 max-w-prose text-[15px] leading-relaxed text-muted">
                {profile.tagline}
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
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
        </div>

        {/* Figures, all of them defended further down the page, as small glass tiles. */}
        <dl className="mt-5 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {profile.facts.map((f) => (
            <div key={f.label} className="glass rounded-lg p-4 md:p-5">
              <dt className="num font-display text-2xl font-bold tracking-tight text-accent-text">
                {f.value}
              </dt>
              <dd className="mt-1.5 text-[13px] leading-tight text-text">{f.label}</dd>
              <dd className="mt-0.5 font-mono text-[11px] leading-tight text-faint">
                {f.hint}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
