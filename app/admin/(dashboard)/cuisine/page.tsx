import { PageHeader } from "@/components/admin/ui/kit";
import { KitchenBoard } from "@/components/admin/modules/KitchenBoard";
import { getAdminOrders } from "@/data/admin/orders-source";
import { DataSourceBadge } from "@/components/admin/ui/DataSourceBadge";

// Statuts « actifs » en cuisine (hors livrées / récupérées / annulées).
const KITCHEN_STATUSES = new Set(["NEW", "CONFIRMED", "PREPARING", "READY", "OUT_FOR_DELIVERY"]);

export default async function CuisinePage() {
  const { orders, live } = await getAdminOrders();
  const kitchenOrders = orders.filter((o) => KITCHEN_STATUSES.has(o.status));

  return (
    <>
      <PageHeader
        title="Vue cuisine"
        description="Écran de production — commandes à préparer, triées par état."
        actions={<DataSourceBadge live={live} />}
      />
      <KitchenBoard orders={kitchenOrders} />
    </>
  );
}
