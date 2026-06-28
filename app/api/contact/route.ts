import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const MAX_FIELD_LENGTH = 200;
const MAX_MESSAGE_LENGTH = 3000;

/**
 * POST /api/contact — réception du formulaire de contact public.
 * Valide les champs et (en prod) envoie un email via Resend/SMTP.
 */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const name = cleanField(body?.name);
  const email = cleanField(body?.email).toLowerCase();
  const phone = cleanField(body?.phone);
  const subject = cleanField(body?.subject || "Contact site web");
  const message = cleanField(body?.message, MAX_MESSAGE_LENGTH);

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Champs obligatoires manquants." }, { status: 400 });
  }

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!emailOk) {
    return NextResponse.json({ error: "Email invalide." }, { status: 400 });
  }

  let delivered = false;
  try {
    delivered = await sendContactEmail({
      name,
      email,
      phone,
      subject,
      message,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Le service d'email est momentanement indisponible.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, delivered });
}

function cleanField(value: unknown, max = MAX_FIELD_LENGTH) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

async function sendContactEmail({
  name,
  email,
  phone,
  subject,
  message,
}: {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) {
    console.info("Contact request received without email provider configured", {
      name,
      email,
      subject,
    });
    return false;
  }

  const from = process.env.CONTACT_FROM_EMAIL || "La Bella <onboarding@resend.dev>";
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      reply_to: email,
      subject: `[La Bella] ${subject}`,
      text: [
        `Nom: ${name}`,
        `Email: ${email}`,
        phone ? `Telephone: ${phone}` : null,
        "",
        message,
      ].filter(Boolean).join("\n"),
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    console.error("Contact email delivery failed", response.status, detail);
    throw new Error("Le service d'email est momentanement indisponible.");
  }

  return true;
}
