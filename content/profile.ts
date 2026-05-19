export const profile = {
  handle: "NoCodeZiggy",
  role: "Automation Architect / No-Code Builder / AI Operator",
  location: "REMOTE / EU",
  utc: "UTC+1",
  email: "isaac@nocodeziggy.com",
  socials: {
    x: "https://x.com/nocodeziggy",
    github: "https://github.com/nocodeziggy",
    linkedin: "https://www.linkedin.com/in/isaac-ayodele-1a0208168/",
  },
  booking: {
    provider: "calendly" as const,
    url: "https://calendly.com/sirisaac25/meeting-with-isaac-ayodele",
    label: "Book a 20-min discovery call",
    shortLabel: "Book a free 20-min call",
  },
  audience:
    "I work with founders, operators, and growth teams who are past the idea stage and ready to ship.",
  leadMagnet: {
    title: "n8n Lead Gen Engine — workflow template",
    description:
      "My exact inbound + outbound pipeline (JSON). Import into n8n and adapt.",
    filePath: "/downloads/n8n-lead-gen-template.json",
    cta: "Get the exact n8n workflow that books 284 meetings/month",
  },
  hero: {
    headlines: [
      "I build AI systems that work while you sleep.",
      "AI Systems Builder. Automation Operator.",
      "Workflows that run on autopilot.",
    ],
    secondaryCta: "See how it works",
    secondaryHref: "/#build",
  },
  bio: {
    short:
      "Operator-grade automations and AI systems. I build the kind of leverage your team didn't know it was missing.",
    long: [
      "I design, build, and ship AI-driven workflow systems for founders and operators.",
      "Stacks I live in: n8n, Make.com, Bubble.io, OpenAI, Supabase, Airtable, plus a custom toolkit I've sharpened over years of shipping.",
      "Every system is a working machine — observable, debuggable, and tuned for outcomes.",
    ],
  },
} as const;

export type Profile = typeof profile;
