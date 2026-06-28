import { Plus } from "lucide-react";
import { PageHeader, AdminButton } from "@/components/admin/ui/kit";
import { OrdersTable } from "@/components/admin/modules/OrdersTable";
import { getAdminOrders } from "@/data/admin/orders-source";
import { DataSourceBadge } from "@/components/admin/ui/DataSourceBadge";

export default async function CommandesPage() {
  const { orders, live } = await getAdminOrders();

  return (
    <>
      <PageHeader
        title="Commandes"
        description="Suivez et gérez toutes les commandes du restaurant."
        actions={
          <>
            <DataSourceBadge live={live} />
            <AdminButton href="/admin/cuisine" variant="secondary">Vue cuisine</AdminButton>
            <AdminButton><Plus className="h-4 w-4" /> Nouvelle commande</AdminButton>
          </>
        }
      />
      <OrdersTable orders={orders} />
    </>
  );
}
