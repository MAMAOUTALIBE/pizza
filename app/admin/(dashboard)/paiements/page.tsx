import { Euro, Clock, RotateCcw } from "lucide-react";
import { PageHeader, StatCard } from "@/components/admin/ui/kit";
import { PaymentsTable } from "@/components/admin/modules/PaymentsTable";
import { getAdminOrders } from "@/data/admin/orders-source";
import { DataSourceBadge } from "@/components/admin/ui/DataSourceBadge";
import { formatMoney } from "@/lib/admin/format";

export default async function PaiementsPage() {
  const { orders, live } = await getAdminOrders();

  const paid = orders.filter((o) => o.paymentStatus === "PAID");
  const pending = orders.filter((o) => o.paymentStatus === "PENDING");
  const refunded = orders.filter((o) => o.paymentStatus === "REFUNDED");
  const totalPaid = paid.reduce((s, o) => s + o.total, 0);

  return (
    <>
      <PageHeader
        title="Paiements"
        description="Suivi des encaissements, remboursements et export comptable."
        actions={<DataSourceBadge live={live} />}
      />
      <div className="mb-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total encaissé" value={formatMoney(totalPaid)} icon={Euro} accent="green" />
        <StatCard label="Paiements payés" value={paid.length} icon={Euro} accent="terracotta" />
        <StatCard label="En attente" value={pending.length} icon={Clock} accent="amber" />
        <StatCard label="Remboursés" value={refunded.length} icon={RotateCcw} accent="red" />
      </div>
      <PaymentsTable orders={orders} />
    </>
  );
}
