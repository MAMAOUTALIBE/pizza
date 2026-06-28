import Stripe from "stripe";

/**
 * Client Stripe (serveur uniquement).
 * Initialisation paresseuse : si STRIPE_SECRET_KEY n'est pas défini, le tunnel
 * bascule en « mode démo » (paiement simulé) au lieu de planter — pratique en
 * local sans clés. En production, renseignez les clés dans .env.
 */
let cached: Stripe | null = null;

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY manquant : paiement Stripe non configuré.");
  }
  if (!cached) {
    // Version d'API épinglée pour éviter toute dérive de comportement.
    cached = new Stripe(key, { apiVersion: "2025-02-24.acacia", typescript: true });
  }
  return cached;
}
