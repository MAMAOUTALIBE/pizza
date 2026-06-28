import { Plus, GripVertical } from "lucide-react";
import { PageHeader, AdminButton, Card, StatusPill, Table, Th, Td } from "@/components/admin/ui/kit";
import { products } from "@/data/admin/mock";

// Catégories dérivées du catalogue + comptage produits.
const categoryCounts = products.reduce<Record<string, number>>((acc, p) => {
  acc[p.category] = (acc[p.category] ?? 0) + 1;
  return acc;
}, {});
const categories = Object.entries(categoryCounts).map(([name, count], i) => ({
  id: `cat-${i}`,
  name,
  count,
  active: true,
}));

export default function CategoriesPage() {
  return (
    <>
      <PageHeader
        title="Catégories"
        description="Organisez la carte par catégories et ordre d'affichage."
        actions={<AdminButton><Plus className="h-4 w-4" /> Nouvelle catégorie</AdminButton>}
      />
      <Card padded={false}>
        <Table>
          <thead>
            <tr><Th>Ordre</Th><Th>Catégorie</Th><Th className="text-right">Produits</Th><Th>Statut</Th></tr>
          </thead>
          <tbody>
            {categories.map((c, i) => (
              <tr key={c.id} className="hover:bg-slate-50/60">
                <Td><span className="flex items-center gap-1 text-slate-400"><GripVertical className="h-4 w-4" /> {i + 1}</span></Td>
                <Td className="font-medium text-slate-900">{c.name}</Td>
                <Td className="text-right text-slate-600">{c.count}</Td>
                <Td><StatusPill label="Active" className="bg-emerald-100 text-emerald-700" /></Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </>
  );
}
