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

    // For now we just log. Plug an email/Slack service in here.
    console.log("[contact] message received", {
      at: new Date().toISOString(),
      name,
      handle,
      stack,
      length: message.length,
    });

    await new Promise((r) => setTimeout(r, 220));

    return NextResponse.json(
      {
        ok: true,
        receivedAt: new Date().toISOString(),
        message: "Message received — responding within 24h.",
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
