import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, handle, stack, message } = body ?? {};

    if (!name || typeof name !== "string" || !message || typeof message !== "string") {
      return NextResponse.json(
        { ok: false, error: "Missing required fields: name, message." },
        { status: 400 }
      );
    }

    if (message.length > 4000) {
      return NextResponse.json(
        { ok: false, error: "Message too long." },
        { status: 413 }
      );
    }

    // For now we just log. Plug an email/Slack/notion service in here.
    console.log("[NOCZ-COMMS] transmission received", {
      at: new Date().toISOString(),
      name,
      handle,
      stack,
      length: message.length,
    });

    // Simulate the bridge taking a moment to compile / dispatch.
    await new Promise((r) => setTimeout(r, 220));

    return NextResponse.json(
      {
        ok: true,
        id: `TXM-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
        receivedAt: new Date().toISOString(),
        message: "TRANSMISSION RECEIVED // RESPONDING WITHIN 24H",
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: "Bad request." },
      { status: 400 }
    );
  }
}
