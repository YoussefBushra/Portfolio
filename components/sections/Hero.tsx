import Image from "next/image";
import { profile } from "@/content/profile";
import { CVButton } from "@/components/ui/CVButton";
import { ContactLink } from "@/components/ui/ContactLink";
import { GitHubMark, LinkedInMark } from "@/components/ui/Icons";

const PORTRAIT = "/portrait.jpg";
const GITHUB = profile.socials.find((s) => s.label === "GitHub")?.href ?? "#";
const LINKEDIN = profile.socials.find((s) => s.label === "LinkedIn")?.href ?? "#";

/**
 * The identity band. Not a hero: it carries the photo, the name, the claim,
 * the contact details and five figures in a single screen, because the first
 * screen is the only one some readers will look at.
 */
export function Hero() {
  return (
    <section id="hero" className="px-6 md:px-10">
      <div className="mx-auto max-w-page pb-10 pt-20 md:pb-12 md:pt-24">
        <div className="grid gap-8 md:grid-cols-[220px_minmax(0,1fr)] md:gap-12">
          <div>
            <div className="relative aspect-[4/5] w-full max-w-[220px] overflow-hidden rounded-md border border-line bg-surface md:max-w-none">
              <Image
                src={PORTRAIT}
                alt={`${profile.name}, ${profile.role}`}
                fill
                priority
                sizes="(max-width: 768px) 220px, 22vw"
                className="scale-[1.28] object-cover object-[50%_8%]"
              />
            </div>
          </div>

          <div className="min-w-0">
            <h1 className="text-[2rem] font-semibold leading-[1.05] tracking-tight sm:text-4xl">
              {profile.name}
            </h1>
            <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px]">
              <span className="font-medium text-muted">{profile.role}</span>
              <span className="text-line" aria-hidden>
                ·
              </span>
              <span className="inline-flex items-center gap-1.5 text-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
                {profile.availability}
              </span>
            </div>

            <p className="mt-6 max-w-xl text-xl font-medium leading-snug tracking-tight text-text sm:text-2xl">
              {profile.thesis}
            </p>
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted">
              {profile.tagline}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-2.5">
              <CVButton from="hero" variant="primary" />
              <a
                href={GITHUB}
                target="_blank"
                rel="noreferrer noopener"
                className="btn-ghost"
              >
                <GitHubMark />
                GitHub
              </a>
              <a
                href={LINKEDIN}
                target="_blank"
                rel="noreferrer noopener"
                className="btn-ghost"
              >
                <LinkedInMark />
                LinkedIn
              </a>
              <ContactLink />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
