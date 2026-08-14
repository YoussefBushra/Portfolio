"use client";

import { useState, type FormEvent } from "react";
import { profile } from "@/content/profile";
import { SectionShell } from "@/components/layout/SectionShell";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { CVButton } from "@/components/ui/CVButton";
import { track } from "@/lib/analytics";

type Status = "idle" | "submitting" | "success" | "error";

const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID;

const field =
  "focus-ring w-full rounded-sm border border-line bg-bg px-3 py-2 text-sm text-text placeholder:text-faint transition-colors duration-150 focus:border-accent";

export function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    if (!name || !email || !message) {
      setStatus("error");
      setErrorMsg("Fill in your name, email and message, then send again.");
      return;
    }

    if (!FORMSPREE_ID) {
      const subject = encodeURIComponent(`Portfolio contact from ${name}`);
      const body = encodeURIComponent(`${message}\n\n${name}\n${email}`);
      window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
      track("contact_submit", { method: "mailto" });
      setStatus("success");
      return;
    }

    try {
      setStatus("submitting");
      setErrorMsg("");
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      if (res.ok) {
        track("contact_submit", { method: "formspree" });
        setStatus("success");
        form.reset();
      } else {
        const json = await res.json().catch(() => null);
        setStatus("error");
        setErrorMsg(
          json?.errors?.[0]?.message ??
            `That did not send. Email ${profile.email} instead.`
        );
      }
    } catch {
      setStatus("error");
      setErrorMsg(`Network error. Try again, or email ${profile.email}.`);
    }
  }

  return (
    <SectionShell id="contact" label="Contact" meta={profile.availability}>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)] lg:gap-14">
        <div>
          {status === "success" ? (
            <div className="rounded-sm border border-line bg-surface p-6">
              <h3 className="text-base font-semibold tracking-tight text-text">
                Message sent
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">
                Thanks for reaching out. I will get back to you shortly.
              </p>
              <button
                type="button"
                onClick={() => setStatus("idle")}
                className="focus-ring mt-4 rounded-sm text-sm text-muted underline decoration-line underline-offset-[3px] transition-colors hover:text-text"
              >
                Send another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="name" className="text-[13px] font-medium text-text">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    className={field}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="email"
                    className="text-[13px] font-medium text-text"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="you@company.com"
                    className={field}
                  />
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-1.5">
                <label
                  htmlFor="message"
                  className="text-[13px] font-medium text-text"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  aria-describedby="message-help"
                  className={`${field} resize-y`}
                />
                <p id="message-help" className="text-xs text-muted">
                  A few lines about the role or the system is plenty.
                </p>
              </div>

              {status === "error" ? (
                <p
                  role="alert"
                  className="mt-4 rounded-sm border border-line bg-surface px-3 py-2 text-sm text-text"
                >
                  {errorMsg}
                </p>
              ) : null}

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="btn-primary disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {status === "submitting" ? "Sending" : "Send message"}
                </button>
                {!FORMSPREE_ID ? (
                  <span className="text-xs text-muted">
                    Opens your mail client.
                  </span>
                ) : null}
              </div>
            </form>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="block-label">Email</h3>
            <a
              href={`mailto:${profile.email}`}
              onClick={() =>
                track("social_click", { label: "Email", from: "contact" })
              }
              className="focus-ring link mt-1.5 block break-words rounded-sm text-sm"
            >
              {profile.email}
            </a>
          </div>
          <div>
            <h3 className="block-label">Profiles</h3>
            <div className="mt-1.5">
              <SocialLinks from="contact" exclude={["Email"]} />
            </div>
          </div>
          <div>
            <h3 className="block-label">CV</h3>
            <div className="mt-2">
              <CVButton from="contact" variant="ghost" />
            </div>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
