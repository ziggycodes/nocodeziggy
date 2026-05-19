---
title: "How to Build an AI Voice Receptionist That Books Meetings"
description: "Architecture for a 24/7 voice agent: Vapi, intent routing, Cal.com booking, and n8n logging — without sounding like a phone tree."
date: "2026-04-18"
tags: ["AI voice", "Vapi", "Cal.com", "automation"]
youtubeId: ""
---

After-hours calls are pure margin leak: prospects call, no one answers, they book with whoever picks up first. An AI voice receptionist fixes that if you design it like an operator, not a gimmick.

## Core architecture

1. **Telephony** — Twilio or carrier SIP into Vapi (or similar).
2. **Listen** — VAD + streaming STT with barge-in so callers can interrupt.
3. **Intent** — LLM classifies: book, FAQ, escalate, wrong number.
4. **Knowledge** — vector KB for pricing, hours, services.
5. **Act** — Cal.com availability check + booking, or warm transfer.
6. **Log** — n8n workflow posts transcript + outcome to Slack and CRM.

The [AI Voice Receptionist](/#lab) build on my site runs at ~61% booking rate with sub-2-minute average handle time when the KB is tight.

## What makes it sound human

- Short responses; one idea per turn.
- Confirm spelling for email and name.
- Explicit escalation path: "Let me get a human on this."
- Latency budget: target &lt; 800ms to first token after caller stops.

## Compliance and trust

- Disclose AI at the start where required.
- Record retention policy in your privacy page.
- Never invent availability — always hit the live calendar API.

## When to hire vs. build

DIY works for single-location services and founder-led sales. Multi-location, HIPAA, or complex routing needs custom evals and monitoring. [Book a call](https://calendly.com/nocodeziggy/20min) if you want this wired to your stack.
