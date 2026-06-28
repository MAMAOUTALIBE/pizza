import { formatPrice } from "@/lib/utils";

/**
 * Emails transactionnels (confirmation de commande).
 * Utilise Resend si RESEND_API_KEY est défini ; sinon journalise (mode démo)
 * — même approche que /api/contact. Ne bloque jamais le tunnel de commande :
 * un échec d'email est loggé mais ne fait pas échouer la commande.
 */
interface OrderEmailInput {
  order: {
    orderNumber: string;
    total: number;
    etaMinutes: number;
    customer: { name: string; email: string };
    items?: Array<{ name: string; quantity: number; total: number }>;
  };
  paid: boolean;
}

export async function sendOrderConfirmation({ order, paid }: OrderEmailInput): Promise<boolean> {
  const to = order.customer.email;
  if (!to) return false; // pas d'email fourni → rien à envoyer

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL || "La Bella <onboarding@resend.dev>";

  const itemLines = (order.items ?? []).map(
    (i) => `- ${i.quantity}× ${i.name} (${formatPrice(i.total)})`,
  );
  const lines = [
    `Bonjour ${order.customer.name},`,
    "",
    `Merci pour votre commande ${order.orderNumber} !`,
    paid ? "Votre paiement a bien été reçu." : "Votre commande est enregistrée.",
    ...(itemLines.length ? ["", ...itemLines] : []),
    "",
    `Total : ${formatPrice(order.total)}`,
    `Temps estimé : ~${order.etaMinutes} min`,
    "",
    "À très vite chez La Bella !",
  ];

  if (!apiKey) {
    console.info("[email démo] Confirmation de commande (non envoyée, pas de RESEND_API_KEY)", {
      to,
      orderNumber: order.orderNumber,
    });
    return false;
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        subject: `Votre commande ${order.orderNumber} — La Bella Pizzeria`,
        text: lines.join("\n"),
      }),
    });
    if (!response.ok) {
      console.error("Échec d'envoi de l'email de confirmation", response.status);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Erreur d'envoi de l'email de confirmation", error);
    return false;
  }
}
