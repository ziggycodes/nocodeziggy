"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatusPill } from "@/components/ui/StatusPill";
import { HudPanel } from "@/components/ui/HudPanel";
import { media, mediaCategories, type MediaCategory } from "@/content/media";
import { cn } from "@/lib/cn";

type FilterKey = "ALL" | MediaCategory;

export function Content() {
  const [filter, setFilter] = useState<FilterKey>("ALL");
  const featured = media.find((m) => m.featured) ?? media[0];

  const grid = useMemo(
    () => media.filter((m) => filter === "ALL" || m.category === filter),
    [filter]
  );

  return (
    <section
      id="media"
      className="relative bg-[var(--color-void)] py-24 md:py-32"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 grid-floor opacity-[0.5]" />

      <div className="relative mx-auto w-full max-w-[1400px] px-6 md:px-10">
        <SectionHeader
          code="SEC-03"
          eyebrow="MEDIA COMMAND"
          title={
            <>
              Build logs, teardowns,{" "}
              <span className="text-[var(--color-mid)]">and unedited live builds.</span>
            </>
          }
          description="The same lab, on tape. New drops weekly. Workflows in the description."
          meta={<StatusPill tone="cyan">LIVE FEED</StatusPill>}
        />

        {/* Featured */}
        <FeaturedDeck item={featured} />

        {/* Filters */}
        <div className="mt-10 flex flex-wrap items-center gap-2">
          <FilterPill value="ALL" current={filter} onClick={setFilter}>
            ALL
          </FilterPill>
          {mediaCategories.map((c) => (
            <FilterPill key={c} value={c} current={filter} onClick={setFilter}>
              {c}
            </FilterPill>
          ))}
          <span className="ml-auto text-hud-label">
            {grid.length} / {media.length} ITEMS
          </span>
        </div>

        {/* Grid */}
        <motion.div
          layout
          className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          <AnimatePresence mode="popLayout">
            {grid.map((m, i) => (
              <MediaCard key={m.id} item={m} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

function FilterPill({
  value,
  current,
  onClick,
  children,
}: {
  value: FilterKey;
  current: FilterKey;
  onClick: (v: FilterKey) => void;
  children: React.ReactNode;
}) {
  const active = current === value;
  return (
    <button
      onClick={() => onClick(value)}
      className={cn(
        "relative inline-flex items-center gap-2 border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors",
        active
          ? "border-[var(--color-cyan)] text-[var(--color-cyan)] bg-[color:rgb(34_211_238/0.08)]"
          : "border-[var(--color-grid)] text-[var(--color-mid)] hover:border-[var(--color-hi)] hover:text-[var(--color-hi)]"
      )}
      style={active ? { boxShadow: "0 0 14px var(--color-cyan-glow)" } : undefined}
    >
      <span
        aria-hidden
        className={cn(
          "h-1 w-1 rounded-full",
          active ? "bg-[var(--color-cyan)]" : "bg-[var(--color-dim)]"
        )}
      />
      {children}
    </button>
  );
}

function FeaturedDeck({ item }: { item: (typeof media)[number] }) {
  return (
    <motion.a
      href={item.url}
      target="_blank"
      rel="noreferrer"
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="mt-12 block group"
    >
      <HudPanel
        live
        code="FEATURED // VTR-01"
        tag={
          <div className="flex items-center gap-3">
            <StatusPill tone="cyan">NOW PLAYING</StatusPill>
            <span className="font-mono text-[10px] tracking-[0.2em] text-[var(--color-mid)]">
              {item.duration}
            </span>
          </div>
        }
        bodyClassName="p-0"
      >
        <div className="relative aspect-[21/9] w-full overflow-hidden bg-[var(--color-void)]">
          {/* Faux thumbnail: layered grids + cyan accents */}
          <div className="absolute inset-0 grid-floor opacity-[0.6]" />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(60% 60% at 50% 60%, rgba(34,211,238,0.18) 0%, transparent 70%), radial-gradient(40% 40% at 80% 20%, rgba(167,139,250,0.10) 0%, transparent 70%)",
            }}
          />

          {/* Big play target */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <span
                aria-hidden
                className="absolute -inset-6 rounded-full border border-[color:rgb(34_211_238/0.4)] animate-pulse"
              />
              <span
                aria-hidden
                className="absolute -inset-12 rounded-full border border-[color:rgb(34_211_238/0.15)]"
              />
              <div className="relative flex h-20 w-20 items-center justify-center border border-[var(--color-cyan)] bg-[color:rgb(0_0_0/0.6)] backdrop-blur-md transition-transform group-hover:scale-105">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <polygon points="6,4 18,11 6,18" fill="#22d3ee" />
                </svg>
              </div>
            </div>
          </div>

          {/* HUD overlays */}
          <div className="absolute left-4 top-4 flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-[var(--color-mid)]">
            <span className="text-[var(--color-cyan)]">REC ●</span>
            VTR // {item.date}
          </div>
          <div className="absolute right-4 top-4 font-mono text-[10px] tracking-[0.2em] text-[var(--color-mid)]">
            {item.category}
          </div>
          <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-6 bg-gradient-to-t from-[rgb(0_0_0/0.85)] to-transparent p-6">
            <div>
              <div className="text-hud-label mb-1 text-[var(--color-cyan)]">
                FEATURED BUILD
              </div>
              <h3 className="max-w-[42ch] text-[clamp(1.4rem,3vw,2.4rem)] font-bold leading-[1.05] tracking-tight">
                {item.title}
              </h3>
            </div>
            <div className="hidden text-right md:block">
              <div className="text-hud-label">DURATION</div>
              <div className="font-mono text-[18px] text-[var(--color-hi)]">{item.duration}</div>
            </div>
          </div>

          {/* Animated scanline on hover */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-24 -translate-y-full bg-gradient-to-b from-transparent via-[color:rgb(34_211_238/0.10)] to-transparent transition-transform duration-700 group-hover:translate-y-[400%]"
          />
        </div>
      </HudPanel>
    </motion.a>
  );
}

function MediaCard({ item, index }: { item: (typeof media)[number]; index: number }) {
  const cat = item.category;
  const tone =
    cat === "BUILD LOG"
      ? "cyan"
      : cat === "EXPERIMENT"
      ? "violet"
      : cat === "TEARDOWN"
      ? "amber"
      : "neutral";

  return (
    <motion.a
      layout
      href={item.url}
      target="_blank"
      rel="noreferrer"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      transition={{ duration: 0.4, delay: (index % 4) * 0.05, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -2 }}
      className="group relative block"
    >
      <HudPanel compact bodyClassName="p-0" className="hover:border-[color:rgb(34_211_238/0.4)] transition-colors">
        <div className="relative aspect-video w-full overflow-hidden bg-[var(--color-void)]">
          {/* Faux frame */}
          <div className="absolute inset-0 grid-floor opacity-[0.6]" />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(50% 60% at 60% 50%, rgba(34,211,238,0.10) 0%, transparent 70%)",
            }}
          />

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-10 w-10 items-center justify-center border border-[var(--color-grid)] bg-[color:rgb(0_0_0/0.6)] transition-colors group-hover:border-[var(--color-cyan)]">
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <polygon points="2,1 10,5.5 2,10" fill="#FFFFFF" className="group-hover:fill-[#22d3ee]" />
              </svg>
            </div>
          </div>

          <div className="absolute left-2 top-2">
            <StatusPill tone={tone as any} pulse={false}>
              {cat}
            </StatusPill>
          </div>
          <div className="absolute right-2 bottom-2 font-mono text-[10px] tracking-[0.18em] text-[var(--color-mid)] bg-[color:rgb(0_0_0/0.6)] px-1.5 py-0.5">
            {item.duration}
          </div>

          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-12 -translate-y-full bg-gradient-to-b from-transparent via-[color:rgb(34_211_238/0.10)] to-transparent transition-transform duration-500 group-hover:translate-y-[400%]"
          />
        </div>

        <div className="p-4">
          <div className="text-hud-label mb-2 text-[var(--color-mid)]">{item.date}</div>
          <h4 className="text-[14px] font-medium leading-snug text-[var(--color-hi)] group-hover:text-[var(--color-cyan)] transition-colors">
            {item.title}
          </h4>
          <p className="mt-2 line-clamp-2 text-[12.5px] leading-relaxed text-[var(--color-mid)]">
            {item.description}
          </p>
        </div>
      </HudPanel>
    </motion.a>
  );
}

void cn;
