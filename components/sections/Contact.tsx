"use client";

import { useState, type FormEvent } from "react";
import { profile } from "@/content/profile";
import { SectionShell } from "@/components/layout/SectionShell";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

type Status = "idle" | "submitting" | "success" | "error";

const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID;

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
      setErrorMsg("Please fill in every field.");
      return;
    }

    // No Formspree configured → graceful mailto fallback.
    if (!FORMSPREE_ID) {
      const subject = encodeURIComponent(`Portfolio contact — ${name}`);
      const body = encodeURIComponent(`${message}\n\n— ${name}\n${email}`);
      window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
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
        setStatus("success");
        form.reset();
      } else {
        const json = await res.json().catch(() => null);
        setStatus("error");
        setErrorMsg(
          json?.errors?.[0]?.message ??
            "Something went wrong sending your message. Please try email instead."
        );
      }
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please try again or email me directly.");
    }
  }

  const inputClass =
    "focus-ring w-full rounded-xl border border-border bg-surface-2/50 px-4 py-3 text-sm text-text placeholder:text-faint transition-colors focus:border-accent/60";

  return (
    <SectionShell id="contact">
      <SectionHeading
        index="05"
        service="svc/contact"
        title="Open a connection"
        description="Have a role, a system to build, or an integration to untangle? Send a message — I read every one."
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.2fr]">
        {/* left: endpoints */}
        <RevealOnScroll className="space-y-4">
          <div className="card p-6">
            <div className="mono-label mb-4">endpoints</div>
            <ul className="space-y-4">
              {profile.socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target={s.href.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer noopener"
                    className="focus-ring group flex items-center justify-between gap-3 rounded-lg"
                  >
                    <span className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface-2/60 font-mono text-xs text-accent">
                        {s.label.slice(0, 2).toUpperCase()}
                      </span>
                      <span>
                        <span className="block text-sm font-medium text-text">
                          {s.label}
                        </span>
                        <span className="block font-mono text-xs text-muted">
                          {s.handle}
                        </span>
                      </span>
                    </span>
                    <span className="text-faint transition-colors group-hover:text-accent">
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-6 border-t border-border/60 pt-4">
              <div className="flex items-center gap-2 font-mono text-xs text-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-ok animate-blink" />
                {profile.location} · open to opportunities
              </div>
            </div>
          </div>
        </RevealOnScroll>

        {/* right: form */}
        <RevealOnScroll>
          {status === "success" ? (
            <div className="card flex h-full flex-col items-center justify-center p-10 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-ok/40 bg-ok/10 text-2xl text-ok">
                ✓
              </div>
              <h3 className="mt-5 text-lg font-bold text-text">
                Message queued
              </h3>
              <p className="mt-2 max-w-sm text-sm text-muted">
                Thanks for reaching out — your message is on its way. I&apos;ll get
                back to you soon.
              </p>
              <button
                type="button"
                onClick={() => setStatus("idle")}
                className="focus-ring mt-6 rounded-lg border border-border px-4 py-2 font-mono text-xs text-muted transition-colors hover:text-accent"
              >
                send another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="card p-6 sm:p-7">
              <div className="mono-label mb-5">POST /message</div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="mono-label mb-1.5 block">
                      name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      placeholder="Ada Lovelace"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="mono-label mb-1.5 block">
                      email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      placeholder="you@example.com"
                      className={inputClass}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="message" className="mono-label mb-1.5 block">
                    message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    placeholder="Tell me about the system you want to build…"
                    className={`${inputClass} resize-y`}
                  />
                </div>
              </div>

              {status === "error" ? (
                <p
                  role="alert"
                  className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 font-mono text-xs text-red-500"
                >
                  {errorMsg}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={status === "submitting"}
                className="focus-ring group mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-medium text-white shadow-glow transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {status === "submitting" ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    transmitting…
                  </>
                ) : (
                  <>
                    send message
                    <span className="transition-transform group-hover:translate-x-0.5">
                      →
                    </span>
                  </>
                )}
              </button>

              {!FORMSPREE_ID ? (
                <p className="mt-3 text-center font-mono text-[11px] text-faint">
                  opens your mail client · configure Formspree to send in-page
                </p>
              ) : null}
            </form>
          )}
        </RevealOnScroll>
      </div>
    </SectionShell>
  );
}
