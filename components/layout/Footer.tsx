import { profile } from "@/content/profile";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-page flex-col gap-1.5 px-6 py-7 text-[13px] text-muted sm:flex-row sm:items-center sm:justify-between md:px-10">
        <p>
          © {new Date().getFullYear()} {profile.name}
        </p>
        <p className="text-faint">
          {profile.role} · {profile.location}
        </p>
      </div>
    </footer>
  );
}
