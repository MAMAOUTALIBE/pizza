import { getPrisma, isPersistenceEnabled } from "@/lib/db";

/**
 * Lecture des promotions actives (Prisma). Sans base (mode démo), renvoie une
 * liste vide — l'assistant orientera alors vers les menus.
 */

export interface PublicPromo {
  code: string;
  description: string;
  minOrder?: number;
}

const TYPE_LABEL: Record<string, (value: number) => string> = {
  PERCENTAGE: (v) => `-${v}%`,
  FIXED_AMOUNT: (v) => `-${v.toFixed(2)} €`,
  FREE_DELIVERY: () => "Livraison offerte",
  FREE_PRODUCT: () => "Produit offert",
  SPECIAL_MENU: () => "Menu spécial",
};

export async function getActivePromotions(): Promise<PublicPromo[]> {
  if (!isPersistenceEnabled()) return [];
  try {
    const now = new Date();
    const promos = await getPrisma().promoCode.findMany({
      where: {
        active: true,
        AND: [
          { OR: [{ startsAt: null }, { startsAt: { lte: now } }] },
          { OR: [{ endsAt: null }, { endsAt: { gte: now } }] },
        ],
      },
      select: { code: true, description: true, type: true, value: true, minOrder: true },
      take: 10,
    });
    return promos.map((p) => {
      const label = TYPE_LABEL[p.type]?.(Number(p.value)) ?? "";
      const min = Number(p.minOrder);
      return {
        code: p.code,
        description: p.description?.trim() || label,
        minOrder: min > 0 ? min : undefined,
      };
    });
  } catch (error) {
    console.error("Lecture des promotions échouée", error);
    return [];
  }
}
