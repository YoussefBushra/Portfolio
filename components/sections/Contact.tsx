"use client";

import { useState, type FormEvent } from "react";
import { profile } from "@/content/profile";
import { SectionShell } from "@/components/layout/SectionShell";
import { SectionHead } from "@/components/ui/SectionHead";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { track } from "@/lib/analytics";

type Status = "idle" | "submitting" | "success" | "error";

const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID;

const field =
  "focus-ring w-full rounded border border-line bg-surface px-4 py-3 text-sm text-text placeholder:text-faint transition-colors duration-200 focus:border-accent";

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

    // Without Formspree configured, hand off to the visitor's mail client.
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
    <SectionShell id="contact">
      <SectionHead
        title="Get in touch."
        lead="Backend and full-stack roles building scalable services and integrations, plus freelance systems work. Remote or Cairo."
      />

      <RevealOnScroll>
        <a
          href={`mailto:${profile.email}`}
          onClick={() => track("social_click", { label: "Email", from: "contact" })}
          className="focus-ring inline-block break-words rounded font-display text-xl font-bold tracking-tight text-text underline decoration-accent decoration-2 underline-offset-[6px] transition-colors duration-200 hover:text-accent-text sm:text-3xl lg:text-4xl"
        >
          {profile.email}
        </a>

        <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2">
          {profile.socials
            .filter((s) => s.label !== "Email")
            .map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer noopener"
                onClick={() =>
                  track("social_click", { label: s.label, from: "contact" })
                }
                className="focus-ring group flex items-baseline gap-2 rounded text-sm"
              >
                <span className="text-accent-text underline decoration-accent/40 decoration-1 underline-offset-4 transition-colors group-hover:decoration-accent">
                  {s.label}
                </span>
                <span className="font-mono text-xs text-faint">{s.handle}</span>
              </a>
            ))}
        </div>
      </RevealOnScroll>

      <RevealOnScroll className="mt-16 max-w-2xl">
        {status === "success" ? (
          <div className="rounded border border-line bg-surface p-8">
            <h3 className="font-display text-xl font-bold tracking-tight text-text">
              Message sent
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Thanks for reaching out. I will get back to you shortly.
            </p>
            <button
              type="button"
              onClick={() => setStatus("idle")}
              className="focus-ring mt-6 rounded text-sm text-muted underline decoration-line underline-offset-4 transition-colors hover:text-text"
            >
              Send another
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-sm font-medium text-text">
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
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm font-medium text-text">
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

            <div className="mt-5 flex flex-col gap-2">
              <label htmlFor="message" className="text-sm font-medium text-text">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
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
                className="mt-5 rounded border border-line bg-surface-2 px-4 py-3 text-sm text-text"
              >
                {errorMsg}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={status === "submitting"}
              className="btn-primary mt-6 w-full disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
            >
              {status === "submitting" ? "Sending" : "Send message"}
            </button>

            {!FORMSPREE_ID ? (
              <p className="mt-3 text-xs text-muted">
                This opens your mail client.
              </p>
            ) : null}
          </form>
        )}
      </RevealOnScroll>
    </SectionShell>
  );
}
