import { CalendarPlus, Users } from "lucide-react";
import { PageHeader, AdminButton, Card, StatusPill, Table, Th, Td, EmptyState } from "@/components/admin/ui/kit";
import { getAdminReservations } from "@/data/admin/reservations-source";
import { DataSourceBadge } from "@/components/admin/ui/DataSourceBadge";
import { NOW } from "@/data/admin/mock";
import { formatDateTime } from "@/lib/admin/format";
import { reservationStatusStyles } from "@/lib/admin/status";
import type { Reservation } from "@/lib/admin/types";

export default async function ReservationsPage() {
  const { reservations, live } = await getAdminReservations();
  // Référence temporelle : maintenant réel en données live, date figée en démo.
  const ref = live ? new Date() : NOW;

  const sorted = [...reservations].sort((a, b) => +new Date(a.date) - +new Date(b.date));
  const upcoming = sorted.filter((r) => new Date(r.date) >= ref);
  const past = sorted.filter((r) => new Date(r.date) < ref).reverse();

  return (
    <>
      <PageHeader
        title="Réservations"
        description="Gérez les réservations de table : confirmations, couverts et statuts."
        actions={
          <>
            <DataSourceBadge live={live} />
            <AdminButton><CalendarPlus className="h-4 w-4" /> Nouvelle réservation</AdminButton>
          </>
        }
      />

      <ReservationTable title={`À venir (${upcoming.length})`} rows={upcoming} />
      <div className="mt-4">
        <ReservationTable title="Historique" rows={past} />
      </div>
    </>
  );
}

function ReservationTable({ title, rows }: { title: string; rows: Reservation[] }) {
  return (
    <Card padded={false}>
      <div className="p-5"><h2 className="text-sm font-semibold text-slate-900">{title}</h2></div>
      <Table>
        <thead>
          <tr>
            <Th>Client</Th><Th>Date & heure</Th><Th>Couverts</Th><Th>Note</Th><Th>Statut</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="hover:bg-slate-50/60">
              <Td>
                <span className="block font-medium text-slate-900">{r.name}</span>
                <span className="block text-xs text-slate-400">{r.phone}</span>
              </Td>
              <Td>{formatDateTime(r.date)}</Td>
              <Td>
                <span className="inline-flex items-center gap-1 text-slate-600">
                  <Users className="h-4 w-4 text-slate-400" /> {r.partySize}
                </span>
              </Td>
              <Td className="max-w-xs text-xs text-slate-400">{r.note ?? "—"}</Td>
              <Td><StatusPill {...reservationStatusStyles[r.status]} /></Td>
            </tr>
          ))}
        </tbody>
      </Table>
      {rows.length === 0 && <EmptyState message="Aucune réservation." />}
    </Card>
  );
}
