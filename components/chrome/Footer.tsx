"use client";

import { Logo } from "./Logo";
import { profile } from "@/content/profile";

export function Footer() {
  const year = new Date().getUTCFullYear();

  return (
    <footer className="relative border-t border-[var(--color-grid)] bg-[var(--color-void)]">
      <div className="mx-auto grid w-full max-w-[1400px] gap-10 px-6 py-12 md:grid-cols-12 md:px-10">
        <div className="md:col-span-7 flex flex-col gap-4">
          <Logo size={28} className="opacity-95" />
          <p className="max-w-md text-[14px] text-[var(--color-mid)] leading-relaxed">
            {profile.bio.short}
          </p>
        </div>

        <div className="md:col-span-3">
          <div className="mb-3 text-[12px] tracking-[0.04em] text-[var(--color-mid)]">
            Channels
          </div>
          <ul className="space-y-2 text-[14px]">
            <li>
              <a
                href={profile.socials.x}
                target="_blank"
                rel="noreferrer"
                className="text-[var(--color-mid)] hover:text-[var(--color-hi)] transition-colors"
              >
                X
              </a>
            </li>
            <li>
              <a
                href={profile.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                className="text-[var(--color-mid)] hover:text-[var(--color-hi)] transition-colors"
              >
                LinkedIn
              </a>
            </li>
            <li>
              <a
                href={`mailto:${profile.email}`}
                className="text-[var(--color-mid)] hover:text-[var(--color-hi)] transition-colors"
              >
                Email
              </a>
            </li>
          </ul>
        </div>

        <div className="md:col-span-2">
          <div className="mb-3 text-[12px] tracking-[0.04em] text-[var(--color-mid)]">
            Status
          </div>
          <div className="flex items-center gap-2 text-[13px] text-[var(--color-accent)]">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)] animate-pulse" />
            Available
          </div>
          <div className="mt-1 text-[12px] text-[var(--color-mid)]">
            {profile.location} · {profile.utc}
          </div>
        </div>
      </div>

      <div className="border-t border-[var(--color-grid)]">
        <div className="mx-auto flex w-full max-w-[1400px] flex-col items-start justify-between gap-2 px-6 py-5 text-[12px] text-[var(--color-dim)] md:flex-row md:items-center md:px-10">
          <span>© {year} NoCodeZiggy</span>
          <span>Running on coffee + n8n</span>
        </div>
      </div>
    </footer>
  );
}
