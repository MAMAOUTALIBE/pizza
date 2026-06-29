import { getPrisma, isPersistenceEnabled } from "@/lib/db";

/**
 * Persistance des réservations (Prisma). Sans base (mode démo), aucune écriture
 * n'est possible : on renvoie { persisted: false } pour que l'appelant invite
 * le client à réserver par téléphone — honnêtement, sans prétendre avoir réservé.
 */

export interface NewReservation {
  name: string;
  phone: string;
  email?: string;
  date: Date;
  partySize: number;
  note?: string;
}

export interface ReservationResult {
  ok: boolean;
  persisted: boolean;
  status?: string;
  error?: string;
}

export async function createReservation(r: NewReservation): Promise<ReservationResult> {
  if (!isPersistenceEnabled()) return { ok: true, persisted: false };
  try {
    await getPrisma().reservation.create({
      data: {
        name: r.name,
        phone: r.phone,
        email: r.email || null,
        date: r.date,
        partySize: r.partySize,
        note: r.note || null,
        status: "PENDING",
      },
    });
    return { ok: true, persisted: true, status: "PENDING" };
  } catch (error) {
    console.error("Création de réservation échouée", error);
    return { ok: false, persisted: false, error: "Échec de l'enregistrement." };
  }
}
