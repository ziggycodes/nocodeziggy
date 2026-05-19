# NoCodeZiggy

A cinematic, dark personal site for **NoCodeZiggy** — an AI automation, n8n / Make / Bubble.io creator brand.

The visual concept is intentionally restrained: a dark canvas, a single cyan accent, and animated workflow diagrams that show expertise without leaning on technical jargon. The design system is sampled directly from the lockup logo (`public/brand/logo-{dark,light}.svg`).

---

## Stack

| Layer            | Tech                                                  |
| ---------------- | ----------------------------------------------------- |
| Framework        | **Next.js 16** (App Router) + React 19 + TypeScript   |
| Styling          | **Tailwind CSS v4** with `@theme` tokens              |
| Animation        | `motion` (Framer Motion successor) + GSAP ScrollTrigger |
| 3D               | `three` + `@react-three/fiber` + `@react-three/drei`  |
| Smooth scroll    | `lenis`                                               |
| Fonts            | `Inter` + `JetBrains Mono` via `next/font`            |

---

## Run

```bash
npm install
npm run dev      # dev server on http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
npm run lint     # ESLint
npm run typecheck # tsc --noEmit
```

---

## Project Structure

```
nocodeziggy/
├─ app/
│  ├─ layout.tsx               # fonts, providers, nav, footer
│  ├─ page.tsx                 # composes the 6 sections
│  ├─ globals.css              # tokens (@theme), base, utility classes, keyframes
│  ├─ icon.tsx                 # 32×32 favicon — generated from the logo mark
│  ├─ apple-icon.tsx           # 180×180 — generated from the lockup
│  ├─ opengraph-image.tsx      # 1200×630 OG card — generated from the lockup
│  └─ api/contact/route.ts     # contact-form handler (logs; ready for email/Slack)
├─ components/
│  ├─ sections/                # Hero, SystemsLab (Work), HowIBuild (Process), Content (Watch), Experimental (In the lab), Contact
│  ├─ three/                   # HeroLabScene, AgentMeshScene (lazy + SSR off)
│  ├─ ui/                      # Reusable primitives (HudPanel, CtaButton, MetricCounter, NodeFlowSVG, SectionHeader, …)
│  ├─ chrome/                  # Logo, Nav, ScrollProgress, Footer
│  └─ providers/               # SmoothScroll (Lenis wrapper)
├─ content/                    # ⭐ Single-source-of-truth content
│  ├─ profile.ts               # bio, socials, hero copy
│  ├─ systems.ts               # placeholder work entries (with workflow diagrams)
│  ├─ media.ts                 # YouTube content cards
│  └─ experiments.ts           # In-the-lab projects
├─ lib/
│  ├─ fonts.ts                 # next/font setup
│  ├─ motion.ts                # shared easings + variants
│  └─ cn.ts                    # className helper (clsx)
├─ public/
│  └─ brand/                   # logo-dark.svg, logo-light.svg
└─ tsconfig.json / next.config.ts / postcss.config.mjs / tailwind via @theme in globals.css
```

---

## Sections

| Section            | Anchor          | Purpose                                                  |
| ------------------ | --------------- | -------------------------------------------------------- |
| Hero               | `#hero`         | One-glance positioning + cinematic 3D backdrop           |
| Work               | `#lab`          | Case studies with animated workflow diagrams             |
| Process            | `#build`        | Four-stage pipeline, pinned horizontal scroll            |
| Watch              | `#media`        | Featured video + filterable content grid                 |
| Currently Building | `#experimental` | Half-formed prototypes, progress bars                    |
| Contact            | `#contact`      | Clean form + direct channel links                        |

---

## Customizing Content

All copy and data lives in `content/*.ts`. Edit one file and the site updates everywhere.

| What to change                   | Where                                                    |
| -------------------------------- | -------------------------------------------------------- |
| Bio, hero copy, socials          | `content/profile.ts`                                     |
| Work / case study modules        | `content/systems.ts` (incl. `nodes` + `edges` for diagrams) |
| YouTube / content cards          | `content/media.ts`                                       |
| Lab experiments / WIP            | `content/experiments.ts`                                 |
| Logo SVGs                        | `public/brand/logo-{dark,light}.svg`                     |
| Generated favicon / OG image     | `app/{icon,apple-icon,opengraph-image}.tsx`              |

