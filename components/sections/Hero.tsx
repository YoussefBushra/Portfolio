import { CVButton } from "@/components/ui/CVButton";
import { ContactLink } from "@/components/ui/ContactLink";
import { GitHubMark, LinkedInMark } from "@/components/ui/Icons";
import { Portrait } from "@/components/hero/Portrait";
import { Engineer } from "@/components/view/Layer";
import { profile } from "@/content/profile";
import { Fragment } from "react";

/** Engineer view: the headline's claim, one level down. */
const STACK_LINES: [label: string, items: string[], tone: string][] = [
  [
    "stack",
    ["NestJS", "TypeScript", "PostgreSQL", "RabbitMQ", "Dynamics 365 (OData)"],
    "text-text",
  ],
  [
    "focus",
    [
      "event-driven microservices",
      "idempotent consumers",
      "inbox / outbox",
      "compensating rollback",
    ],
    "text-muted",
  ],
];
const GITHUB = profile.socials.find((s) => s.label === "GitHub")?.href ?? "#";
const LINKEDIN =
  profile.socials.find((s) => s.label === "LinkedIn")?.href ?? "#";

/**
 * The identity band: the photo, the name, the positioning claim, and the
 * contact actions in a single screen, because the first screen is the only one
 * some readers will look at. The portrait is deliberately kept modest so the
 * text carries the most weight.
 */
export function Hero() {
  return (
    // overflow-x: clip keeps the spell (seal, sparks) from ever widening the
    // page on narrow screens, without creating a scroll container.
    <section id="hero" className="overflow-x-clip">
      <div className="mx-auto max-w-page px-6 pb-3 pt-20 md:px-10 md:pb-4 md:pt-24">
        <div className="grid items-center gap-8 md:grid-cols-[240px_minmax(0,1fr)] md:gap-14">
          <div>
            <Portrait alt={`${profile.name}, ${profile.role}`} />
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

            {/* Engineer view: the same claim, one level down. */}
            <Engineer className="pt-5" label="stack">
              <dl className="grid max-w-2xl grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-1.5 font-mono text-[12.5px] leading-relaxed">
                {STACK_LINES.map(([label, items, tone]) => (
                  <Fragment key={label}>
                    <dt className="text-faint">{label}</dt>
                    <dd className={tone}>
                      {/* Terms never split; lines break only after a dot. */}
                      {items.map((item, i) => (
                        <Fragment key={item}>
                          <span className="whitespace-nowrap">
                            {item}
                            {i < items.length - 1 ? (
                              <span className="ml-1.5 text-faint">·</span>
                            ) : null}
                          </span>{" "}
                        </Fragment>
                      ))}
                    </dd>
                  </Fragment>
                ))}
              </dl>
            </Engineer>

            <div className="mt-5 inline-flex items-center gap-2 text-[13px] text-muted">
              <span
                className="h-1.5 w-1.5 rounded-full bg-accent"
                aria-hidden
              />
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
