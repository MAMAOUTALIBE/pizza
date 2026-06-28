import { Download, UserPlus } from "lucide-react";
import { PageHeader, AdminButton } from "@/components/admin/ui/kit";
import { CustomersTable } from "@/components/admin/modules/CustomersTable";
import { getAdminCustomers } from "@/data/admin/customers-source";
import { DataSourceBadge } from "@/components/admin/ui/DataSourceBadge";

export default async function ClientsPage() {
  const { customers, live } = await getAdminCustomers();

  return (
    <>
      <PageHeader
        title="Clients"
        description="Base client : historique, segmentation et fidélité."
        actions={
          <>
            <DataSourceBadge live={live} />
            <AdminButton variant="secondary"><Download className="h-4 w-4" /> Exporter</AdminButton>
            <AdminButton><UserPlus className="h-4 w-4" /> Nouveau client</AdminButton>
          </>
        }
      />
      <CustomersTable customers={customers} />
    </>
  );
}
