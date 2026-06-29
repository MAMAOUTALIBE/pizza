import { getPrisma, isPersistenceEnabled } from "@/lib/db";

/**
 * Lecture du solde de fidélité par téléphone (Prisma). Sans base (démo),
 * renvoie { demo: true } pour que l'assistant oriente vers la boutique.
 */

export interface LoyaltyResult {
  found: boolean;
  demo?: boolean;
  name?: string;
  points?: number;
  tier?: string;
}

export async function getLoyaltyByPhone(phone: string): Promise<LoyaltyResult> {
  if (!isPersistenceEnabled()) return { found: false, demo: true };
  try {
    const customer = await getPrisma().customer.findUnique({
      where: { phone: phone.trim() },
      select: { firstName: true, loyaltyAccount: { select: { points: true, tier: true } } },
    });
    if (!customer || !customer.loyaltyAccount) return { found: false };
    return {
      found: true,
      name: customer.firstName,
      points: customer.loyaltyAccount.points,
      tier: customer.loyaltyAccount.tier,
    };
  } catch (error) {
    console.error("Lecture fidélité échouée", error);
    return { found: false };
  }
}
