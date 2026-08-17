import { profile } from "@/content/profile";

export function Footer() {
  return (
    <footer className="px-6 pb-[calc(9rem+env(safe-area-inset-bottom))] pt-4 md:px-10 md:pb-8">
      <div className="glass mx-auto flex max-w-page items-center gap-2.5 rounded-full px-6 py-3.5">
        <span
          aria-hidden="true"
          className="h-2 w-2 rounded-full bg-gradient-to-br from-accent to-accent/50"
        />
        <p className="text-[13px] text-muted">
          © {new Date().getFullYear()} {profile.name}
        </p>
      </div>
    </footer>
  );
}
