import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { isAiEnabled } from "@/lib/ai/config";
import { runAssistant, type ChatMessage } from "@/lib/ai/agent";
import { site } from "@/data/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_MESSAGES = 20;
const MAX_LEN = 4000;
const STREAM_HEADERS = {
  "Content-Type": "text/plain; charset=utf-8",
  "Cache-Control": "no-store",
} as const;

/** Flux d'un message statique (repli sans clé API, ou en cas d'erreur). */
function textStream(text: string): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  return new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(text));
      controller.close();
    },
  });
}

/**
 * POST /api/assistant — assistant conversationnel « Bella » (streaming).
 * Corps : { messages: [{ role: "user" | "assistant", content: string }] }.
 */
export async function POST(request: NextRequest) {
  const limit = rateLimit(`assistant:${clientIp(request)}`, 15, 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Trop de messages. Patientez un instant." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  const body = await request.json().catch(() => null);
  const raw = Array.isArray((body as { messages?: unknown })?.messages)
    ? (body as { messages: unknown[] }).messages
    : null;
  if (!raw || raw.length === 0) {
    return NextResponse.json({ error: "Champ « messages » requis." }, { status: 400 });
  }

  // Validation + nettoyage des messages.
  const messages: ChatMessage[] = [];
  for (const m of raw.slice(-MAX_MESSAGES)) {
    const entry = m as { role?: unknown; content?: unknown };
    const role = entry?.role === "assistant" ? "assistant" : "user";
    const content =
      typeof entry?.content === "string" ? entry.content.slice(0, MAX_LEN).trim() : "";
    if (content) messages.push({ role, content });
  }
  // La conversation doit commencer et finir par un message « user ».
  while (messages.length && messages[0].role !== "user") messages.shift();
  if (messages.length === 0 || messages[messages.length - 1].role !== "user") {
    return NextResponse.json({ error: "Le dernier message doit être « user »." }, { status: 400 });
  }

  // Dégradation gracieuse : sans clé API, on guide le client de façon statique.
  if (!isAiEnabled()) {
    const fallback =
      `Bonjour ! L'assistant en ligne est momentanément indisponible. ` +
      `Vous pouvez consulter notre carte (/notre-carte), commander en ligne (/commander), ` +
      `ou nous appeler au ${site.phone}. À très vite chez ${site.fullName} !`;
    return new Response(textStream(fallback), { headers: STREAM_HEADERS });
  }

  return new Response(runAssistant(messages), { headers: STREAM_HEADERS });
}