> Adding a new work entry? Just append an item to `systems.ts`. Provide `nodes` (each with `x` and `y` on a 0–100 grid) and `edges` — the `NodeFlowSVG` component will animate the diagram automatically.

> Setting `hasMesh: true` on an entry swaps the static SVG diagram for the live 3D `AgentMeshScene` in the case-study overlay.

---

## Design System

### Palette (sampled from the logo SVGs)

| Token                    | Value      | Use                                                        |
| ------------------------ | ---------- | ---------------------------------------------------------- |
| `--color-void`           | `#000000`  | Page base (matches logo dark artboard)                     |
| `--color-panel`          | `#0a0a0a`  | Module surfaces                                            |
| `--color-elev`           | `#111111`  | Elevated panels                                            |
| `--color-grid`           | `#1f1f1f`  | Hairlines, dividers                                        |
| `--color-hi`             | `#ffffff`  | Primary text (matches `Ziggy` wordmark)                    |
| `--color-mid`            | `#a3a3a3`  | Secondary text (matches `NoCode` wordmark)                 |
| `--color-dim`            | `#555555`  | Tertiary / metadata                                        |
| `--color-cyan`           | `#22d3ee`  | **The single live accent** — CTAs, live data, focused glow |
| `--color-cyan-soft`      | `#67e8f9`  | Hover / particle highlights                                |

Everything else is black, white, or grey. Cyan is rare — when you see it, something is *live, executing, or focused*.

### Typography

- **Inter** (400 / 500 / 700) — display + body. Matches the wordmark for cohesion.
- **JetBrains Mono** (400 / 500) — small data labels, metric counters.

### Motifs

- **Four corner dots** on every `HudPanel` — direct echo of the logo's corner-dot motif
- **Three motion lines** rhythm — used inside workflow node diagrams
- **Hexagon** — appears as a slowly rotating wireframe primitive in the Hero R3F scene

---

## Performance

- 3D scenes are `next/dynamic({ ssr: false })` and only rendered when their parent section is in viewport.
- `dpr` clamped at 1.5 (desktop) / 1.2 (mobile).
- Mobile detection in the Hero swaps to a low-poly profile.
- `prefers-reduced-motion` is honored across:
  - Hero R3F scene — replaced by a static dark canvas
  - Cycling headline — no auto-cycle
  - GSAP pinned scroll — falls back to vertical stack
  - Lenis smooth scroll — disabled

---

## Accessibility

- Native cursor preserved across all surfaces.
- Focus rings: cyan border + transition on every interactive element.
- ESC closes the case-study overlay.
- Section landmarks: `<section id="...">` for nav anchors and ScrollProgress markers.
- Color contrast checked against WCAG AA on text-on-background pairs.

---

## API: `POST /api/contact`

```jsonc
// Request
{
  "name": "string",          // required
  "handle": "string | null", // email
  "stack": "string | null",  // optional interest tag (e.g. "ai-agents")
  "message": "string"        // required, max 4000 chars
}

// Response (200)
{
  "ok": true,
  "receivedAt": "2026-05-07T00:00:00.000Z",
  "message": "Message received — responding within 24h."
}
```

Contact submissions sync to **Loops** (when `LOOPS_API_KEY` is set) and optionally forward via `CONTACT_WEBHOOK_URL` (Slack, etc.).

## API: `POST /api/subscribe`

```jsonc
// Request
{
  "email": "string",           // required
  "source": "string",          // required — e.g. hero-lead-magnet, footer-newsletter
  "mailingList": "lead-magnet" | "newsletter" | "lab",
  "labInterest": "string",     // optional — for lab waitlist
  "website": ""                // honeypot — must be empty
}
```

Requires `LOOPS_API_KEY` and list IDs in `.env.local`.

---

## Notes for Future You

- Adding a new section: drop it in `components/sections/`, give the root element an `id`, and register the id in `components/chrome/Nav.tsx` and `components/chrome/ScrollProgress.tsx`.
- The cycling Hero headline reads from `profile.hero.headlines` — add or remove lines freely.

---

## Credits

Design + build by NoCodeZiggy.

Running on coffee + n8n.
