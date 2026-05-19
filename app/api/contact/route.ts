import { NextResponse } from "next/server";
import { notifyContactLead } from "@/lib/loops";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, handle, stack, budget, message } = body ?? {};

    if (!name || typeof name !== "string" || !message || typeof message !== "string") {
      return NextResponse.json(
        { ok: false, error: "Missing required fields: name, message." },
        { status: 400 }
      );
    }

    if (!handle || typeof handle !== "string" || !EMAIL_RE.test(handle.trim())) {
      return NextResponse.json(
        { ok: false, error: "Valid email required." },
        { status: 400 }
      );
    }

    if (message.length > 4000) {
      return NextResponse.json(
        { ok: false, error: "Message too long." },
        { status: 413 }
      );
    }

    const payload = {
      name: name.trim(),
      email: handle.trim(),
      interest: typeof stack === "string" ? stack : null,
      budget: typeof budget === "string" ? budget : null,
      message: message.trim(),
    };

    console.log("[contact] message received", {
      at: new Date().toISOString(),
      ...payload,
      length: message.length,
    });

    await notifyContactLead(payload);

    await new Promise((r) => setTimeout(r, 220));

    return NextResponse.json(
      {
        ok: true,
        receivedAt: new Date().toISOString(),
        message: "Message received — responding within 24h.",
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { ok: false, error: "Bad request." },
      { status: 400 }
    );
  }
}
