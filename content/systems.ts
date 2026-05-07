export type SystemStatus = "DEPLOYED" | "EXPERIMENTAL" | "ALPHA";

export type SystemNode = {
  id: string;
  /** Position on a 0–100 grid; rendered into the mini SVG. */
  x: number;
  y: number;
  label: string;
  kind?: "trigger" | "process" | "ai" | "store" | "output";
};

export type SystemEdge = {
  from: string;
  to: string;
};

export type SystemMetric = {
  label: string;
  value: string;
};

export type System = {
  id: string;
  code: string;
  title: string;
  tagline: string;
  status: SystemStatus;
  category: string;
  stack: string[];
  metrics: SystemMetric[];
  nodes: SystemNode[];
  edges: SystemEdge[];
  buildLog: { stamp: string; entry: string }[];
  outcomes: string[];
  /** When true, the Mission Detail opens with the AgentMesh 3D R3F scene. */
  hasMesh?: boolean;
};

export const systems: System[] = [
  {
    id: "agent-mesh",
    code: "SYS-01",
    title: "AI Agent Mesh",
    tagline:
      "Multi-agent orchestration network — specialists negotiate, route, and resolve tasks autonomously.",
    status: "DEPLOYED",
    category: "AI Agents",
    stack: ["OpenAI", "n8n", "LangGraph", "Supabase", "Pinecone"],
    metrics: [
      { label: "ACTIVE AGENTS", value: "12" },
      { label: "TASKS / DAY", value: "8.4K" },
      { label: "RESOLVE RATE", value: "94.1%" },
      { label: "P50 LATENCY", value: "1.8s" },
    ],
    nodes: [
      { id: "trg", x: 8, y: 50, label: "INTAKE", kind: "trigger" },
      { id: "router", x: 30, y: 50, label: "ROUTER", kind: "process" },
      { id: "a1", x: 55, y: 22, label: "RESEARCH", kind: "ai" },
      { id: "a2", x: 55, y: 50, label: "WRITER", kind: "ai" },
      { id: "a3", x: 55, y: 78, label: "QA", kind: "ai" },
      { id: "store", x: 78, y: 50, label: "MEMORY", kind: "store" },
      { id: "out", x: 95, y: 50, label: "DISPATCH", kind: "output" },
    ],
    edges: [
      { from: "trg", to: "router" },
      { from: "router", to: "a1" },
      { from: "router", to: "a2" },
      { from: "router", to: "a3" },
      { from: "a1", to: "store" },
      { from: "a2", to: "store" },
      { from: "a3", to: "store" },
      { from: "store", to: "out" },
    ],
    buildLog: [
      { stamp: "2026.04.14", entry: "Mesh router moved to LangGraph for typed handoffs." },
      { stamp: "2026.03.02", entry: "Vector memory split into per-agent shards." },
      { stamp: "2026.02.11", entry: "QA agent added — cuts hallucinations by 38%." },
    ],
    outcomes: [
      "Reduced manual support workload by 71%",
      "End-to-end resolve time down from 14 min → 1.8 s",
      "Operator dashboard reveals every agent's reasoning trace",
    ],
    hasMesh: true,
  },
  {
    id: "lead-engine",
    code: "SYS-02",
    title: "Lead Generation Engine",
    tagline:
      "End-to-end inbound + outbound system: enrich, score, route, and book — fully autonomous.",
    status: "DEPLOYED",
    category: "Lead Gen",
    stack: ["n8n", "Apollo", "OpenAI", "HubSpot", "Slack"],
    metrics: [
      { label: "LEADS / MO", value: "12.4K" },
      { label: "MEETINGS BOOKED", value: "284" },
      { label: "ENRICH ACCURACY", value: "97%" },
      { label: "UPTIME", value: "99.9%" },
    ],
    nodes: [
      { id: "src", x: 8, y: 50, label: "SOURCES", kind: "trigger" },
      { id: "enr", x: 32, y: 30, label: "ENRICH", kind: "process" },
      { id: "score", x: 32, y: 70, label: "SCORE", kind: "ai" },
      { id: "route", x: 60, y: 50, label: "ROUTE", kind: "process" },
      { id: "crm", x: 85, y: 30, label: "CRM", kind: "store" },
      { id: "noti", x: 85, y: 70, label: "NOTIFY", kind: "output" },
    ],
    edges: [
      { from: "src", to: "enr" },
      { from: "src", to: "score" },
      { from: "enr", to: "route" },
      { from: "score", to: "route" },
      { from: "route", to: "crm" },
      { from: "route", to: "noti" },
    ],
    buildLog: [
      { stamp: "2026.04.22", entry: "Apollo + Clay merge layer cuts duplicates by 19%." },
      { stamp: "2026.03.08", entry: "Scoring model retrained on win/loss data." },
    ],
    outcomes: [
      "Cold pipeline scaled 5x without adding headcount",
      "First-response < 90 seconds on every qualified lead",
    ],
  },
  {
    id: "content-os",
    code: "SYS-03",
    title: "Content OS",
    tagline:
      "Idea ingest → research → script → render → publish, looped continuously across channels.",
    status: "DEPLOYED",
    category: "Content Automation",
    stack: ["Make", "OpenAI", "ElevenLabs", "Notion", "YouTube API"],
    metrics: [
      { label: "POSTS / WEEK", value: "42" },
      { label: "FORMATS", value: "5" },
      { label: "REACH / MO", value: "1.2M" },
      { label: "REWRITES SAVED", value: "73%" },
    ],
    nodes: [
      { id: "ide", x: 8, y: 50, label: "IDEAS", kind: "trigger" },
      { id: "res", x: 28, y: 50, label: "RESEARCH", kind: "ai" },
      { id: "scr", x: 48, y: 30, label: "SCRIPT", kind: "ai" },
      { id: "voi", x: 48, y: 70, label: "VOICE", kind: "ai" },
      { id: "rend", x: 70, y: 50, label: "RENDER", kind: "process" },
      { id: "pub", x: 92, y: 50, label: "PUBLISH", kind: "output" },
    ],
    edges: [
      { from: "ide", to: "res" },
      { from: "res", to: "scr" },
      { from: "res", to: "voi" },
      { from: "scr", to: "rend" },
      { from: "voi", to: "rend" },
      { from: "rend", to: "pub" },
    ],
    buildLog: [
      { stamp: "2026.04.30", entry: "Voice cloning latency cut 40% via batched ElevenLabs calls." },
    ],
    outcomes: [
      "Content velocity 8x without sacrificing editorial voice",
      "Channel-aware rewrites tuned to each platform's hook style",
    ],
  },
  {
    id: "voice-recept",
    code: "SYS-04",
    title: "AI Voice Receptionist",
    tagline:
      "24/7 inbound voice agent: qualifies, books, routes, and logs — sounds like a human.",
    status: "ALPHA",
    category: "AI Voice",
    stack: ["Vapi", "OpenAI", "Cal.com", "n8n", "Twilio"],
    metrics: [
      { label: "CALLS / DAY", value: "180" },
      { label: "BOOKING RATE", value: "61%" },
      { label: "AVG HANDLE", value: "94s" },
      { label: "ESCALATIONS", value: "4%" },
    ],
    nodes: [
      { id: "call", x: 8, y: 50, label: "RING", kind: "trigger" },
      { id: "vad", x: 26, y: 50, label: "LISTEN", kind: "process" },
      { id: "intent", x: 46, y: 30, label: "INTENT", kind: "ai" },
      { id: "kb", x: 46, y: 70, label: "KB", kind: "store" },
      { id: "act", x: 68, y: 50, label: "ACT", kind: "process" },
      { id: "log", x: 92, y: 50, label: "LOG", kind: "output" },
    ],
    edges: [
      { from: "call", to: "vad" },
      { from: "vad", to: "intent" },
      { from: "vad", to: "kb" },
      { from: "intent", to: "act" },
      { from: "kb", to: "act" },
      { from: "act", to: "log" },
    ],
    buildLog: [
      { stamp: "2026.04.18", entry: "Barge-in detection added — agent stops talking when caller speaks." },
    ],
    outcomes: [
      "Captures the 64% of calls that came in after hours",
      "Owners get a clean transcript + outcome in Slack within 30s",
    ],
  },
  {
    id: "saas-bubble",
    code: "SYS-05",
    title: "Bubble SaaS Engine",
    tagline:
      "Production-grade Bubble.io applications wired into AI back-ends — full-stack, fast.",
    status: "DEPLOYED",
    category: "SaaS Build",
    stack: ["Bubble", "Supabase", "OpenAI", "Stripe", "Postmark"],
    metrics: [
      { label: "APPS SHIPPED", value: "11" },
      { label: "AVG MRR", value: "$8.4K" },
      { label: "TIME TO BETA", value: "21d" },
      { label: "CHURN", value: "3.1%" },
    ],
    nodes: [
      { id: "ui", x: 8, y: 30, label: "UI", kind: "trigger" },
      { id: "auth", x: 8, y: 70, label: "AUTH", kind: "process" },
      { id: "api", x: 36, y: 50, label: "API", kind: "process" },
      { id: "ai", x: 60, y: 30, label: "AI", kind: "ai" },
      { id: "db", x: 60, y: 70, label: "DB", kind: "store" },
      { id: "bill", x: 88, y: 50, label: "BILL", kind: "output" },
    ],
    edges: [
      { from: "ui", to: "api" },
      { from: "auth", to: "api" },
      { from: "api", to: "ai" },
      { from: "api", to: "db" },
      { from: "ai", to: "bill" },
      { from: "db", to: "bill" },
    ],
    buildLog: [
      { stamp: "2026.05.01", entry: "Stripe metering bridge → reduced billing edge cases by 90%." },
    ],
    outcomes: [
      "Founders shipping live SaaS in under a month",
      "Bubble + AI = real product, not a prototype",
    ],
  },
  {
    id: "crm-orch",
    code: "SYS-06",
    title: "CRM Orchestrator",
    tagline:
      "Synchronizes every tool around the customer record — single source of truth, automatic.",
    status: "DEPLOYED",
    category: "Internal Ops",
    stack: ["n8n", "HubSpot", "Stripe", "Slack", "Notion"],
    metrics: [
      { label: "RECORDS SYNCED", value: "2.1M" },
      { label: "DRIFT INCIDENTS", value: "0" },
      { label: "EVENTS / DAY", value: "62K" },
      { label: "API USAGE", value: "Optimal" },
    ],
    nodes: [
      { id: "ev", x: 8, y: 50, label: "EVENTS", kind: "trigger" },
      { id: "norm", x: 30, y: 50, label: "NORMALIZE", kind: "process" },
      { id: "rules", x: 52, y: 50, label: "RULES", kind: "ai" },
      { id: "fan1", x: 76, y: 25, label: "CRM", kind: "store" },
      { id: "fan2", x: 76, y: 50, label: "BILL", kind: "store" },
      { id: "fan3", x: 76, y: 75, label: "OPS", kind: "store" },
      { id: "rep", x: 95, y: 50, label: "REPORT", kind: "output" },
    ],
    edges: [
      { from: "ev", to: "norm" },
      { from: "norm", to: "rules" },
      { from: "rules", to: "fan1" },
      { from: "rules", to: "fan2" },
      { from: "rules", to: "fan3" },
      { from: "fan1", to: "rep" },
      { from: "fan2", to: "rep" },
      { from: "fan3", to: "rep" },
    ],
    buildLog: [
      { stamp: "2026.04.10", entry: "Idempotency keys eliminated duplicate webhook fires." },
    ],
    outcomes: [
      "Every team sees the same customer record, always",
      "Eliminated $14K/yr of duplicate-data engineering",
    ],
  },
  {
    id: "meal-plan",
    code: "SYS-07",
    title: "AI Meal Planner",
    tagline:
      "Personal nutrition co-pilot: plans, shops, prepares, and adapts to feedback weekly.",
    status: "DEPLOYED",
    category: "Consumer AI",
    stack: ["Bubble", "OpenAI", "Instacart", "Stripe"],
    metrics: [
      { label: "WEEKLY ACTIVE", value: "3.2K" },
      { label: "RETENTION 30D", value: "62%" },
      { label: "PLANS / WK", value: "11.8K" },
      { label: "SUB MRR", value: "$24K" },
    ],
    nodes: [
      { id: "prof", x: 8, y: 50, label: "PROFILE", kind: "trigger" },
      { id: "diet", x: 28, y: 50, label: "DIET AI", kind: "ai" },
      { id: "rec", x: 50, y: 30, label: "RECIPES", kind: "store" },
      { id: "shop", x: 50, y: 70, label: "SHOP", kind: "process" },
      { id: "feed", x: 76, y: 50, label: "FEEDBACK", kind: "ai" },
      { id: "iter", x: 95, y: 50, label: "ITERATE", kind: "output" },
    ],
    edges: [
      { from: "prof", to: "diet" },
      { from: "diet", to: "rec" },
      { from: "diet", to: "shop" },
      { from: "rec", to: "feed" },
      { from: "shop", to: "feed" },
      { from: "feed", to: "iter" },
      { from: "iter", to: "diet" },
    ],
    buildLog: [
      { stamp: "2026.04.27", entry: "Per-user memory drives 23% retention lift in week 4." },
    ],
    outcomes: [
      "Real subscriber growth, not vanity sign-ups",
      "Plans adapt to allergies, taste, budget, schedule",
    ],
  },
  {
    id: "ai-market",
    code: "SYS-08",
    title: "AI Marketplace",
    tagline:
      "Listings, matching, payouts, fraud — running on AI rails. A two-sided product as a service.",
    status: "EXPERIMENTAL",
    category: "Marketplace",
    stack: ["Bubble", "Supabase", "OpenAI", "Stripe Connect", "Algolia"],
    metrics: [
      { label: "LISTINGS", value: "1.4K" },
      { label: "MATCH PRECISION", value: "88%" },
      { label: "FRAUD CAUGHT", value: "100%" },
      { label: "GMV / MO", value: "$310K" },
    ],
    nodes: [
      { id: "list", x: 8, y: 30, label: "LIST", kind: "trigger" },
      { id: "buy", x: 8, y: 70, label: "BUY", kind: "trigger" },
      { id: "match", x: 36, y: 50, label: "MATCH", kind: "ai" },
      { id: "fraud", x: 60, y: 25, label: "FRAUD", kind: "ai" },
      { id: "pay", x: 60, y: 75, label: "PAY", kind: "process" },
      { id: "ship", x: 88, y: 50, label: "SHIP", kind: "output" },
    ],
    edges: [
      { from: "list", to: "match" },
      { from: "buy", to: "match" },
      { from: "match", to: "fraud" },
      { from: "match", to: "pay" },
      { from: "fraud", to: "ship" },
      { from: "pay", to: "ship" },
    ],
    buildLog: [
      { stamp: "2026.04.05", entry: "Embedding-based listing match outperforms keyword search by 42%." },
    ],
    outcomes: [
      "Fraud caught before payout in under a second",
      "Search feels like 'it gets me' — embeddings, not strings",
    ],
  },
];
