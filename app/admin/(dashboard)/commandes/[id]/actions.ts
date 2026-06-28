"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/admin/auth";
import { isPersistenceEnabled } from "@/lib/db";
import { setOrderStatus } from "@/lib/orders-repo";
import type { OrderStatus } from "@/lib/admin/types";

/**
 * Met à jour le statut d'une commande depuis le détail.
 * - Authentifie l'acteur (session admin).
 * - Persiste en base + journalise quand la persistance est active.
 * - En mode démo : pas d'écriture, mais succès renvoyé (UI optimiste).
 */
export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
): Promise<{ ok: boolean; demo?: boolean; error?: string }> {
  const session = await getSession();
  if (!session) return { ok: false, error: "Non authentifié." };

  if (!isPersistenceEnabled()) {
    // Démo : on ne persiste pas et on NE revalide PAS (sinon retour au mock).
    return { ok: true, demo: true };
  }

  const success = await setOrderStatus(orderId, status, {
    email: session.email,
    name: session.name,
  });
  if (!success) return { ok: false, error: "Échec de la mise à jour en base." };

  revalidatePath(`/admin/commandes/${orderId}`);
  revalidatePath("/admin/commandes");
  return { ok: true };
}
