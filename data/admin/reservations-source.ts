import { getPrisma, isPersistenceEnabled } from "@/lib/db";
import { reservations as mockReservations } from "@/data/admin/mock";
import type { Reservation, ReservationStatus } from "@/lib/admin/types";

/**
 * Source des réservations du back-office (même patron que orders-source).
 */
type PrismaReservationRow = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  date: Date;
  partySize: number;
  status: string;
  note: string | null;
};

function mapReservation(r: PrismaReservationRow): Reservation {
  return {
    id: r.id,
    name: r.name,
    phone: r.phone,
    email: r.email ?? undefined,
    date: r.date.toISOString(),
    partySize: r.partySize,
    status: r.status as ReservationStatus,
    note: r.note ?? undefined,
  };
}

/** Liste des réservations (réelles si persistance active, sinon mock). */
export async function getAdminReservations(): Promise<{
  reservations: Reservation[];
  live: boolean;
}> {
  if (!isPersistenceEnabled()) return { reservations: mockReservations, live: false };
  try {
    const rows = await getPrisma().reservation.findMany({
      orderBy: { date: "asc" },
      take: 300,
    });
    return {
      reservations: rows.map((r) => mapReservation(r as unknown as PrismaReservationRow)),
      live: true,
    };
  } catch (error) {
    console.error("Lecture des réservations en base échouée — repli sur les mocks", error);
    return { reservations: mockReservations, live: false };
  }
}
