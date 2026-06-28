import { Plus } from "lucide-react";
import { PageHeader, AdminButton } from "@/components/admin/ui/kit";
import { ProductsTable } from "@/components/admin/modules/ProductsTable";
import { getAdminProducts } from "@/data/admin/products-source";
import { DataSourceBadge } from "@/components/admin/ui/DataSourceBadge";

export default async function ProduitsPage() {
  const { products, live } = await getAdminProducts();

  return (
    <>
      <PageHeader
        title="Produits"
        description="Gérez le catalogue : pizzas, boissons, desserts et accompagnements."
        actions={
          <>
            <DataSourceBadge live={live} />
            <AdminButton><Plus className="h-4 w-4" /> Nouveau produit</AdminButton>
          </>
        }
      />
      <ProductsTable products={products} />
    </>
  );
}
