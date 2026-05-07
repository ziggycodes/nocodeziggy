export type MediaCategory = "BUILD LOG" | "TEARDOWN" | "TUTORIAL" | "EXPERIMENT";

export type MediaItem = {
  id: string;
  category: MediaCategory;
  title: string;
  duration: string;
  date: string;
  url: string;
  description: string;
  featured?: boolean;
};

export const media: MediaItem[] = [
  {
    id: "ai-mesh-build",
    category: "BUILD LOG",
    title: "Building a 12-agent mesh in n8n + LangGraph",
    duration: "32:14",
    date: "2026.04.28",
    url: "https://youtube.com/watch?v=placeholder1",
    description:
      "From a blank canvas to a running agent mesh that resolves real support tickets. Live, no cuts.",
    featured: true,
  },
  {
    id: "n8n-vs-make",
    category: "TEARDOWN",
    title: "n8n vs. Make: which one survives at 2M events / day?",
    duration: "18:42",
    date: "2026.04.21",
    url: "https://youtube.com/watch?v=placeholder2",
    description:
      "I ran both engines at scale for two weeks. Here's where each one breaks, and why I still use both.",
  },
  {
    id: "bubble-stripe",
    category: "TUTORIAL",
    title: "Stripe metered billing in Bubble in 14 minutes",
    duration: "14:02",
    date: "2026.04.14",
    url: "https://youtube.com/watch?v=placeholder3",
    description:
      "The pattern I use on every SaaS build. Includes the workflow JSON in the description.",
  },
  {
    id: "voice-recept",
    category: "BUILD LOG",
    title: "Shipping a voice receptionist in one weekend",
    duration: "26:55",
    date: "2026.04.06",
    url: "https://youtube.com/watch?v=placeholder4",
    description:
      "Weekend timeline of building, deploying, and calling my own receptionist agent.",
  },
  {
    id: "ai-marketplace",
    category: "EXPERIMENT",
    title: "An AI marketplace that prices itself dynamically",
    duration: "21:18",
    date: "2026.03.30",
    url: "https://youtube.com/watch?v=placeholder5",
    description:
      "Pricing as a product feature. Embeddings + simulated demand to find equilibrium.",
  },
  {
    id: "agent-memory",
    category: "TEARDOWN",
    title: "Agent memory: why your bot forgets and how to fix it",
    duration: "17:09",
    date: "2026.03.22",
    url: "https://youtube.com/watch?v=placeholder6",
    description:
      "Per-agent shards, summarization passes, and the eviction policy that finally worked.",
  },
  {
    id: "lead-engine",
    category: "BUILD LOG",
    title: "Cold pipeline 5x in 30 days — full autopilot",
    duration: "23:47",
    date: "2026.03.15",
    url: "https://youtube.com/watch?v=placeholder7",
    description:
      "The exact graph, scoring rules, and Slack handoff that drove the lift.",
  },
  {
    id: "no-code-stack",
    category: "TUTORIAL",
    title: "My 2026 no-code stack (the one I actually use)",
    duration: "12:36",
    date: "2026.03.04",
    url: "https://youtube.com/watch?v=placeholder8",
    description:
      "What stayed, what I dropped, and what I'd never use in production.",
  },
];

export const mediaCategories: MediaCategory[] = [
  "BUILD LOG",
  "TEARDOWN",
  "TUTORIAL",
  "EXPERIMENT",
];
