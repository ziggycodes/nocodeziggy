export type Stack = {
  id: string;
  code: string;
  title: string;
  summary: string;
  components: string[];
  bestFor: string;
  deploymentTime: string;
};

export const stacks: Stack[] = [
  {
    id: "stk-01",
    code: "STK-01",
    title: "AI Agent Systems",
    summary: "Multi-agent meshes that operate independently — research, write, decide, execute.",
    components: [
      "LLM router + specialist agents",
      "Vector memory (Pinecone / pgvector)",
      "Function-calling tool layer",
      "Observability + reasoning trace UI",
    ],
    bestFor: "Founders replacing repeatable knowledge work with autonomous workers",
    deploymentTime: "3 – 6 weeks",
  },
  {
    id: "stk-02",
    code: "STK-02",
    title: "Business Workflow Automation",
    summary: "n8n + Make systems that connect everything you use into one durable, observable engine.",
    components: [
      "n8n / Make.com orchestration",
      "Bi-directional CRM sync",
      "Slack / email surfaces",
      "Error budgets + retry pipelines",
    ],
    bestFor: "Teams whose ops are held together by spreadsheets and Zaps",
    deploymentTime: "2 – 4 weeks",
  },
  {
    id: "stk-03",
    code: "STK-03",
    title: "Bubble SaaS Development",
    summary: "Production-grade Bubble.io applications wired into AI back-ends and Stripe billing.",
    components: [
      "Bubble app (responsive)",
      "Supabase / Postgres backend",
      "AI features baked in",
      "Stripe metered billing",
    ],
    bestFor: "Founders who want a real product live in 4 weeks, not 6 months",
    deploymentTime: "4 – 8 weeks",
  },
  {
    id: "stk-04",
    code: "STK-04",
    title: "AI Lead Generation",
    summary: "End-to-end inbound + outbound pipelines that enrich, score, and book — autonomous.",
    components: [
      "Multi-source lead intake",
      "Enrichment + scoring agents",
      "Cold-outbound sequencer",
      "Calendar + handoff routing",
    ],
    bestFor: "Sales teams that need pipeline at scale without growing headcount",
    deploymentTime: "2 – 5 weeks",
  },
  {
    id: "stk-05",
    code: "STK-05",
    title: "AI Receptionists",
    summary: "Voice agents that take calls, qualify, book, and log — sound like a human, never sleep.",
    components: [
      "Vapi / Retell voice runtime",
      "Custom intent + tool routing",
      "Calendar + CRM hooks",
      "Transcripts in your inbox",
    ],
    bestFor: "Service businesses leaking calls after hours",
    deploymentTime: "1 – 3 weeks",
  },
  {
    id: "stk-06",
    code: "STK-06",
    title: "Internal Operations Automation",
    summary: "Custom internal systems and dashboards that turn ops chaos into an instrumented machine.",
    components: [
      "Internal-tool front-end",
      "Workflow orchestration",
      "Live KPIs + drift alerts",
      "Audit trail + access controls",
    ],
    bestFor: "Operators who want to see the entire business in one screen",
    deploymentTime: "3 – 6 weeks",
  },
];
