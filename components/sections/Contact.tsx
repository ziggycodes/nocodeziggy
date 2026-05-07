"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatusPill } from "@/components/ui/StatusPill";
import { HudPanel } from "@/components/ui/HudPanel";
import { CtaButton } from "@/components/ui/CtaButton";
import { TerminalLine } from "@/components/ui/TerminalLine";
import { stacks } from "@/content/services";
import { profile } from "@/content/profile";
import { cn } from "@/lib/cn";

type Phase = "idle" | "compiling" | "transmitting" | "sent" | "error";

export function Contact() {
  const [name, setName] = useState("");
  const [handleVal, setHandleVal] = useState("");
  const [stackId, setStackId] = useState<string>("");
  const [message, setMessage] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [errorText, setErrorText] = useState<string | null>(null);
  const [transmissionId, setTransmissionId] = useState<string | null>(null);

  // Pre-select stack from URL hash like #contact?stack=stk-01
  useEffect(() => {
    if (typeof window === "undefined") return;
    const apply = () => {
      const hash = window.location.hash;
      const m = hash.match(/stack=([\w-]+)/);
      if (m && stacks.find((s) => s.id === m[1])) {
        setStackId(m[1]);
      }
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim() || phase !== "idle") return;
    setErrorText(null);

    setPhase("compiling");
    await new Promise((r) => setTimeout(r, 600));
    setPhase("transmitting");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          handle: handleVal.trim() || null,
          stack: stackId || null,
          message: message.trim(),
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        throw new Error(json.error ?? "transmission failed");
      }
      setTransmissionId(json.id);
      await new Promise((r) => setTimeout(r, 600));
      setPhase("sent");
    } catch (err: any) {
      setErrorText(err?.message ?? "transmission failed");
      setPhase("error");
    }
  };

  const reset = () => {
    setName("");
    setHandleVal("");
    setStackId("");
    setMessage("");
    setPhase("idle");
    setErrorText(null);
    setTransmissionId(null);
  };

  return (
    <section id="contact" className="relative bg-[var(--color-void)] py-24 md:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-0 grid-floor opacity-[0.5]" />

      <div className="relative mx-auto w-full max-w-[1400px] px-6 md:px-10">
        <SectionHeader
          code="SEC-06"
          eyebrow="INITIATE TRANSMISSION"
          title={
            <>
              Open a channel.{" "}
              <span className="text-[var(--color-mid)]">Let's build something serious.</span>
            </>
          }
          description="No forms-as-theatre. Tell me what you want to operationalize and we'll book a working session."
          meta={<StatusPill tone="cyan">CHANNEL OPEN</StatusPill>}
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-12">
          {/* Terminal form */}
          <div className="lg:col-span-8">
            <HudPanel
              live
              code="NOCZ-COMMS // TX-001"
              tag={
                <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-[var(--color-mid)]">
                  <span className="text-[var(--color-cyan)]">●</span> SECURE
                </div>
              }
              bodyClassName="p-6 md:p-8 font-mono text-[13px]"
            >
              <TerminalLine
                text="nocz-comms initiate --new"
                speed={26}
                whileInView
                caret={false}
                className="mb-3"
              />

              <AnimatePresence mode="wait">
                {phase === "sent" ? (
                  <SentScreen txId={transmissionId} onReset={reset} />
                ) : phase === "compiling" || phase === "transmitting" ? (
                  <ProgressScreen phase={phase} />
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={submit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-3"
                  >
                    <Field
                      label="name"
                      id="name"
                      value={name}
                      onChange={setName}
                      placeholder="who's transmitting?"
                      required
                    />
                    <Field
                      label="handle"
                      id="handle"
                      value={handleVal}
                      onChange={setHandleVal}
                      placeholder="@you (optional)"
                    />
                    <SelectField
                      label="stack-of-interest"
                      id="stack"
                      value={stackId}
                      onChange={setStackId}
                      options={[
                        { id: "", label: "(any · open conversation)" },
                        ...stacks.map((s) => ({
                          id: s.id,
                          label: `${s.code} · ${s.title}`,
                        })),
                      ]}
                    />
                    <TextareaField
                      label="message"
                      id="message"
                      value={message}
                      onChange={setMessage}
                      placeholder="describe what you want to operationalize."
                      required
                    />

                    {errorText && (
                      <div className="text-[12px] text-[#F59E0B]">
                        {`> error: ${errorText}`}
                      </div>
                    )}

                    <div className="mt-3 flex items-center justify-between gap-3 border-t border-[var(--color-grid)] pt-4">
                      <div className="text-[10px] tracking-[0.2em] text-[var(--color-dim)]">
                        ESC TO ABORT · ENTER TO TRANSMIT
                      </div>
                      <CtaButton
                        type="submit"
                        disabled={!name.trim() || !message.trim()}
                        className="disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Transmit
                      </CtaButton>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </HudPanel>
          </div>

          {/* Channels */}
          <aside className="lg:col-span-4 flex flex-col gap-4">
            <HudPanel
              code="DIRECT CHANNELS"
              bodyClassName="flex flex-col gap-3"
              compact
            >
              <Channel
                code="CH_01"
                label="YouTube"
                handle="@nocodeziggy"
                href={profile.socials.youtube}
              />
              <Channel
                code="CH_02"
                label="X"
                handle="@nocodeziggy"
                href={profile.socials.x}
              />
              <Channel
                code="CH_03"
                label="Email"
                handle={profile.email}
                href={`mailto:${profile.email}`}
              />
              <Channel
                code="CH_04"
                label="LinkedIn"
                handle="/in/nocodeziggy"
                href={profile.socials.linkedin}
              />
            </HudPanel>

            <HudPanel
              code="CHANNEL META"
              bodyClassName="grid gap-3 font-mono text-[12px]"
              compact
            >
              <Meta label="LATENCY" value="< 24H" />
              <Meta label="HOURS" value="MON–FRI · UTC+1" />
              <Meta label="MODE" value="ASYNC-FIRST" />
              <Meta
                label="STATUS"
                value={
                  <span className="inline-flex items-center gap-1.5 text-[var(--color-cyan)]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-cyan)] animate-pulse" />
                    OPEN
                  </span>
                }
              />
            </HudPanel>
          </aside>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────────────────────
   Form atoms — terminal-styled
   ────────────────────────────────────────────────────────────────────────────── */
function Field({
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
    <label
      htmlFor={id}
      className="flex flex-col gap-1.5 cursor-text"
    >
      <span className="flex items-center gap-2 text-[var(--color-mid)]">
        <span className="text-[var(--color-cyan)]">{">"}</span>
        {label}
        {required && <span className="text-[var(--color-dim)] text-[11px]">*</span>}
        <span className="text-[var(--color-grid)]">:</span>
      </span>
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full border border-[var(--color-grid)] bg-[var(--color-void)] px-3 py-2 text-[var(--color-hi)] placeholder:text-[var(--color-dim)] focus:border-[var(--color-cyan)] focus:outline-none focus-visible:outline-none"
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
    <label htmlFor={id} className="flex flex-col gap-1.5 cursor-text">
      <span className="flex items-center gap-2 text-[var(--color-mid)]">
        <span className="text-[var(--color-cyan)]">{">"}</span>
        {label}
        {required && <span className="text-[var(--color-dim)] text-[11px]">*</span>}
        <span className="text-[var(--color-grid)]">:</span>
      </span>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        rows={5}
        className="w-full resize-y border border-[var(--color-grid)] bg-[var(--color-void)] px-3 py-2 text-[var(--color-hi)] placeholder:text-[var(--color-dim)] focus:border-[var(--color-cyan)] focus:outline-none focus-visible:outline-none"
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
    <label htmlFor={id} className="flex flex-col gap-1.5 cursor-pointer">
      <span className="flex items-center gap-2 text-[var(--color-mid)]">
        <span className="text-[var(--color-cyan)]">{">"}</span>
        {label}
        <span className="text-[var(--color-grid)]">:</span>
      </span>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none border border-[var(--color-grid)] bg-[var(--color-void)] px-3 py-2 pr-10 text-[var(--color-hi)] focus:border-[var(--color-cyan)] focus:outline-none focus-visible:outline-none"
        >
          {options.map((o) => (
            <option key={o.id} value={o.id} className="bg-[var(--color-void)]">
              {o.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-mid)]">
          ▾
        </span>
      </div>
    </label>
  );
}

/* ──────────────────────────────────────────────────────────────────────────────
   Phase screens
   ────────────────────────────────────────────────────────────────────────────── */
function ProgressScreen({ phase }: { phase: Exclude<Phase, "idle" | "sent" | "error"> }) {
  const steps = [
    { key: "compiling", label: "compiling payload..." },
    { key: "transmitting", label: "opening encrypted channel..." },
    { key: "transmitting", label: "transmitting..." },
  ];

  const reachedIdx = phase === "compiling" ? 0 : 2;

  return (
    <motion.div
      key="progress"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-1 py-3"
    >
      {steps.map((s, i) => (
        <div
          key={i}
          className={cn(
            "flex items-center gap-2",
            i <= reachedIdx ? "text-[var(--color-hi)]" : "text-[var(--color-dim)]"
          )}
        >
          <span className={i <= reachedIdx ? "text-[var(--color-cyan)]" : "text-[var(--color-grid)]"}>
            {">"}
          </span>
          {s.label}
          {i === reachedIdx && (
            <span
              aria-hidden
              className="ml-1 inline-block h-3 w-1.5 bg-[var(--color-hi)]"
              style={{ animation: "nocz-blink 0.7s steps(1) infinite" }}
            />
          )}
        </div>
      ))}
    </motion.div>
  );
}

function SentScreen({
  txId,
  onReset,
}: {
  txId: string | null;
  onReset: () => void;
}) {
  return (
    <motion.div
      key="sent"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-3 py-3"
    >
      <div className="text-[var(--color-cyan)]">
        {`> [OK] TRANSMISSION_SENT`}
      </div>
      <div className="text-[var(--color-mid)]">
        {`> id: ${txId ?? "TXM-XXXXXX"}`}
      </div>
      <div className="text-[var(--color-mid)]">
        {`> response window: 24h`}
      </div>
      <div className="text-[var(--color-mid)]">
        {`> stay sharp.`}
      </div>
      <button
        type="button"
        onClick={onReset}
        className="mt-3 self-start border border-[var(--color-grid)] px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-[var(--color-mid)] hover:border-[var(--color-hi)] hover:text-[var(--color-hi)]"
      >
        New Transmission
      </button>
    </motion.div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────────
   Sidebar bits
   ────────────────────────────────────────────────────────────────────────────── */
function Channel({
  code,
  label,
  handle,
  href,
}: {
  code: string;
  label: string;
  handle: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noreferrer"
      className="group flex items-center justify-between gap-3 border border-[var(--color-grid)] bg-[var(--color-void)] px-3 py-2.5 transition-colors hover:border-[var(--color-cyan)]"
    >
      <div className="flex items-center gap-3">
        <span className="font-mono text-[10px] tracking-[0.2em] text-[var(--color-cyan)]">
          {code}
        </span>
        <span className="text-[14px] text-[var(--color-hi)]">{label}</span>
      </div>
      <div className="flex items-center gap-2 text-[12px] text-[var(--color-mid)] group-hover:text-[var(--color-hi)]">
        {handle}
        <span aria-hidden className="font-mono">↗</span>
      </div>
    </a>
  );
}

function Meta({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between border-b border-[var(--color-grid)] py-1 last:border-b-0">
      <span className="text-[var(--color-mid)] tracking-[0.18em] text-[10px] uppercase">{label}</span>
      <span className="text-[var(--color-hi)]">{value}</span>
    </div>
  );
}
