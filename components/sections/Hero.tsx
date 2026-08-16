import Image from "next/image";
import { profile } from "@/content/profile";
import { CVButton } from "@/components/ui/CVButton";
import { ContactLink } from "@/components/ui/ContactLink";
import { SocialLinks } from "@/components/ui/SocialLinks";

const PORTRAIT = "/portrait.jpg";

/**
 * The identity band. Not a hero: it carries the photo, the name, the claim,
 * the contact details and five figures in a single screen, because the first
 * screen is the only one some readers will look at.
 */
export function Hero() {
  return (
    <section id="hero" className="px-6 md:px-10">
      <div className="mx-auto max-w-page pb-10 pt-20 md:pb-12 md:pt-24">
        <div className="grid gap-8 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-3">
            <div className="relative aspect-[4/5] w-full max-w-[220px] overflow-hidden rounded-sm border border-line bg-surface md:max-w-none">
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
            <h1 className="text-[2rem] font-semibold leading-[1.05] tracking-tight sm:text-4xl">
              {profile.name}
            </h1>
            <p className="mt-2 font-mono text-xs text-accent-text">{profile.role}</p>

            <p className="mt-6 text-xl font-medium leading-snug tracking-tight text-text sm:text-2xl">
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
            <dl className="space-y-3 text-sm">
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

        {/* Figures, all of them defended further down the page. */}
        <dl className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:border-t lg:border-line">
          {profile.facts.map((f, i) => (
            <div
              key={f.label}
              className={`border-t border-line py-4 lg:border-t-0 lg:py-5 ${
                i === 0 ? "lg:pr-5" : "lg:border-l lg:border-line lg:px-5"
              }`}
            >
              <dt className="num text-2xl font-semibold tracking-tight text-text">
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
    </section>
  );
}
