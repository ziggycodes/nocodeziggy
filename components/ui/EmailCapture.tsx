"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

type MailingListKey = "lead-magnet" | "newsletter" | "lab";

type Props = {
  source: string;
  mailingList?: MailingListKey;
  labInterest?: string;
  submitLabel?: string;
  placeholder?: string;
  compact?: boolean;
  className?: string;
  onSuccess?: () => void;
};

export function EmailCapture({
  source,
  mailingList,
  labInterest,
  submitLabel = "Subscribe",
  placeholder = "you@domain.com",
  compact = false,
  className,
  onSuccess,
}: Props) {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [phase, setPhase] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorText, setErrorText] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || phase === "sending") return;
    setErrorText(null);
    setPhase("sending");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          source,
          mailingList,
          labInterest,
          website,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        throw new Error(json.error ?? "Something went wrong.");
      }
      setPhase("sent");
      onSuccess?.();
    } catch (err: unknown) {
      setErrorText(
        err instanceof Error ? err.message : "Something went wrong."
      );
      setPhase("error");
    }
  };

  if (phase === "sent") {
    return (
      <p
        className={cn(
          "text-[13px] text-[var(--color-accent)]",
          compact && "text-[12px]",
          className
        )}
      >
        You&apos;re on the list — check your inbox.
      </p>
    );
  }

  return (
    <form
      onSubmit={submit}
      className={cn("flex w-full flex-col gap-2", className)}
    >
      <div
        className={cn(
          "flex w-full gap-2",
          compact ? "flex-col sm:flex-row" : "flex-col sm:flex-row"
        )}
      >
        <input
          type="text"
          name="website"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          className="absolute h-0 w-0 opacity-0 pointer-events-none"
          aria-hidden
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          required
          disabled={phase === "sending"}
          className={cn(
            "min-w-0 flex-1 border border-[var(--color-grid)] bg-[var(--color-void)] px-3 text-[var(--color-hi)] placeholder:text-[var(--color-dim)] focus:border-[var(--color-accent)] focus:outline-none transition-colors",
            compact ? "py-2 text-[13px]" : "py-3 text-[14px]"
          )}
        />
        <button
          type="submit"
          disabled={!email.trim() || phase === "sending"}
          className={cn(
            "shrink-0 bg-[var(--color-accent)] font-medium text-[var(--color-void)] transition-[filter,opacity] hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed",
            compact ? "px-4 py-2 text-[12px]" : "px-5 py-3 text-[13px]"
          )}
          style={{ boxShadow: "0 0 14px var(--color-accent-glow)" }}
        >
          {phase === "sending" ? "…" : submitLabel}
        </button>
      </div>
      {errorText && (
        <p className="text-[12px] text-[#F59E0B]">{errorText}</p>
      )}
    </form>
  );
}
