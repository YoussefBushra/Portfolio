import { profile } from "@/content/profile";
import { CvButton } from "@/components/aws/CvButton";

const METRICS = [
  { value: "10M+", label: "records under geo-search" },
  { value: "600ms", label: "geo-query p95 (target < 1s)" },
];

export function Overview() {
  return (
    <section id="overview" className="scroll-mt-12 border-b border-border bg-surface">
      <div className="mx-auto max-w-[1100px] px-4 py-10 sm:px-6 sm:py-14">
        <h1 className="text-[30px] font-semibold leading-[1.08] tracking-tight text-text sm:text-[38px]">
          {profile.name}
        </h1>
        <div className="mt-1.5 text-[15px] text-muted">{profile.role}</div>

        <p className="mt-6 max-w-xl text-[19px] font-medium leading-snug tracking-tight text-text sm:text-[22px]">
          {profile.thesis}
        </p>
        <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-muted">
          {profile.tagline}
        </p>

        <div className="mt-7 flex flex-wrap gap-2.5">
          <CvButton from="overview" variant="primary" />
          <a href="#contact" className="btn-normal focus-ring">
            Get in touch
          </a>
        </div>

        <div className="mt-9 flex flex-wrap items-stretch gap-x-10 gap-y-5 border-t border-border-2 pt-6">
          {METRICS.map((m) => (
            <div key={m.label}>
              <div className="text-[22px] font-semibold tracking-tight text-text">
                {m.value}
              </div>
              <div className="mt-0.5 text-[12.5px] text-muted">{m.label}</div>
            </div>
          ))}
          <div className="max-w-[15rem]">
            <div className="text-[12.5px] font-semibold text-text">
              Available for backend / software engineer roles
            </div>
            <div className="mt-0.5 text-[12.5px] text-muted">
              {profile.location} · remote or on-site
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
