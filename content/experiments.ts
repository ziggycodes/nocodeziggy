export type ExperimentStatus = "PROTOTYPING" | "ALPHA" | "TESTING";

export type Experiment = {
  id: string;
  code: string;
  title: string;
  blurb: string;
  progress: number; // 0 – 100
  status: ExperimentStatus;
  lastUpdate: string;
  tags: string[];
};

export const experiments: Experiment[] = [
  {
    id: "exp-01",
    code: "LAB-01",
    title: "Self-healing workflows",
    blurb:
      "Workflows that detect their own failure modes, ask an LLM to diagnose, and patch themselves before paging me.",
    progress: 62,
    status: "ALPHA",
    lastUpdate: "2026.05.04",
    tags: ["n8n", "Observability", "LLM"],
  },
  {
    id: "exp-02",
    code: "LAB-02",
    title: "Agent simulator",
    blurb:
      "A sandbox that replays real user traces against new agent prompts before deploy. Treats prompts like code.",
    progress: 38,
    status: "PROTOTYPING",
    lastUpdate: "2026.05.01",
    tags: ["Eval", "Sim", "CI"],
  },
  {
    id: "exp-03",
    code: "LAB-03",
    title: "Voice → workflow",
    blurb:
      "Speak the workflow you want. The system drafts a runnable n8n graph and asks for confirmation.",
    progress: 71,
    status: "TESTING",
    lastUpdate: "2026.05.02",
    tags: ["Voice", "Codegen", "n8n"],
  },
  {
    id: "exp-04",
    code: "LAB-04",
    title: "Marketplace pricing oracle",
    blurb:
      "An always-on agent that watches my AI marketplace, simulates demand, and proposes price changes hourly.",
    progress: 24,
    status: "PROTOTYPING",
    lastUpdate: "2026.04.29",
    tags: ["Marketplace", "Pricing", "Sim"],
  },
];
