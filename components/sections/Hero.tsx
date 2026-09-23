import { CVButton } from "@/components/ui/CVButton";
import { ContactLink } from "@/components/ui/ContactLink";
import { GitHubMark, LinkedInMark } from "@/components/ui/Icons";
import { profile } from "@/content/profile";
import Image from "next/image";

const PORTRAIT = "/portrait.jpg";
const GITHUB = profile.socials.find((s) => s.label === "GitHub")?.href ?? "#";
const LINKEDIN = profile.socials.find((s) => s.label === "LinkedIn")?.href ?? "#";

/**
 * The identity band: the photo, the name, the positioning claim, and the
 * contact actions in a single screen, because the first screen is the only one
 * some readers will look at. The portrait is deliberately kept modest so the
 * text carries the most weight.
 */
export function Hero() {
  return (
    <section id="hero">
      <div className="mx-auto max-w-page px-6 pb-6 pt-20 md:px-10 md:pb-8 md:pt-24">
        <div className="grid items-center gap-8 md:grid-cols-[240px_minmax(0,1fr)] md:gap-14">
          <div>
            <div className="relative aspect-[3/4] w-full max-w-[200px] overflow-hidden rounded-2xl border border-line bg-surface shadow-sm md:max-w-none">
              <Image
                src={PORTRAIT}
                alt={`${profile.name}, ${profile.role}`}
                fill
                priority
                sizes="(max-width: 768px) 240px, 240px"
                className="object-cover object-[50%_25%]"
              />
            </div>
          </div>

          <div className="min-w-0">
            {/* Hierarchy: eyebrow → name → headline (the focal point) →
                supporting line → availability → actions. */}
            <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-muted">
              Software Engineer
            </p>
            <h1 className="mt-3 text-[20px] font-semibold tracking-tight text-text sm:text-[22px]">
              {profile.name}
            </h1>

            <p className="mt-4 max-w-2xl text-pretty text-[30px] font-semibold leading-[1.1] tracking-[-0.02em] text-text sm:text-[40px] lg:text-[46px]">
              {profile.thesis}
            </p>
            <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-muted sm:text-[17px]">
              {profile.tagline}
            </p>

            <div className="mt-5 inline-flex items-center gap-2 text-[13px] text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
              {profile.availability}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-2.5 gap-y-3">
              <CVButton from="hero" variant="primary" />
              <a
                href={LINKEDIN}
                target="_blank"
                rel="noreferrer noopener"
                className="btn-ghost"
              >
                <LinkedInMark />
                LinkedIn
              </a>
              <a
                href={GITHUB}
                target="_blank"
                rel="noreferrer noopener"
                className="btn-ghost"
              >
                <GitHubMark />
                GitHub
              </a>
              <ContactLink className="ml-2" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
