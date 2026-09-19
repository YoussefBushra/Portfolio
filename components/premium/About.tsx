"use client";

import Image from "next/image";
import { profile } from "@/content/profile";
import { education } from "@/content/education";
import { spokenLanguages } from "@/content/skills";
import { Section, SectionHeader } from "@/components/premium/Section";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

export function About() {
  return (
    <Section id="about" className="py-20 md:py-28">
      <SectionHeader
        index="01"
        label="about"
        title="Systems that stay legible as they grow"
      />

      <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_300px] lg:gap-16">
        {/* left — the narrative */}
        <RevealOnScroll className="space-y-5">
          {profile.summary.map((para, i) => (
            <p
              key={i}
              className="text-pretty text-[15px] leading-[1.75] text-muted"
            >
              {para}
            </p>
          ))}
        </RevealOnScroll>

        {/* right — portrait + facts, restrained */}
        <RevealOnScroll className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="relative aspect-[4/5] w-24 shrink-0 overflow-hidden rounded-xl border border-border bg-surface shadow-node sm:w-28">
              <Image
                src="/portrait.jpg"
                alt={`${profile.name}, ${profile.role}`}
                fill
                sizes="(max-width: 640px) 96px, 112px"
                className="object-cover object-[50%_12%]"
              />
            </div>
            <div className="min-w-0 pt-1">
              <div className="text-[15px] font-semibold leading-tight text-text">
                {profile.name}
              </div>
              <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.12em] text-accent">
                {profile.role}
              </div>
              <div className="mt-2 text-sm text-muted">{profile.location}</div>
            </div>
          </div>

          <div className="surface p-5">
            <div className="mono-label mb-3">education</div>
            {education.map((e) => (
              <div key={e.institution}>
                <div className="text-sm font-semibold text-text">
                  {e.degree}
                </div>
                <div className="mt-1 text-sm text-muted">{e.institution}</div>
                <div className="mt-1.5 text-sm text-accent">{e.detail}</div>
                <div className="mt-1 font-mono text-[11px] text-faint">
                  {e.period}
                </div>
              </div>
            ))}
          </div>

          <div className="surface p-5">
            <div className="mono-label mb-3">languages</div>
            <p className="text-sm leading-relaxed text-muted">
              {spokenLanguages}
            </p>
          </div>
        </RevealOnScroll>
      </div>
    </Section>
  );
}
