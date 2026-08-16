"use client";

import { SectionShell } from "@/components/layout/SectionShell";
import { CVButton } from "@/components/ui/CVButton";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { profile } from "@/content/profile";
import { track } from "@/lib/analytics";
import { useForm, ValidationError } from "@formspree/react";
import { useEffect } from "react";

/**
 * Formspree form id. Public by design: it ships in the client bundle either
 * way, and Formspree scopes abuse protection to the form itself.
 */
const FORM_ID = "xnpabgrq";

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
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)] lg:gap-14">
        <div>
          {state.succeeded ? (
            <div className="rounded-sm border border-line bg-surface p-6">
              <h3 className="text-base font-semibold tracking-tight text-text">
                Message sent
              </h3>
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
            <form onSubmit={handleSubmit} noValidate>
              {/* Sets the subject line of the notification email. */}
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
                <ValidationError
                  field="message"
                  prefix="Message"
                  errors={state.errors}
                  className={errorText}
                />
              </div>

              {/* Anything Formspree rejects at the form level, e.g. a blocked
                  submission or an outage, rather than a single bad field. */}
              <ValidationError
                errors={state.errors}
                className={`${errorText} mt-4`}
              />

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  disabled={state.submitting}
                  className="btn-primary disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {state.submitting ? "Sending" : "Send message"}
                </button>
               
              </div>
            </form>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="block-label">Profiles</h3>
            <div className="mt-1.5">
              <SocialLinks from="contact" />
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
