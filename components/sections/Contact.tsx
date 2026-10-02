"use client";

import { SectionShell } from "@/components/layout/SectionShell";
import { CVButton } from "@/components/ui/CVButton";
import { GitHubMark, LinkedInMark } from "@/components/ui/Icons";
import { profile } from "@/content/profile";
import { track } from "@/lib/analytics";
import { useForm, ValidationError } from "@formspree/react";
import { useEffect, useRef, useState } from "react";

/**
 * Formspree form id. Public by design: it ships in the client bundle either
 * way, and Formspree scopes abuse protection to the form itself.
 */
const FORM_ID = "xnpabgrq";

const LINKEDIN = profile.socials.find((s) => s.label === "LinkedIn")?.href;
const GITHUB = profile.socials.find((s) => s.label === "GitHub")?.href;

const field =
  "focus-ring w-full rounded-sm border border-line bg-bg px-3 py-2 text-sm text-text placeholder:text-faint transition-colors duration-150 focus:border-accent";

const errorText = "text-xs leading-snug text-danger";

export function Contact() {
  const [state, handleSubmit, reset] = useForm(FORM_ID);
  const formRef = useRef<HTMLFormElement>(null);
  const sentRef = useRef<HTMLDivElement>(null);
  // Once Formspree accepts the message, the form transmits (folds into a
  // line of light and fires off) before the confirmation renders in; see
  // components/contact/transmit.ts. Reduced motion skips straight to it.
  const [phase, setPhase] = useState<"idle" | "transmitting" | "sent">("idle");

  useEffect(() => {
    if (!state.succeeded || phase !== "idle") return;
    track("contact_submit", { method: "formspree" });
    const form = formRef.current;
    if (!form || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPhase("sent");
      return;
    }
    setPhase("transmitting");
    import("@/components/contact/transmit")
      .then((m) => m.transmit(form))
      .catch(() => {})
      .finally(() => setPhase("sent"));
  }, [state.succeeded, phase]);

  useEffect(() => {
    if (phase !== "sent" || !sentRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const panel = sentRef.current;
    void import("@/components/contact/transmit").then((m) => m.receive(panel));
  }, [phase]);

  const showSent = state.succeeded && phase === "sent";

  return (
    <SectionShell id="contact" index="05" label="Contact">
      {/* Two columns read as one composition: the closing statement and direct
          channels on the left, the message form on the right. Stacks on mobile. */}
      <div className="grid gap-14 lg:grid-cols-[11fr_9fr] lg:gap-20">
        <div>
          <p className="text-balance text-[30px] font-semibold leading-[1.12] tracking-tight text-text sm:text-[36px] lg:text-[40px]">
            Let&rsquo;s talk about a software engineering role or project.
          </p>
          {/* Direct channels first — the fastest path for a recruiter. */}
          <p className="mt-6 text-[16px] leading-relaxed text-muted">
            Open to backend and full-stack roles.
          </p>
          <div className="mt-8 flex flex-wrap gap-2.5">
            {LINKEDIN ? (
              <a
                href={LINKEDIN}
                target="_blank"
                rel="noreferrer noopener"
                onClick={() =>
                  track("social_click", { label: "LinkedIn", from: "contact" })
                }
                className="btn-primary"
              >
                <LinkedInMark />
                LinkedIn
              </a>
            ) : null}
            {GITHUB ? (
              <a
                href={GITHUB}
                target="_blank"
                rel="noreferrer noopener"
                onClick={() =>
                  track("social_click", { label: "GitHub", from: "contact" })
                }
                className="btn-ghost"
              >
                <GitHubMark />
                GitHub
              </a>
            ) : null}
            <CVButton from="contact" variant="ghost" />
          </div>
        </div>

        {/* Message form, the right-hand column. */}
        <div>
          <h3 className="block-label">Send a message</h3>

          {showSent ? (
            <div
              ref={sentRef}
              className="mt-4 rounded-sm border border-line bg-surface p-6"
            >
              <h4 className="text-base font-semibold tracking-tight text-text">
                Message sent
              </h4>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">
                Thanks for reaching out. I will get back to you shortly.
              </p>
              <button
                type="button"
                onClick={() => {
                  setPhase("idle");
                  reset();
                }}
                className="focus-ring mt-4 rounded-sm text-sm text-muted underline decoration-line underline-offset-[3px] transition-colors hover:text-text"
              >
                Send another
              </button>
            </div>
          ) : (
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              noValidate
              aria-busy={phase === "transmitting" || undefined}
              className="mt-4"
            >
              <input
                type="hidden"
                name="_subject"
                value="Portfolio contact"
                readOnly
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="name"
                    className="text-[13px] font-medium text-muted"
                  >
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
                  <ValidationError
                    field="name"
                    prefix="Name"
                    errors={state.errors}
                    className={errorText}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="email"
                    className="text-[13px] font-medium text-muted"
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
                  <ValidationError
                    field="email"
                    prefix="Email"
                    errors={state.errors}
                    className={errorText}
                  />
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-1.5">
                <label
                  htmlFor="message"
                  className="text-[13px] font-medium text-muted"
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
                <ValidationError
                  field="message"
                  prefix="Message"
                  errors={state.errors}
                  className={errorText}
                />
              </div>

              <ValidationError
                errors={state.errors}
                className={`${errorText} mt-4`}
              />

              <div className="mt-5">
                <button
                  type="submit"
                  disabled={state.submitting || phase === "transmitting"}
                  className="btn-ghost disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {state.submitting
                    ? "Sending…"
                    : phase === "transmitting"
                      ? "Sent"
                      : "Send message"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </SectionShell>
  );
}
