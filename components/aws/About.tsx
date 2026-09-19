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
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_260px] lg:gap-8">
          <div className="space-y-3">
            {profile.summary.map((p, i) => (
              <p key={i} className="text-[13.5px] leading-relaxed text-text">
                {p}
              </p>
            ))}
          </div>

          <div className="space-y-4 lg:border-l lg:border-border-2 lg:pl-8">
            <div className="flex items-center gap-3">
              <div className="relative aspect-[4/5] w-16 shrink-0 overflow-hidden rounded border border-border">
                <Image
                  src="/portrait.jpg"
                  alt={`${profile.name}, ${profile.role}`}
                  fill
                  sizes="64px"
                  className="object-cover object-[50%_12%]"
                />
              </div>
              <div className="min-w-0">
                <div className="text-[13px] font-bold text-text">
                  {profile.name}
                </div>
                <div className="text-[12px] text-muted">{profile.location}</div>
              </div>
            </div>

            <div>
              <div className="kv-label">Education</div>
              <div className="kv-value">{edu.degree}</div>
              <div className="text-[12px] text-muted">{edu.institution}</div>
              <div className="text-[12px] text-accent">{edu.detail}</div>
              <div className="mono mt-0.5 text-[11px] text-faint">
                {edu.period}
              </div>
            </div>

            <div>
              <div className="kv-label">Languages</div>
              <div className="kv-value">{spokenLanguages}</div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
