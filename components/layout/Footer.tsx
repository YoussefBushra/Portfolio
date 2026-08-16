import { profile } from "@/content/profile";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-page items-center gap-2.5 px-6 py-7 md:px-10">
        <span
          aria-hidden="true"
          className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent/70"
        />
        <p className="font-mono text-[12px] text-muted">
          © {new Date().getFullYear()} {profile.name}
        </p>
      </div>
    </footer>
  );
}
