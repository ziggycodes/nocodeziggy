import { NextResponse } from "next/server";
import {
  createOrUpdateContact,
  mailingListFromEnv,
  type SubscribePayload,
} from "@/lib/loops";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type MailingListKey = "lead-magnet" | "newsletter" | "lab";

function resolveMailingLists(
  key?: MailingListKey
): Record<string, boolean> | undefined {
  if (!key) return undefined;
  switch (key) {
    case "lead-magnet":
      return mailingListFromEnv("LOOPS_LIST_LEAD_MAGNET");
    case "newsletter":
      return mailingListFromEnv("LOOPS_LIST_NEWSLETTER");
    case "lab":
      return mailingListFromEnv("LOOPS_LIST_LAB");
    default:
      return undefined;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      email,
      firstName,
      source,
      mailingList,
      labInterest,
      website,
    } = body ?? {};

    if (website) {
      return NextResponse.json({ ok: true });
    }

    if (!email || typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
      return NextResponse.json(
        { ok: false, error: "Valid email required." },
        { status: 400 }
      );
    }

    if (!source || typeof source !== "string") {
      return NextResponse.json(
        { ok: false, error: "Missing source." },
        { status: 400 }
      );
    }

    const payload: SubscribePayload = {
      email: email.trim().toLowerCase(),
      source: source.slice(0, 120),
      mailingLists: resolveMailingLists(mailingList as MailingListKey),
    };

    if (firstName && typeof firstName === "string") {
      payload.firstName = firstName.trim().slice(0, 80);
    }

    const properties: Record<string, string> = {};
    if (labInterest && typeof labInterest === "string") {
      properties.labInterest = labInterest.slice(0, 200);
    }
    if (Object.keys(properties).length > 0) {
      payload.properties = properties;
    }

    const result = await createOrUpdateContact(payload);

    if (!result.ok) {
      return NextResponse.json(
        { ok: false, error: result.error },
        { status: 502 }
      );
    }

    return NextResponse.json({
      ok: true,
      duplicate: result.duplicate ?? false,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Bad request." },
      { status: 400 }
    );
  }
}
