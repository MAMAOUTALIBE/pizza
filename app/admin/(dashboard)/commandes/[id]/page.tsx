import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, Phone, User, StickyNote, AlertTriangle } from "lucide-react";
import { getAdminOrderById } from "@/data/admin/orders-source";
import { formatMoney, formatDateTime } from "@/lib/admin/format";
import { orderStatusStyles, channelStyles, paymentStatusStyles, paymentMethodLabels } from "@/lib/admin/status";
import { Card, CardHeader, StatusPill } from "@/components/admin/ui/kit";
import { OrderStatusControls } from "@/components/admin/modules/OrderStatusControls";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { order } = await getAdminOrderById(id);
  if (!order) notFound();

  return (
    <>
      <Link href="/admin/commandes" className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800">
        <ArrowLeft className="h-4 w-4" /> Retour aux commandes
      </Link>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold text-slate-900">{order.number}</h1>
        <StatusPill {...channelStyles[order.channel]} />
        <StatusPill {...orderStatusStyles[order.status]} />
        <span className="text-sm text-slate-400">{formatDateTime(order.createdAt)}</span>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Colonne principale */}
        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader title="Articles commandés" />
            <ul className="divide-y divide-slate-100">
              {order.items.map((it, i) => (
                <li key={i} className="flex items-start justify-between gap-4 py-3">
                  <div>
                    <p className="font-medium text-slate-800">
                      <span className="text-slate-400">{it.quantity}×</span> {it.name}
                    </p>
                    {it.options && it.options.length > 0 && (
                      <p className="mt-0.5 text-xs text-slate-400">{it.options.join(" · ")}</p>
                    )}
                  </div>
                  <span className="font-medium text-slate-700">{formatMoney(it.unitPrice * it.quantity)}</span>
                </li>
              ))}
            </ul>

            {/* Totaux */}
            <div className="mt-4 space-y-1.5 border-t border-slate-100 pt-4 text-sm">
              <Row label="Sous-total" value={formatMoney(order.subtotal)} />
              {order.deliveryFee > 0 && <Row label="Frais de livraison" value={formatMoney(order.deliveryFee)} />}
              {order.discount > 0 && <Row label="Réduction" value={`– ${formatMoney(order.discount)}`} accent />}
              <div className="flex items-center justify-between border-t border-slate-100 pt-2 text-base font-bold text-slate-900">
                <span>Total</span>
                <span>{formatMoney(order.total)}</span>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader title="Gestion de la commande" />
            <OrderStatusControls orderId={order.id} initialStatus={order.status} />
          </Card>
        </div>

        {/* Colonne latérale */}
        <div className="space-y-4">
          <Card>
            <CardHeader title="Client" />
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2.5 text-slate-700">
                <User className="h-4 w-4 text-slate-400" /> {order.customerName}
              </li>
              <li className="flex items-center gap-2.5 text-slate-700">
                <Phone className="h-4 w-4 text-slate-400" /> {order.customerPhone}
              </li>
              {order.address && (
                <li className="flex items-start gap-2.5 text-slate-700">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" /> {order.address}
                </li>
              )}
            </ul>
          </Card>

          <Card>
            <CardHeader title="Paiement" />
            <div className="space-y-2 text-sm">
              <Row label="Statut" value={<StatusPill {...paymentStatusStyles[order.paymentStatus]} />} />
              <Row label="Méthode" value={paymentMethodLabels[order.paymentMethod]} />
              <Row label="Montant" value={<span className="font-semibold">{formatMoney(order.total)}</span>} />
            </div>
          </Card>

          {(order.customerNote || order.allergyNote || order.internalNote) && (
            <Card>
              <CardHeader title="Notes" />
              <div className="space-y-3 text-sm">
                {order.allergyNote && (
                  <p className="flex items-start gap-2 rounded-lg bg-red-50 p-2.5 text-red-700">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /> {order.allergyNote}
                  </p>
                )}
                {order.customerNote && (
                  <p className="flex items-start gap-2 text-slate-600">
                    <StickyNote className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" /> {order.customerNote}
                  </p>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}

function Row({ label, value, accent }: { label: string; value: React.ReactNode; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-500">{label}</span>
      <span className={accent ? "text-emerald-600" : "text-slate-700"}>{value}</span>
    </div>
  );
}
