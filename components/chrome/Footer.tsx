"use client";

import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { profile } from "@/content/profile";

function useUptime() {
  const [text, setText] = useState("00:00:00");
  useEffect(() => {
    const start = Date.now();
    const tick = () => {
      const ms = Date.now() - start;
      const s = Math.floor(ms / 1000) % 60;
      const m = Math.floor(ms / 60000) % 60;
      const h = Math.floor(ms / 3_600_000);
      setText(
        `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
      );
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);
  return text;
}

function useUtcClock() {
  const [text, setText] = useState("");
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const hh = String(d.getUTCHours()).padStart(2, "0");
      const mm = String(d.getUTCMinutes()).padStart(2, "0");
      setText(`${hh}:${mm} UTC`);
    };
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);
  return text;
}

export function Footer() {
  const uptime = useUptime();
  const utc = useUtcClock();
  const year = new Date().getUTCFullYear();

  return (
    <footer className="relative border-t border-[var(--color-grid)] bg-[var(--color-void)]">
      <div className="mx-auto grid w-full max-w-[1400px] gap-10 px-6 py-12 md:grid-cols-12 md:px-10">
        <div className="md:col-span-6 flex flex-col gap-4">
          <Logo size={28} className="opacity-90" />
          <p className="max-w-md text-[14px] text-[var(--color-mid)] leading-relaxed">
            {profile.bio.short}
          </p>
        </div>

        <div className="md:col-span-2">
          <div className="text-hud-label mb-3">Channels</div>
          <ul className="space-y-2 text-[13px]">
            <li>
              <a
                href={profile.socials.youtube}
                target="_blank"
                rel="noreferrer"
                className="text-[var(--color-mid)] hover:text-[var(--color-hi)] transition-colors"
              >
                CH_01 · YouTube
              </a>
            </li>
            <li>
              <a
                href={profile.socials.x}
                target="_blank"
                rel="noreferrer"
                className="text-[var(--color-mid)] hover:text-[var(--color-hi)] transition-colors"
              >
                CH_02 · X
              </a>
            </li>
            <li>
              <a
                href={`mailto:${profile.email}`}
                className="text-[var(--color-mid)] hover:text-[var(--color-hi)] transition-colors"
              >
                CH_03 · Email
              </a>
            </li>
          </ul>
        </div>

        <div className="md:col-span-4 grid grid-cols-2 gap-6">
          <div>
            <div className="text-hud-label mb-3">Status</div>
            <div className="font-mono text-[12px] space-y-1">
              <div className="flex items-center gap-2 text-[var(--color-cyan)]">
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[var(--color-cyan)] animate-pulse" />
                OPERATIONAL
              </div>
              <div className="text-[var(--color-mid)]">UP {uptime}</div>
              <div className="text-[var(--color-mid)]">{utc}</div>
            </div>
          </div>
          <div>
            <div className="text-hud-label mb-3">Coords</div>
            <div className="font-mono text-[12px] space-y-1 text-[var(--color-mid)]">
              <div>{profile.location}</div>
              <div>{profile.utc}</div>
              <div>NOCZ-OS · v.1</div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-[var(--color-grid)]">
        <div className="mx-auto flex w-full max-w-[1400px] flex-col items-start justify-between gap-2 px-6 py-5 font-mono text-[10px] tracking-[0.2em] text-[var(--color-dim)] md:flex-row md:items-center md:px-10">
          <span>© {year} NOCODEZIGGY · ALL SYSTEMS RIGHTS RESERVED</span>
          <span>RUNNING ON COFFEE + N8N</span>
        </div>
      </div>
    </footer>
  );
}
