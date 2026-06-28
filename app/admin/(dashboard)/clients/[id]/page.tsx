import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, Phone, Gift, ShoppingBag, Wallet, AlertTriangle, MessageSquare } from "lucide-react";
import { getAdminCustomerById } from "@/data/admin/customers-source";
import { formatMoney, formatDate, formatRelative } from "@/lib/admin/format";
import { orderStatusStyles } from "@/lib/admin/status";
import { Card, CardHeader, StatusPill, StatCard, AdminButton } from "@/components/admin/ui/kit";

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { customer, orders: customerOrders } = await getAdminCustomerById(id);
  if (!customer) notFound();

  return (
    <>
      <Link href="/admin/clients" className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800">
        <ArrowLeft className="h-4 w-4" /> Retour aux clients
      </Link>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-terracotta-500 text-lg font-bold text-white">
            {customer.firstName[0]}{customer.lastName[0]}
          </span>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{customer.firstName} {customer.lastName}</h1>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {customer.tags.map((t) => (
                <span key={t} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">{t}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <AdminButton variant="secondary"><Mail className="h-4 w-4" /> Email</AdminButton>
          <AdminButton variant="secondary"><MessageSquare className="h-4 w-4" /> SMS</AdminButton>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Commandes" value={customer.ordersCount} icon={ShoppingBag} accent="blue" />
        <StatCard label="Total dépensé" value={formatMoney(customer.totalSpent)} icon={Wallet} accent="green" />
        <StatCard label="Panier moyen" value={formatMoney(customer.avgBasket)} icon={Wallet} accent="terracotta" />
        <StatCard label="Points fidélité" value={customer.loyaltyPoints} icon={Gift} accent="purple" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader title="Coordonnées" />
          <ul className="space-y-2.5 text-sm">
            <li className="flex items-center gap-2.5 text-slate-700"><Mail className="h-4 w-4 text-slate-400" /> {customer.email}</li>
            <li className="flex items-center gap-2.5 text-slate-700"><Phone className="h-4 w-4 text-slate-400" /> {customer.phone}</li>
            <li className="text-slate-500">Client depuis le {formatDate(customer.createdAt)}</li>
            <li className="text-slate-500">Marketing : {customer.marketingOptIn ? "Opt-in ✓" : "Non"} · SMS : {customer.smsOptIn ? "Opt-in ✓" : "Non"}</li>
          </ul>
          {customer.allergies && (
            <p className="mt-4 flex items-start gap-2 rounded-lg bg-red-50 p-2.5 text-sm text-red-700">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /> Allergie : {customer.allergies}
            </p>
          )}
        </Card>

        <Card className="lg:col-span-2" padded={false}>
          <div className="p-5"><h2 className="text-sm font-semibold text-slate-900">Historique des commandes</h2></div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-y border-slate-100 bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-2.5 font-semibold">N°</th>
                  <th className="px-5 py-2.5 font-semibold">Statut</th>
                  <th className="px-5 py-2.5 text-right font-semibold">Total</th>
                  <th className="px-5 py-2.5 text-right font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {customerOrders.map((o) => (
                  <tr key={o.id} className="border-b border-slate-50 last:border-0">
                    <td className="px-5 py-3">
                      <Link href={`/admin/commandes/${o.id}`} className="font-medium text-terracotta-600 hover:underline">{o.number}</Link>
                    </td>
                    <td className="px-5 py-3"><StatusPill {...orderStatusStyles[o.status]} /></td>
                    <td className="px-5 py-3 text-right font-semibold text-slate-900">{formatMoney(o.total)}</td>
                    <td className="px-5 py-3 text-right text-xs text-slate-400">{formatRelative(o.createdAt)}</td>
                  </tr>
                ))}
                {customerOrders.length === 0 && (
                  <tr><td colSpan={4} className="px-5 py-8 text-center text-sm text-slate-400">Aucune commande récente.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </>
  );
}
