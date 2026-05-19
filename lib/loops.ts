const LOOPS_API = "https://app.loops.so/api/v1";

export type SubscribePayload = {
  email: string;
  firstName?: string;
  source: string;
  userGroup?: string;
  mailingLists?: Record<string, boolean>;
  /** Custom contact properties (e.g. labInterest, budget). */
  properties?: Record<string, string | number | boolean>;
};

export type LoopsResult =
  | { ok: true; id?: string; duplicate?: boolean }
  | { ok: false; error: string };

function getApiKey(): string | undefined {
  return process.env.LOOPS_API_KEY;
}

/** Resolve env list id → Loops mailing list key for API body. */
export function mailingListFromEnv(
  envKey: "LOOPS_LIST_LEAD_MAGNET" | "LOOPS_LIST_NEWSLETTER" | "LOOPS_LIST_LAB"
): Record<string, boolean> | undefined {
  const id = process.env[envKey];
  if (!id) return undefined;
  return { [id]: true };
}

export async function createOrUpdateContact(
  payload: SubscribePayload
): Promise<LoopsResult> {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.warn("[loops] LOOPS_API_KEY not set — skipping sync");
    return { ok: true };
  }

  const body: Record<string, unknown> = {
    email: payload.email,
    subscribed: true,
    source: payload.source,
  };

  if (payload.firstName) body.firstName = payload.firstName;
  if (payload.userGroup) body.userGroup = payload.userGroup;
  if (payload.mailingLists) body.mailingLists = payload.mailingLists;
  if (payload.properties) {
    for (const [k, v] of Object.entries(payload.properties)) {
      body[k] = v;
    }
  }

  const res = await fetch(`${LOOPS_API}/contacts/create`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (res.ok) {
    const data = (await res.json()) as { id?: string };
    return { ok: true, id: data.id };
  }

  if (res.status === 409) {
    return updateContact(payload);
  }

  const errText = await res.text();
  console.error("[loops] create failed", res.status, errText);
  return { ok: false, error: "Could not subscribe. Try again." };
}

async function updateContact(payload: SubscribePayload): Promise<LoopsResult> {
  const apiKey = getApiKey();
  if (!apiKey) return { ok: true, duplicate: true };

  const body: Record<string, unknown> = {
    email: payload.email,
    subscribed: true,
    source: payload.source,
  };

  if (payload.firstName) body.firstName = payload.firstName;
  if (payload.userGroup) body.userGroup = payload.userGroup;
  if (payload.mailingLists) body.mailingLists = payload.mailingLists;
  if (payload.properties) {
    for (const [k, v] of Object.entries(payload.properties)) {
      body[k] = v;
    }
  }

  const res = await fetch(`${LOOPS_API}/contacts/update`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (res.ok) {
    return { ok: true, duplicate: true };
  }

  const errText = await res.text();
  console.error("[loops] update failed", res.status, errText);
  return { ok: false, error: "Could not subscribe. Try again." };
}

/** Notify on contact form via optional webhook or Loops transactional event. */
export async function notifyContactLead(data: {
  name: string;
  email: string | null;
  interest: string | null;
  budget: string | null;
  message: string;
}): Promise<void> {
  const webhook = process.env.CONTACT_WEBHOOK_URL;
  if (webhook) {
    await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "contact",
        at: new Date().toISOString(),
        ...data,
      }),
    }).catch((e) => console.error("[contact] webhook failed", e));
  }

  const apiKey = getApiKey();
  if (!apiKey || !data.email) return;

  await createOrUpdateContact({
    email: data.email,
    firstName: data.name.split(/\s+/)[0],
    source: "contact-form",
    properties: {
      contactInterest: data.interest ?? "",
      budget: data.budget ?? "",
      lastMessage: data.message.slice(0, 500),
    },
  });
}
