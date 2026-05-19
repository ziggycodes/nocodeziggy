"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { HudPanel } from "@/components/ui/HudPanel";
import { CtaButton } from "@/components/ui/CtaButton";
import { Logo } from "@/components/chrome/Logo";
import { profile } from "@/content/profile";
import { parseContactInterest } from "@/lib/contact-link";
import { cn } from "@/lib/cn";

const INTEREST_OPTIONS = [
  { id: "", label: "What can I help with? (optional)" },
  { id: "ai-agents", label: "AI Agents" },
  { id: "automation", label: "Workflow Automation" },
  { id: "saas", label: "Bubble SaaS Build" },
  { id: "lead-gen", label: "AI Lead Generation" },
  { id: "voice", label: "AI Voice / Receptionist" },
  { id: "other", label: "Something else" },
];

const BUDGET_OPTIONS = [
  { id: "", label: "Project budget (optional)" },
  { id: "under-500", label: "Under $500" },
  { id: "500-2k", label: "$500 – $2K" },
  { id: "2k-plus", label: "$2K+" },
  { id: "prefer-not", label: "Prefer not to say" },
];

type Phase = "idle" | "sending" | "sent" | "error";

export function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState("");
  const [budget, setBudget] = useState("");
  const [message, setMessage] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [errorText, setErrorText] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const apply = () => {
      const id = parseContactInterest();
      if (id && INTEREST_OPTIONS.find((o) => o.id === id)) {
        setInterest(id);
      }
    };
    apply();
    window.addEventListener("hashchange", apply);
    window.addEventListener("popstate", apply);
    return () => {
      window.removeEventListener("hashchange", apply);
      window.removeEventListener("popstate", apply);
    };
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim() || phase !== "idle") return;
    setErrorText(null);
    setPhase("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          handle: email.trim() || null,
          stack: interest || null,
          budget: budget || null,
          message: message.trim(),
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        throw new Error(json.error ?? "Something went wrong sending the message.");
      }
      setPhase("sent");
    } catch (err: any) {
      setErrorText(err?.message ?? "Something went wrong sending the message.");
      setPhase("error");
    }
  };

  const reset = () => {
    setName("");
    setEmail("");
    setInterest("");
    setBudget("");
    setMessage("");
    setPhase("idle");
    setErrorText(null);
  };

  return (
    <section id="contact" className="relative bg-[var(--color-void)] py-24 md:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-0 grid-floor opacity-[0.5]" />

      <div className="relative mx-auto w-full max-w-[1400px] px-6 md:px-10">
        <SectionHeader
          eyebrow="Contact"
          title={
            <>
              Let's build something{" "}
              <span className="text-[var(--color-mid)]">serious.</span>
            </>
          }
          description="Tell me what you'd like to operationalize. I'll respond within 24 hours."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-12">
          {/* Form */}
          <div className="lg:col-span-8">
            <HudPanel bodyClassName="p-6 md:p-10">
              <AnimatePresence mode="wait">
                {phase === "sent" ? (
                  <SentScreen onReset={reset} key="sent" />
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={submit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-5"
                  >
                    <div className="grid gap-5 md:grid-cols-2">
                      <Field
                        label="Name"
                        id="name"
                        value={name}
                        onChange={setName}
                        placeholder="Your name"
                        required
                      />
                      <Field
                        label="Email"
                        id="email"
                        type="email"
                        value={email}
                        onChange={setEmail}
                        placeholder="you@domain.com"
                        required
                      />
                    </div>

                    <SelectField
                      label="Interest"
                      id="interest"
                      value={interest}
                      onChange={setInterest}
                      options={INTEREST_OPTIONS}
                    />

                    <TextareaField
                      label="Message"
                      id="message"
                      value={message}
                      onChange={setMessage}
                      placeholder="What are you building, and where could a system help?"
                      required
                    />

                    {errorText && (
                      <div className="text-[13px] text-[#F59E0B]">{errorText}</div>
                    )}

                    <div className="mt-3 flex items-center justify-between gap-3 border-t border-[var(--color-grid)] pt-5">
                      <p className="text-[12px] text-[var(--color-mid)]">
                        I read every message. Response within 24 hours.
                      </p>
                      <CtaButton
                        type="submit"
                        disabled={
                          !name.trim() ||
                          !email.trim() ||
                          !message.trim() ||
                          phase === "sending"
                        }
                        className="disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {phase === "sending" ? "Sending…" : "Send message"}
                      </CtaButton>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </HudPanel>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 flex flex-col gap-4">
            <HudPanel bodyClassName="flex flex-col gap-4 p-1">
              <div className="text-[12px] tracking-[0.04em] text-[var(--color-mid)]">
                Prefer to pick a time?
              </div>
              <p className="text-[14px] leading-relaxed text-[var(--color-hi)]">
                {profile.booking.label}
              </p>
              <CtaButton
                href={profile.booking.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full justify-center"
              >
                Schedule on Calendly
              </CtaButton>
            </HudPanel>

            <HudPanel
              bodyClassName="flex flex-col gap-2"
            >
              <div className="mb-2 text-[12px] tracking-[0.04em] text-[var(--color-mid)]">
                Direct channels
              </div>
              <Channel
                label="X"
                handle="@nocodeziggy"
                href={profile.socials.x}
              />
              <Channel
                label="LinkedIn"
                handle="/in/isaac-ayodele-1a0208168"
                href={profile.socials.linkedin}
              />
              <Channel
                label="Email"
                handle={profile.email}
                href={`mailto:${profile.email}`}
              />
            </HudPanel>

            <HudPanel
              bodyClassName="flex flex-col gap-3"
            >
              <div className="text-[12px] tracking-[0.04em] text-[var(--color-mid)]">
                Working hours
              </div>
              <div className="flex items-center justify-between text-[14px]">
                <span className="text-[var(--color-mid)]">Mon — Fri</span>
                <span className="text-[var(--color-hi)]">UTC+1</span>
              </div>
              <div className="flex items-center justify-between text-[14px]">
                <span className="text-[var(--color-mid)]">Response time</span>
                <span className="text-[var(--color-hi)]">&lt; 24 hours</span>
              </div>
              <div className="flex items-center gap-2 pt-2 text-[13px] text-[var(--color-accent)]">
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)] animate-pulse" />
                Currently taking projects
              </div>
            </HudPanel>
          </aside>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────────────────────
   Form atoms — clean
   ────────────────────────────────────────────────────────────────────────────── */
function Field({
  label,
  id,
  value,
  onChange,
  placeholder,
  required,
  type = "text",
}: {
  label: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <label htmlFor={id} className="flex flex-col gap-2">
      <span className="text-[12px] tracking-[0.04em] text-[var(--color-mid)]">
        {label}
        {required && <span className="ml-1 text-[var(--color-accent)]">*</span>}
      </span>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full border border-[var(--color-grid)] bg-[var(--color-void)] px-3 py-3 text-[15px] text-[var(--color-hi)] placeholder:text-[var(--color-dim)] focus:border-[var(--color-accent)] focus:outline-none focus-visible:outline-none transition-colors"
        autoComplete="off"
      />
    </label>
  );
}

function TextareaField({
  label,
  id,
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label htmlFor={id} className="flex flex-col gap-2">
      <span className="text-[12px] tracking-[0.04em] text-[var(--color-mid)]">
        {label}
        {required && <span className="ml-1 text-[var(--color-accent)]">*</span>}
      </span>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        rows={6}
        className="w-full resize-y border border-[var(--color-grid)] bg-[var(--color-void)] px-3 py-3 text-[15px] text-[var(--color-hi)] placeholder:text-[var(--color-dim)] focus:border-[var(--color-accent)] focus:outline-none focus-visible:outline-none transition-colors"
      />
    </label>
  );
}

function SelectField({
  label,
  id,
  value,
  onChange,
  options,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  options: { id: string; label: string }[];
}) {
  return (
    <label htmlFor={id} className="flex flex-col gap-2">
      <span className="text-[12px] tracking-[0.04em] text-[var(--color-mid)]">
        {label}
      </span>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none border border-[var(--color-grid)] bg-[var(--color-void)] px-3 py-3 pr-10 text-[15px] text-[var(--color-hi)] focus:border-[var(--color-accent)] focus:outline-none focus-visible:outline-none transition-colors"
        >
          {options.map((o) => (
            <option key={o.id} value={o.id} className="bg-[var(--color-void)]">
              {o.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-mid)]">
          ▾
        </span>
      </div>
    </label>
  );
}

/* ──────────────────────────────────────────────────────────────────────────────
   Sent state — calm confirmation
   ────────────────────────────────────────────────────────────────────────────── */
function SentScreen({ onReset }: { onReset: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center gap-6 py-8 text-center md:py-12"
    >
      <div className="relative">
        <span
          aria-hidden
          className="absolute -inset-4 rounded-full border border-[color:rgb(143_176_214/0.40)] animate-pulse"
        />
        <Logo withWordmark={false} size={56} />
      </div>
      <div>
        <div className="mb-2 text-[12px] tracking-[0.04em] text-[var(--color-accent)]">
          Message received
        </div>
        <h3 className="text-[clamp(1.6rem,3vw,2.2rem)] font-bold tracking-tight">
          Thanks — I'll be in touch.
        </h3>
        <p className="mx-auto mt-3 max-w-[44ch] text-[15px] leading-relaxed text-[var(--color-mid)]">
          Expect a reply within 24 hours. In the meantime, dig into the work above
          or watch a build log.
        </p>
      </div>
      <CtaButton
        href={profile.booking.url}
        target="_blank"
        rel="noopener noreferrer"
        variant="ghost"
      >
        Or book a call now
      </CtaButton>
      <button
        type="button"
        onClick={onReset}
        className="mt-2 inline-flex items-center gap-2 text-[13px] text-[var(--color-mid)] hover:text-[var(--color-hi)] transition-colors"
      >
        Send another message
        <span aria-hidden className="font-mono text-[var(--color-accent)]">→</span>
      </button>
    </motion.div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────────
   Sidebar atoms
   ────────────────────────────────────────────────────────────────────────────── */
function Channel({
  label,
  handle,
  href,
}: {
  label: string;
  handle: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noreferrer"
      className={cn(
        "group flex items-center justify-between gap-3 border border-transparent px-2 py-2",
        "hover:border-[var(--color-grid)] transition-colors"
      )}
    >
      <span className="text-[14px] text-[var(--color-hi)]">{label}</span>
      <div className="flex items-center gap-2 text-[13px] text-[var(--color-mid)] group-hover:text-[var(--color-accent)] transition-colors">
        {handle}
        <span aria-hidden className="font-mono">↗</span>
      </div>
    </a>
  );
}
