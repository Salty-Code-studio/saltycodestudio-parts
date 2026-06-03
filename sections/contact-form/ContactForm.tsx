import { useState, type FormEvent } from "react";

export interface ContactDetail {
  /** Short label, e.g. "Email". */
  label: string;
  /** The value shown, e.g. "studio@saltycode.studio". */
  value: string;
  /** Optional link target. If set, the value renders as an anchor. */
  href?: string;
  /** Which inline icon to render alongside the detail. */
  icon?: "mail" | "phone" | "pin" | "clock";
}

export interface ContactFormProps {
  /** Small mono eyebrow above the headline. */
  eyebrow?: string;
  /** Main headline. Keep it short and confident. */
  headline?: string;
  /** Supporting line beneath the headline. */
  subcopy?: string;
  /** Contact details rendered in the right-hand card. */
  details?: ContactDetail[];
  /** Caption overlaid on the map placeholder. */
  mapCaption?: string;
  /** Label on the submit button. */
  submitLabel?: string;
  /** Reassurance line under the submit button. */
  footnote?: string;
  /** Accessible label for the section landmark. */
  ariaLabel?: string;
  /**
   * Optional submit handler. Receives the validated FormData. If omitted, the
   * form simulates a successful send and shows the thank-you state.
   */
  onSubmit?: (data: FormData) => void | Promise<void>;
}

const defaultDetails: ContactDetail[] = [
  {
    label: "Email",
    value: "studio@saltycode.studio",
    href: "mailto:studio@saltycode.studio",
    icon: "mail",
  },
  {
    label: "Phone",
    value: "+599 700 1820",
    href: "tel:+5997001820",
    icon: "phone",
  },
  {
    label: "Studio",
    value: "Kaya Grandi 42, Kralendijk, Bonaire",
    icon: "pin",
  },
  {
    label: "Hours",
    value: "Mon–Fri · 9:00–17:00 AST",
    icon: "clock",
  },
];

