import { profile } from "@/content/profile";

const LINKS = [
  { id: "overview", label: "Overview" },
  { id: "experience", label: "Experience" },
  { id: "stack", label: "Stack" },
  { id: "contact", label: "Contact" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-8 border-t border-ink-2 bg-ink text-white/70">
      <div className="mx-auto flex max-w-[1240px] flex-col gap-3 px-4 py-4 text-[12.5px] sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-4">
          <span>
            © {year} {profile.name}
          </span>
          <span className="hidden text-white/30 sm:inline">|</span>
          <span className="hidden text-white/50 sm:inline">
            Built with Next.js · Deployed on Vercel
          </span>
        </div>
        <nav className="flex flex-wrap items-center gap-x-4 gap-y-1">
          {LINKS.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className="focus-ring rounded text-white/70 transition-colors hover:text-white"
            >
              {l.label}
            </a>
          ))}
          {profile.socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target={s.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer noopener"
              className="focus-ring rounded text-white/70 transition-colors hover:text-white"
            >
              {s.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
