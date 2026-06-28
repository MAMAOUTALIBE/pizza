import { Bike, MapPin, Phone, Plus } from "lucide-react";
import { PageHeader, AdminButton, Card, CardHeader, StatusPill, Table, Th, Td } from "@/components/admin/ui/kit";
import { drivers, deliveryZones } from "@/data/admin/mock";
import { getAdminOrders } from "@/data/admin/orders-source";
import { DataSourceBadge } from "@/components/admin/ui/DataSourceBadge";
import { formatMoney, formatRelative } from "@/lib/admin/format";
import { cn } from "@/lib/utils";

export default async function LivraisonsPage() {
  const { orders, live } = await getAdminOrders();
  // Commandes de type livraison en cours (réelles ou mock selon la source).
  const activeDeliveries = orders.filter(
    (o) => o.channel === "DELIVERY" && (o.status === "OUT_FOR_DELIVERY" || o.status === "READY" || o.status === "PREPARING"),
  );

  return (
    <>
      <PageHeader
        title="Livraisons"
        description="Suivez les livraisons en cours, les livreurs et les zones desservies."
        actions={
          <>
            <DataSourceBadge live={live} />
            <AdminButton variant="secondary"><Plus className="h-4 w-4" /> Zone de livraison</AdminButton>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Livraisons en cours */}
        <Card className="lg:col-span-2" padded={false}>
          <div className="p-5"><h2 className="text-sm font-semibold text-slate-900">Livraisons en cours</h2></div>
          <Table>
            <thead>
              <tr><Th>Commande</Th><Th>Adresse</Th><Th>Livreur</Th><Th className="text-right">Total</Th><Th>Quand</Th></tr>
            </thead>
            <tbody>
              {activeDeliveries.map((o, i) => (
                <tr key={o.id} className="hover:bg-slate-50/60">
                  <Td className="font-medium text-slate-900">{o.number}</Td>
                  <Td className="max-w-[14rem] text-xs text-slate-500">
                    <span className="flex items-start gap-1"><MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />{o.address}</span>
                  </Td>
                  <Td>
                    {o.status === "OUT_FOR_DELIVERY"
                      ? <span className="text-slate-700">{drivers[i % drivers.length].name}</span>
                      : <StatusPill label="À assigner" className="bg-slate-200 text-slate-600" />}
                  </Td>
                  <Td className="text-right font-semibold text-slate-900">{formatMoney(o.total)}</Td>
                  <Td className="text-xs text-slate-400">{formatRelative(o.createdAt)}</Td>
                </tr>
              ))}
              {activeDeliveries.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-400">Aucune livraison en cours.</td></tr>
              )}
            </tbody>
          </Table>
        </Card>

        {/* Livreurs */}
        <Card>
          <CardHeader title="Livreurs" />
          <ul className="space-y-3">
            {drivers.map((d) => (
              <li key={d.id} className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                  <Bike className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-slate-900">{d.name}</p>
                  <p className="flex items-center gap-1 text-xs text-slate-400"><Phone className="h-3 w-3" />{d.phone}</p>
                </div>
                <div className="text-right">
                  <span className={cn("inline-block rounded-full px-2 py-0.5 text-[0.65rem] font-medium", d.available ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-500")}>
                    {d.available ? "Disponible" : "Indisponible"}
                  </span>
                  <p className="mt-1 text-xs text-slate-400">{d.activeDeliveries} en cours</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Zones de livraison */}
      <Card className="mt-4" padded={false}>
        <div className="p-5"><h2 className="text-sm font-semibold text-slate-900">Zones de livraison</h2></div>
        <Table>
          <thead>
            <tr><Th>Zone</Th><Th>Codes postaux</Th><Th className="text-right">Frais</Th><Th className="text-right">Min. commande</Th><Th className="text-right">ETA</Th><Th>Statut</Th></tr>
          </thead>
          <tbody>
            {deliveryZones.map((z) => (
              <tr key={z.id} className="hover:bg-slate-50/60">
                <Td className="font-medium text-slate-900">{z.name}</Td>
                <Td className="text-slate-500">{z.postalCodes.join(", ")}</Td>
                <Td className="text-right">{formatMoney(z.fee)}</Td>
                <Td className="text-right">{formatMoney(z.minOrder)}</Td>
                <Td className="text-right">{z.etaMinutes} min</Td>
                <Td><StatusPill label={z.active ? "Active" : "Inactive"} className={z.active ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-500"} /></Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </>
  );
}
