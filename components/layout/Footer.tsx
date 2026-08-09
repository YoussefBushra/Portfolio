import { profile } from "@/content/profile";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-mono text-xs text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-ok animate-blink" />
            all systems operational
          </div>
          <p className="text-sm text-faint">
            © {year} {profile.name}. Built with Next.js, TypeScript &amp; Framer Motion.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 font-mono text-xs">
          {profile.socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target={s.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer noopener"
              className="focus-ring rounded text-muted transition-colors hover:text-accent"
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