const icons: Record<NonNullable<ContactDetail["icon"]>, JSX.Element> = {
  mail: (
    <path
      d="M3 6.5 10 11l7-4.5M3.5 5h13a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-13a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  phone: (
    <path
      d="M6.5 3.5 8 6 6.5 7.5a9 9 0 0 0 4 4L12 10l2.5 1.5v3a1.5 1.5 0 0 1-1.6 1.5C7.8 15.6 4.4 12.2 3.5 6.6A1.5 1.5 0 0 1 5 5h1.5Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  pin: (
    <>
      <path
        d="M10 17s5.5-4.8 5.5-9a5.5 5.5 0 1 0-11 0c0 4.2 5.5 9 5.5 9Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="8" r="1.9" stroke="currentColor" strokeWidth="1.5" />
    </>
  ),
  clock: (
    <>
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M10 6v4l2.5 1.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
};

const baseField =
  "w-full rounded-xl border border-[#1C2B2E]/12 bg-[#FBF7F0] px-4 py-3 text-sm text-[#1C2B2E] shadow-sm transition-colors placeholder:text-[#1C2B2E]/40 focus:border-[#1F8A8A] focus:outline-none focus:ring-2 focus:ring-[#2EC3C3]/30 aria-[invalid=true]:border-[#FF6F59] aria-[invalid=true]:ring-[#FF6F59]/25";

type Errors = Partial<Record<"name" | "email" | "message", string>>;

/**
 * ContactForm — a validated contact form alongside studio contact details and
 * a map placeholder. Brand palette "Sand & Surf". React + Tailwind.
 *
 * Validation runs client-side on submit (and clears per-field as the visitor
 * fixes each one). With no onSubmit handler it falls back to a simulated send
 * so the component is fully demoable on its own.
 */
export default function ContactForm({
  eyebrow = "~< Say hello",
  headline = "Let's talk about your build.",
  subcopy =
    "Tell us where you are and where you'd like to be. We'll reply within one business day with next steps — no sales script, no pressure.",
  details = defaultDetails,
  mapCaption = "Kralendijk, Bonaire — Dutch Caribbean",
  submitLabel = "Send message",
  footnote = "We reply within one business day. Your details stay between us.",
  ariaLabel = "Contact us",
  onSubmit,
}: ContactFormProps) {
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  function validate(data: FormData): Errors {
    const next: Errors = {};
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    if (!name) next.name = "Please tell us your name.";
    if (!email) {
      next.email = "We need an email to reply to.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = "That email doesn't look quite right.";
    }
    if (message.length < 10) {
      next.message = "A little more detail helps us help you (10+ characters).";
    }
    return next;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const nextErrors = validate(data);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      const firstKey = Object.keys(nextErrors)[0] as keyof Errors;
      form.querySelector<HTMLElement>(`[name="${firstKey}"]`)?.focus();
      return;
    }

    setStatus("sending");
    try {
      if (onSubmit) {
        await onSubmit(data);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 700));
      }
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("idle");
    }
  }

  function clearError(field: keyof Errors) {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  return (
    <section
      aria-label={ariaLabel}
      className="relative isolate overflow-hidden bg-[#FBF7F0] text-[#1C2B2E]"
    >
      <div
        aria-hidden="true"
        className="absolute -right-32 -top-32 -z-10 h-80 w-80 rounded-full bg-[#2EC3C3]/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-40 -left-24 -z-10 h-96 w-96 rounded-full bg-[#1F8A8A]/8 blur-3xl"
      />

      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24 lg:py-28">
        <div className="max-w-2xl">
          {eyebrow ? (
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-[#1F8A8A]">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="font-[var(--font-display,inherit)] text-3xl font-bold leading-tight tracking-tight text-[#0F5C5C] sm:text-4xl lg:text-5xl">
            {headline}
          </h2>
          {subcopy ? (
            <p className="mt-5 max-w-xl text-base leading-relaxed text-[#4A5D66] sm:text-lg">
              {subcopy}
            </p>
          ) : null}
        </div>

        <div className="mt-12 grid gap-8 lg:mt-16 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
          {/* Form card */}
          <div className="rounded-3xl border border-[#1C2B2E]/8 bg-white/70 p-6 shadow-[0_24px_60px_-32px_rgba(15,92,92,0.35)] backdrop-blur sm:p-8">
            {status === "sent" ? (
              <div
                role="status"
                className="flex h-full min-h-[20rem] flex-col items-center justify-center text-center"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#2EC3C3]/15 text-[#0F5C5C]">
                  <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7">
                    <path
                      d="m5 12.5 4 4 10-10"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <h3 className="mt-5 font-[var(--font-display,inherit)] text-xl font-bold text-[#0F5C5C]">
                  Message on its way.
                </h3>
                <p className="mt-2 max-w-sm text-sm text-[#4A5D66]">
                  Thanks for reaching out — we&apos;ll be back to you within one
                  business day. Check your inbox (and the occasional spam
                  folder).
                </p>
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="mt-6 text-sm font-semibold text-[#1F8A8A] underline-offset-4 transition-colors hover:text-[#0F5C5C] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F8A8A]"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form noValidate onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="cf-name"
                      className="mb-1.5 block text-sm font-medium text-[#1C2B2E]"
                    >
                      Name
                    </label>
                    <input
                      id="cf-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      placeholder="Marisol Anthony"
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? "cf-name-error" : undefined}
                      onChange={() => clearError("name")}
                      className={baseField}
                    />
                    {errors.name ? (
                      <p
                        id="cf-name-error"
                        className="mt-1.5 text-xs font-medium text-[#c8472f]"
                      >
                        {errors.name}
                      </p>
                    ) : null}
                  </div>

                  <div>
                    <label
                      htmlFor="cf-email"
                      className="mb-1.5 block text-sm font-medium text-[#1C2B2E]"
                    >
                      Email
                    </label>
                    <input
                      id="cf-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@company.com"
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={
                        errors.email ? "cf-email-error" : undefined
                      }
                      onChange={() => clearError("email")}
                      className={baseField}
                    />
                    {errors.email ? (
                      <p
                        id="cf-email-error"
                        className="mt-1.5 text-xs font-medium text-[#c8472f]"
                      >
                        {errors.email}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="cf-company"
                    className="mb-1.5 block text-sm font-medium text-[#1C2B2E]"
                  >
                    Company{" "}
                    <span className="font-normal text-[#1C2B2E]/45">
                      (optional)
                    </span>
                  </label>
                  <input
                    id="cf-company"
                    name="company"
                    type="text"
                    autoComplete="organization"
                    placeholder="Where you work"
                    className={baseField}
                  />
                </div>

                <div>
                  <label
                    htmlFor="cf-message"
                    className="mb-1.5 block text-sm font-medium text-[#1C2B2E]"
                  >
                    What can we help with?
                  </label>
                  <textarea
                    id="cf-message"
                    name="message"
                    rows={5}
                    placeholder="A few lines about the project, timeline, and budget range if you have one."
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={
                      errors.message ? "cf-message-error" : undefined
                    }
                    onChange={() => clearError("message")}
                    className={`${baseField} resize-y`}
                  />
                  {errors.message ? (
                    <p
                      id="cf-message-error"
                      className="mt-1.5 text-xs font-medium text-[#c8472f]"
                    >
                      {errors.message}
                    </p>
                  ) : null}
                </div>

                <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1F8A8A] px-7 py-3.5 text-sm font-semibold text-[#FBF7F0] shadow-lg shadow-[#1F8A8A]/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#0F5C5C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F8A8A] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
                  >
                    {status === "sending" ? (
                      <>
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 20 20"
                          fill="none"
                          className="h-4 w-4 animate-spin"
                        >
                          <circle
                            cx="10"
                            cy="10"
                            r="7"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="opacity-25"
                          />
                          <path
                            d="M17 10a7 7 0 0 0-7-7"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                        Sending…
                      </>
                    ) : (
                      <>
                        {submitLabel}
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 20 20"
                          fill="none"
                          className="h-4 w-4"
                        >
                          <path
                            d="M4 10h12m0 0-4.5-4.5M16 10l-4.5 4.5"
                            stroke="currentColor"
                            strokeWidth="1.75"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </>
                    )}
                  </button>
                  {footnote ? (
                    <p className="text-xs text-[#4A5D66] sm:max-w-[18rem] sm:text-right">
                      {footnote}
                    </p>
                  ) : null}
                </div>
              </form>
            )}
          </div>

          {/* Details + map */}
          <div className="flex flex-col gap-6">
            <ul className="grid gap-5 rounded-3xl border border-[#1C2B2E]/8 bg-[#F4ECE0] p-6 sm:p-7">
              {details.map((detail) => (
                <li key={detail.label} className="flex items-start gap-4">
                  <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#2EC3C3]/15 text-[#0F5C5C]">
                    <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5">
                      {icons[detail.icon ?? "mail"]}
                    </svg>
                  </span>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#4A5D66]">
                      {detail.label}
                    </p>
                    {detail.href ? (
                      <a
                        href={detail.href}
                        className="mt-0.5 block text-sm font-semibold text-[#1C2B2E] transition-colors hover:text-[#1F8A8A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F8A8A]"
                      >
                        {detail.value}
                      </a>
                    ) : (
                      <p className="mt-0.5 text-sm font-semibold text-[#1C2B2E]">
                        {detail.value}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            {/* Map placeholder */}
            <div
              role="img"
              aria-label={`Map of ${mapCaption}`}
              className="relative isolate flex min-h-[12rem] flex-1 items-end overflow-hidden rounded-3xl border border-[#1C2B2E]/8 bg-[#ECE0CD]"
            >
              <svg
                aria-hidden="true"
                className="absolute inset-0 -z-10 h-full w-full text-[#1F8A8A]/15"
                preserveAspectRatio="xMidYMid slice"
                viewBox="0 0 400 240"
                fill="none"
              >
                <rect width="400" height="240" fill="#E7D8C2" />
                <path
                  d="M0 80h400M0 150h400M0 200h400M90 0v240M210 0v240M320 0v240"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M-20 120C80 60 160 200 260 130S420 80 440 150"
                  stroke="#2EC3C3"
                  strokeOpacity="0.5"
                  strokeWidth="6"
                  fill="none"
                />
                <circle cx="210" cy="150" r="34" fill="#2EC3C3" fillOpacity="0.12" />
              </svg>
              <span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FF6F59] text-[#1C2B2E] shadow-lg shadow-[#0F5C5C]/30 ring-4 ring-[#FBF7F0]">
                  <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5">
                    {icons.pin}
                  </svg>
                </span>
              </span>
              <p className="relative m-4 rounded-full bg-[#FBF7F0]/85 px-4 py-1.5 text-xs font-medium text-[#0F5C5C] backdrop-blur">
                {mapCaption}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
