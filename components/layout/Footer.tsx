import { profile } from "@/content/profile";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-page flex-col gap-1.5 px-6 py-7 sm:flex-row sm:items-baseline sm:justify-between md:px-10">
        <p className="text-[13px] text-muted">
          {profile.name}, {profile.location}
        </p>
        <p className="font-mono text-[11px] text-faint">
          © {year}. Built with Next.js and TypeScript.
        </p>
      </div>
    </footer>
  );
}
