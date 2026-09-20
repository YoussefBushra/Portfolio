import { CVButton } from "@/components/ui/CVButton";
import { ContactLink } from "@/components/ui/ContactLink";
import { GitHubMark, LinkedInMark } from "@/components/ui/Icons";
import { profile } from "@/content/profile";
import Image from "next/image";

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
        <div className="grid gap-8 md:grid-cols-[210px_minmax(0,1fr)] md:gap-12">
          <div>
            <div className="relative aspect-[3/4] w-full max-w-[210px] overflow-hidden rounded-md border border-line bg-surface shadow-sm md:max-w-none">
              <Image
                src={PORTRAIT}
                alt={`${profile.name}, ${profile.role}`}
                fill
                priority
                sizes="(max-width: 768px) 210px, 210px"
                className="object-cover object-[50%_30%]"
              />
            </div>
          </div>

          <div className="min-w-0">
            <p className="text-[13px] font-medium text-muted">Software Engineer</p>
            <h1 className="mt-1.5 text-[2rem] font-semibold leading-[1.03] tracking-tight text-text sm:text-4xl">
              {profile.name}
            </h1>

            <p className="mt-6 max-w-xl text-pretty text-[26px] font-semibold leading-[1.15] tracking-tight text-text sm:text-[32px]">
              {profile.thesis}
            </p>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted sm:text-base">
              {profile.tagline}
            </p>

            <div className="mt-6 inline-flex items-center gap-2 text-[13px] text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
              {profile.availability}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-2.5">
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
