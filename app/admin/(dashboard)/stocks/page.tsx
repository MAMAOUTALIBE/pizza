import { Plus, AlertTriangle, Package } from "lucide-react";
import { PageHeader, AdminButton, Card, StatCard, StatusPill, Table, Th, Td } from "@/components/admin/ui/kit";
import { stockItems } from "@/data/admin/mock";
import { stockStatusStyles } from "@/lib/admin/status";

export default function StocksPage() {
  const low = stockItems.filter((s) => s.status !== "OK").length;

  return (
    <>
      <PageHeader
        title="Stocks"
        description="Gestion simple des ingrédients et alertes de réapprovisionnement."
        actions={<AdminButton><Plus className="h-4 w-4" /> Ajouter un ingrédient</AdminButton>}
      />

      <div className="mb-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Ingrédients suivis" value={stockItems.length} icon={Package} accent="blue" />
        <StatCard label="Alertes stock bas" value={low} icon={AlertTriangle} accent={low > 0 ? "amber" : "green"} />
      </div>

      <Card padded={false}>
        <Table>
          <thead>
            <tr><Th>Ingrédient</Th><Th className="text-right">Quantité</Th><Th className="text-right">Seuil d&apos;alerte</Th><Th>Statut</Th></tr>
          </thead>
          <tbody>
            {stockItems.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50/60">
                <Td className="font-medium text-slate-900">{s.name}</Td>
                <Td className="text-right text-slate-700">{s.quantity} {s.unit}</Td>
                <Td className="text-right text-slate-400">{s.threshold} {s.unit}</Td>
                <Td><StatusPill {...stockStatusStyles[s.status]} /></Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </>
  );
}
