import Link from "next/link";
import {
  Euro,
  TrendingUp,
  ShoppingBag,
  Clock,
  ChefHat,
  CheckCircle2,
  Wallet,
  UserPlus,
  Plus,
  Pizza,
  Ticket,
  ArrowRight,
} from "lucide-react";
import {
  Card,
  CardHeader,
  StatCard,
  StatusPill,
  PageHeader,
  AdminButton,
} from "@/components/admin/ui/kit";
import { LineChart, BarChart, DonutChart, HBarList } from "@/components/admin/charts/Charts";
import { computeAnalytics } from "@/data/admin/analytics";
import { getAdminOrders } from "@/data/admin/orders-source";
import { getAdminCustomers } from "@/data/admin/customers-source";
import { getAdminReservations } from "@/data/admin/reservations-source";
import { NOW } from "@/data/admin/mock";
import { DataSourceBadge } from "@/components/admin/ui/DataSourceBadge";
import { formatMoney, formatRelative } from "@/lib/admin/format";
import { orderStatusStyles, channelStyles } from "@/lib/admin/status";

export default async function DashboardPage() {
  // Données réelles si persistance active, sinon mocks — le calcul est identique.
  const [{ orders, live }, { customers }, { reservations }] = await Promise.all([
    getAdminOrders(),
    getAdminCustomers(),
    getAdminReservations(),
  ]);
  const now = live ? new Date() : NOW;
  const { kpis, revenueSeries, ordersSeries, channelSplit, hourlySeries, topProducts } =
    computeAnalytics(orders, customers, reservations, now);
  const recentOrders = orders.slice(0, 6);

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Vue d'ensemble de l'activité du restaurant aujourd'hui."
        actions={
          <>
            <DataSourceBadge live={live} />
            <AdminButton href="/admin/commandes" variant="secondary">
              <Plus className="h-4 w-4" /> Commande
            </AdminButton>
            <AdminButton href="/admin/produits" variant="secondary">
              <Pizza className="h-4 w-4" /> Pizza
            </AdminButton>
            <AdminButton href="/admin/promotions">
              <Ticket className="h-4 w-4" /> Promotion
            </AdminButton>
          </>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="CA du jour" value={formatMoney(kpis.revenueToday)} icon={Euro} trend={12} accent="terracotta" />
        <StatCard label="CA du mois" value={formatMoney(kpis.revenueMonth)} icon={TrendingUp} trend={8} accent="green" />
        <StatCard label="Commandes du jour" value={kpis.ordersToday} icon={ShoppingBag} accent="blue" />
        <StatCard label="Panier moyen" value={formatMoney(kpis.avgBasket)} icon={Wallet} accent="purple" />
        <StatCard label="En attente" value={kpis.pending} icon={Clock} accent="amber" hint="À confirmer" />
        <StatCard label="En préparation" value={kpis.preparing} icon={ChefHat} accent="amber" />
        <StatCard label="Livrées / récup." value={kpis.delivered} icon={CheckCircle2} accent="green" />
        <StatCard label="Nouveaux clients" value={kpis.newCustomers} icon={UserPlus} accent="terracotta" hint="Ce mois-ci" />
      </div>

      {/* Graphiques principaux */}
      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Chiffre d'affaires — 14 derniers jours"
            action={<span className="text-xs text-slate-400">Taux d'annulation : {kpis.cancelRate.toFixed(1)}%</span>}
          />
          <LineChart data={revenueSeries} prefix="" />
        </Card>
        <Card>
          <CardHeader title="Répartition par canal" />
          <DonutChart data={channelSplit} />
        </Card>
      </div>

      {/* Graphiques secondaires */}
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader title="Commandes / jour" />
          <BarChart data={ordersSeries} accentClass="bg-blue-400" />
        </Card>
        <Card>
          <CardHeader title="Heures les plus actives" />
          <BarChart data={hourlySeries} accentClass="bg-terracotta-400" />
        </Card>
        <Card>
          <CardHeader title="Top produits" />
          <HBarList data={topProducts} />
        </Card>
      </div>

      {/* Commandes récentes */}
      <Card className="mt-4" padded={false}>
        <div className="flex items-center justify-between p-5">
          <h2 className="text-sm font-semibold text-slate-900">Commandes récentes</h2>
          <Link href="/admin/commandes" className="inline-flex items-center gap-1 text-sm font-medium text-terracotta-600 hover:underline">
            Tout voir <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-y border-slate-100 bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="px-5 py-2.5 font-semibold">N°</th>
                <th className="px-5 py-2.5 font-semibold">Client</th>
                <th className="px-5 py-2.5 font-semibold">Canal</th>
                <th className="px-5 py-2.5 font-semibold">Statut</th>
                <th className="px-5 py-2.5 text-right font-semibold">Total</th>
                <th className="px-5 py-2.5 text-right font-semibold">Quand</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o) => (
                <tr key={o.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                  <td className="px-5 py-3 font-medium text-slate-900">{o.number}</td>
                  <td className="px-5 py-3 text-slate-600">{o.customerName}</td>
                  <td className="px-5 py-3">
                    <StatusPill {...channelStyles[o.channel]} />
                  </td>
                  <td className="px-5 py-3">
                    <StatusPill {...orderStatusStyles[o.status]} />
                  </td>
                  <td className="px-5 py-3 text-right font-semibold text-slate-900">{formatMoney(o.total)}</td>
                  <td className="px-5 py-3 text-right text-xs text-slate-400">{formatRelative(o.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
