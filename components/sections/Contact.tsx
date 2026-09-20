"use client";

import { SectionShell } from "@/components/layout/SectionShell";
import { CVButton } from "@/components/ui/CVButton";
import { GitHubMark, LinkedInMark } from "@/components/ui/Icons";
import { profile } from "@/content/profile";
import { track } from "@/lib/analytics";
import { useForm, ValidationError } from "@formspree/react";
import { useEffect } from "react";

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

  useEffect(() => {
    if (state.succeeded) track("contact_submit", { method: "formspree" });
  }, [state.succeeded]);

  return (
    <SectionShell id="contact" label="Contact" meta={profile.availability}>
      <div className="max-w-2xl">
        <h2 className="text-balance text-[26px] font-semibold leading-[1.1] tracking-tight text-text sm:text-[32px]">
          Build something that scales.
        </h2>
        {/* Direct channels first — the fastest path for a recruiter. */}
        <p className="mt-4 text-[15px] leading-relaxed text-muted">
          Open to backend &amp; full-stack roles and freelance systems work. The
          quickest way to reach me:
        </p>
        <div className="mt-4 flex flex-wrap gap-2.5">
          {LINKEDIN ? (
            <a
              href={LINKEDIN}
              target="_blank"
              rel="noreferrer noopener"
              onClick={() => track("social_click", { label: "LinkedIn", from: "contact" })}
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
              onClick={() => track("social_click", { label: "GitHub", from: "contact" })}
              className="btn-ghost"
            >
              <GitHubMark />
              GitHub
            </a>
          ) : null}
          <CVButton from="contact" variant="ghost" />
        </div>

        {/* Message form, secondary. */}
        <div className="mt-9 border-t border-line pt-6">
          <h3 className="block-label">Or send a message</h3>

          {state.succeeded ? (
            <div className="mt-4 rounded-sm border border-line bg-surface p-6">
              <h4 className="text-base font-semibold tracking-tight text-text">
                Message sent
              </h4>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">
                Thanks for reaching out. I will get back to you shortly.
              </p>
              <button
                type="button"
                onClick={reset}
                className="focus-ring mt-4 rounded-sm text-sm text-muted underline decoration-line underline-offset-[3px] transition-colors hover:text-text"
              >
                Send another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="mt-4">
              <input
                type="hidden"
                name="_subject"
                value="Portfolio contact"
                readOnly
              />

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
                  <ValidationError
                    field="name"
                    prefix="Name"
                    errors={state.errors}
                    className={errorText}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="text-[13px] font-medium text-text">
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
                <label htmlFor="message" className="text-[13px] font-medium text-text">
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

              <ValidationError errors={state.errors} className={`${errorText} mt-4`} />

              <div className="mt-5">
                <button
                  type="submit"
                  disabled={state.submitting}
                  className="btn-ghost disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {state.submitting ? "Sending" : "Send message"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </SectionShell>
  );
}
