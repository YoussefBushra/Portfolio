import Image from "next/image";
import { profile } from "@/content/profile";
import { education } from "@/content/education";
import { spokenLanguages } from "@/content/skills";

export function About() {
  const edu = education[0];

  return (
    <section id="about" className="scroll-mt-16">
      <div className="rule-head">About</div>

      <div className="grid grid-cols-1 gap-8 pt-6 lg:grid-cols-[minmax(0,640px)_1fr] lg:gap-12">
        {/* narrative */}
        <div className="space-y-4">
          {profile.summary.map((p, i) => (
            <p key={i} className="text-[15px] leading-[1.65] text-text">
              {p}
            </p>
          ))}
        </div>

        {/* details */}
        <div className="space-y-5 text-[13px]">
          <div className="flex items-center gap-3">
            <div className="relative aspect-[4/5] w-14 shrink-0 overflow-hidden rounded-[3px] border border-border grayscale">
              <Image
                src="/portrait.jpg"
                alt={`${profile.name}, ${profile.role}`}
                fill
                sizes="56px"
                className="object-cover object-[50%_12%]"
              />
            </div>
            <div className="min-w-0">
              <div className="font-semibold text-text">{profile.name}</div>
              <div className="text-muted">{profile.location}</div>
            </div>
          </div>

          <div className="border-t border-border-2 pt-4">
            <div className="kv-label">Education</div>
            <div className="mt-0.5 font-medium text-text">{edu.degree}</div>
            <div className="text-muted">{edu.institution}</div>
            <div className="text-text">{edu.detail}</div>
            <div className="text-[12px] text-faint">{edu.period}</div>
          </div>

          <div>
            <div className="kv-label">Languages</div>
            <div className="mt-0.5 text-text">{spokenLanguages}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
