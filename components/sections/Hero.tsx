import Image from "next/image";
import { profile } from "@/content/profile";
import { CVButton } from "@/components/ui/CVButton";
import { ContactLink } from "@/components/ui/ContactLink";
import { SocialLinks } from "@/components/ui/SocialLinks";

const PORTRAIT = "/portrait.jpg";
const GITHUB = profile.socials.find((s) => s.label === "GitHub")?.href ?? "#";

function GitHubMark() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

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
                className="scale-[1.28] object-cover object-[50%_8%] grayscale"
              />
            </div>
          </div>

          <div className="md:col-span-6">
            <h1 className="text-[2rem] font-semibold leading-[1.05] tracking-tight sm:text-4xl">
              {profile.name}
            </h1>
            <p className="mt-2 text-[13px] font-medium text-muted">{profile.role}</p>

            <p className="mt-6 text-xl font-medium leading-snug tracking-tight text-text sm:text-2xl">
              {profile.thesis}
            </p>
            <p className="mt-3 max-w-prose text-[15px] leading-relaxed text-muted">
              {profile.tagline}
            </p>

            <div className="mt-7 flex flex-wrap gap-2.5">
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
                <dd className="mt-1.5">
                  <SocialLinks from="hero" />
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Two hard figures, with where they came from. */}
        <dl className="mt-9 flex flex-wrap items-end gap-x-12 gap-y-4 border-t border-line pt-6">
          {profile.facts
            .filter((f) => f.value === "10M+" || f.value === "600ms")
            .map((f) => (
              <div key={f.label}>
                <dt className="num text-2xl font-semibold tracking-tight text-text">
                  {f.value}
                </dt>
                <dd className="mt-1 text-[13px] leading-tight text-text">
                  {f.label}
                </dd>
                <dd className="mt-0.5 text-[12px] leading-tight text-faint">
                  {f.hint}
                </dd>
              </div>
            ))}
          <a
            href="#experience"
            className="focus-ring rounded-sm text-[12px] text-muted underline decoration-line underline-offset-[3px] transition-colors hover:text-text hover:decoration-accent"
          >
            Elasticsearch geo-search at Block Gemini →
          </a>
        </dl>
      </div>
    </section>
  );
}
