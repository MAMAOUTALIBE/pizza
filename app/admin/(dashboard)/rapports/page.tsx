import { FileSpreadsheet, FileText, TrendingUp } from "lucide-react";
import { PageHeader, AdminButton, Card, CardHeader, StatCard } from "@/components/admin/ui/kit";
import { LineChart, BarChart, DonutChart, HBarList } from "@/components/admin/charts/Charts";
import { kpis, revenueSeries, ordersSeries, channelSplit, hourlySeries, topProducts } from "@/data/admin/analytics";
import { customers } from "@/data/admin/mock";
import { formatMoney } from "@/lib/admin/format";

const topCustomers = [...customers]
  .sort((a, b) => b.totalSpent - a.totalSpent)
  .slice(0, 5)
  .map((c) => ({ label: `${c.firstName} ${c.lastName}`, value: Math.round(c.totalSpent) }));

export default function RapportsPage() {
  return (
    <>
      <PageHeader
        title="Rapports & analytiques"
        description="Analyses détaillées de la performance du restaurant."
        actions={
          <>
            <AdminButton variant="secondary"><FileSpreadsheet className="h-4 w-4" /> Export Excel</AdminButton>
            <AdminButton variant="secondary"><FileText className="h-4 w-4" /> Export PDF</AdminButton>
          </>
        }
      />

      <div className="mb-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="CA du mois" value={formatMoney(kpis.revenueMonth)} icon={TrendingUp} trend={8} accent="green" />
        <StatCard label="Panier moyen" value={formatMoney(kpis.avgBasket)} icon={TrendingUp} accent="terracotta" />
        <StatCard label="Nouveaux clients" value={kpis.newCustomers} icon={TrendingUp} accent="blue" />
        <StatCard label="Taux d'annulation" value={`${kpis.cancelRate.toFixed(1)}%`} icon={TrendingUp} accent="red" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Chiffre d'affaires (14 j)" />
          <LineChart data={revenueSeries} />
        </Card>
        <Card>
          <CardHeader title="Répartition par canal" />
          <DonutChart data={channelSplit} />
        </Card>
        <Card>
          <CardHeader title="Commandes par jour" />
          <BarChart data={ordersSeries} accentClass="bg-blue-400" />
        </Card>
        <Card>
          <CardHeader title="Heures les plus rentables" />
          <BarChart data={hourlySeries} />
        </Card>
        <Card>
          <CardHeader title="Top produits (ventes)" />
          <HBarList data={topProducts} />
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader title="Meilleurs clients (CA cumulé)" />
          <HBarList data={topCustomers} suffix=" €" />
        </Card>
      </div>
    </>
  );
}
