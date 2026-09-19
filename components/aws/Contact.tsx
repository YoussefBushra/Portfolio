"use client";

import { useState, type FormEvent } from "react";
import { profile } from "@/content/profile";
import { Container } from "@/components/aws/Container";
import { track } from "@/lib/analytics";

type State = "idle" | "submitting" | "success" | "error";

const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID ?? "xnpabgrq";
const EMAIL = "youssefbushra16.4@gmail.com";

export function Contact() {
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    if (!name || !email || !message) {
      setState("error");
      setError("Please fill in every field.");
      return;
    }

    if (!FORMSPREE_ID) {
      const subject = encodeURIComponent(`Portfolio contact — ${name}`);
      const body = encodeURIComponent(`${message}\n\n— ${name}\n${email}`);
      window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
      track("contact_submit", { method: "mailto" });
      setState("success");
      return;
    }

    try {
      setState("submitting");
      setError("");
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      if (res.ok) {
        track("contact_submit", { method: "formspree" });
        setState("success");
        form.reset();
      } else {
        const json = await res.json().catch(() => null);
        setState("error");
        setError(
          json?.errors?.[0]?.message ??
            "Something went wrong. Please email me directly."
        );
      }
    } catch {
      setState("error");
      setError("Network error. Please try again or email me directly.");
    }
  }

  return (
    <section id="contact" className="scroll-mt-16">
      <Container title="Contact">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_260px] lg:gap-8">
          {/* form */}
          {state === "success" ? (
            <div className="rounded border border-border bg-surface-2 px-4 py-5">
              <p className="text-[14px] font-semibold text-text">Message sent</p>
              <p className="mt-1 text-[13px] text-muted">
                Thanks for reaching out — I&apos;ll get back to you soon.
              </p>
              <button
                type="button"
                onClick={() => setState("idle")}
                className="cs-link mt-3 inline-block text-[13px]"
              >
                Send another
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="space-y-3.5">
              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-1 block text-[12px] font-semibold text-text"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    placeholder="Ada Lovelace"
                    className="cs-input focus-ring"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="mb-1 block text-[12px] font-semibold text-text"
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
                    className="cs-input focus-ring"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="mb-1 block text-[12px] font-semibold text-text"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  placeholder="Tell me about the system you want to build…"
                  className="cs-input focus-ring resize-y"
                />
              </div>

              {state === "error" ? (
                <p
                  role="alert"
                  className="rounded border border-red-300 bg-red-50 px-3 py-2 text-[12px] text-red-700"
                >
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={state === "submitting"}
                className="btn-primary focus-ring disabled:opacity-60"
              >
                {state === "submitting" ? "Sending…" : "Send message"}
              </button>
            </form>
          )}

          {/* channels */}
          <div className="space-y-4 lg:border-l lg:border-border-2 lg:pl-8">
            <div>
              <div className="kv-label mb-2">Channels</div>
              <ul className="space-y-2">
                {profile.socials.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target={s.href.startsWith("http") ? "_blank" : undefined}
                      rel="noreferrer noopener"
                      onClick={() =>
                        track("social_click", { label: s.label, from: "contact" })
                      }
                      className="focus-ring group flex items-baseline justify-between gap-2 rounded"
                    >
                      <span className="text-[13px] font-semibold text-text">
                        {s.label}
                      </span>
                      <span className="mono text-[12px] text-accent group-hover:underline">
                        {s.handle}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="kv-label mb-1.5">Availability</div>
              <p className="text-[12.5px] leading-relaxed text-muted">
                Open to backend &amp; full-stack roles and freelance systems
                work. Remote or {profile.location}.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
