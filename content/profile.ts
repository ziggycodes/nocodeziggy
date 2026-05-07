export const profile = {
  handle: "NoCodeZiggy",
  role: "Automation Architect / No-Code Builder / AI Operator",
  location: "REMOTE / EU",
  utc: "UTC+1",
  email: "ziggy@nocodeziggy.com",
  socials: {
    youtube: "https://youtube.com/@nocodeziggy",
    x: "https://x.com/nocodeziggy",
    github: "https://github.com/nocodeziggy",
    linkedin: "https://linkedin.com/in/nocodeziggy",
  },
  hero: {
    headlines: [
      "I build AI systems that work while you sleep.",
      "Automation Architect. No-Code Builder. AI Operator.",
      "Workflows that run on autopilot.",
    ],
    sub: "I design and deploy AI agents, n8n + Make automations, and Bubble SaaS systems for operators who want leverage.",
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
