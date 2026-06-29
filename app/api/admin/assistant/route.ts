import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { isAiEnabled } from "@/lib/ai/config";
import { runStaffAssistant } from "@/lib/ai/staff-agent";
import { type ChatMessage } from "@/lib/ai/agent";
import { getSession } from "@/lib/admin/auth";
import type { UserRole } from "@/lib/admin/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED: UserRole[] = ["SUPER_ADMIN", "MANAGER", "SUPPORT"];
const MAX_MESSAGES = 20;
const MAX_LEN = 4000;
const STREAM_HEADERS = {
  "Content-Type": "text/plain; charset=utf-8",
  "Cache-Control": "no-store",
} as const;

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
 * POST /api/admin/assistant — copilote staff (streaming). RBAC : réservé aux
 * rôles SUPER_ADMIN / MANAGER / SUPPORT (défense en profondeur, en plus du
 * middleware proxy.ts).
 */
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  if (!ALLOWED.includes(session.role)) {
    return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  }

  const limit = rateLimit(`staff-assistant:${session.email}`, 30, 60_000);
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

  const messages: ChatMessage[] = [];
  for (const m of raw.slice(-MAX_MESSAGES)) {
    const entry = m as { role?: unknown; content?: unknown };
    const role = entry?.role === "assistant" ? "assistant" : "user";
    const content =
      typeof entry?.content === "string" ? entry.content.slice(0, MAX_LEN).trim() : "";
    if (content) messages.push({ role, content });
  }
  while (messages.length && messages[0].role !== "user") messages.shift();
  if (messages.length === 0 || messages[messages.length - 1].role !== "user") {
    return NextResponse.json({ error: "Le dernier message doit être « user »." }, { status: 400 });
  }

  if (!isAiEnabled()) {
    return new Response(
      textStream(
        "Le copilote IA n'est pas activé (clé ANTHROPIC_API_KEY manquante). Les données restent disponibles dans le tableau de bord.",
      ),
      { headers: STREAM_HEADERS },
    );
  }

  return new Response(runStaffAssistant(messages), { headers: STREAM_HEADERS });
}
