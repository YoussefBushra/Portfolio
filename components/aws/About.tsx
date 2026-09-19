import Image from "next/image";
import { profile } from "@/content/profile";
import { education } from "@/content/education";
import { spokenLanguages } from "@/content/skills";
import { Container } from "@/components/aws/Container";

export function About() {
  const edu = education[0];

  return (
    <section id="about" className="scroll-mt-16">
      <Container title="About" description="Background, education, and how I work">
        {/* identity row */}
        <div className="flex items-center gap-3 border-b border-border-2 pb-4">
          <div className="relative aspect-[4/5] w-12 shrink-0 overflow-hidden rounded border border-border">
            <Image
              src="/portrait.jpg"
              alt={`${profile.name}, ${profile.role}`}
              fill
              sizes="48px"
              className="object-cover object-[50%_12%]"
            />
          </div>
          <div className="min-w-0">
            <div className="text-[14px] font-bold text-text">{profile.name}</div>
            <div className="text-[12.5px] text-muted">
              {profile.role} · {profile.location}
            </div>
          </div>
        </div>

        {/* summary, full width */}
        <div className="max-w-3xl space-y-3 pt-4">
          {profile.summary.map((p, i) => (
            <p key={i} className="text-[13.5px] leading-relaxed text-text">
              {p}
            </p>
          ))}
        </div>

        {/* property strip */}
        <div className="mt-4 grid grid-cols-1 gap-x-8 gap-y-4 border-t border-border-2 pt-4 sm:grid-cols-3">
          <div>
            <div className="kv-label">Education</div>
            <div className="kv-value">{edu.degree}</div>
            <div className="text-[12.5px] text-muted">{edu.institution}</div>
            <div className="text-[12.5px] font-semibold text-text">
              {edu.detail}
            </div>
            <div className="text-[12px] text-faint">{edu.period}</div>
          </div>
          <div>
            <div className="kv-label">Languages</div>
            <div className="kv-value">{spokenLanguages}</div>
          </div>
          <div>
            <div className="kv-label">Based in</div>
            <div className="kv-value">{profile.location}</div>
            <div className="mt-2 kv-label">Focus</div>
            <div className="kv-value">Backend · Distributed systems</div>
          </div>
        </div>
      </Container>
    </section>
  );
}
