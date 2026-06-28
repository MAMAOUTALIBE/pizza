import { Plus, Ticket } from "lucide-react";
import { PageHeader, AdminButton, Card, StatusPill, Table, Th, Td } from "@/components/admin/ui/kit";
import { promoCodes } from "@/data/admin/mock";
import { formatMoney, formatDate } from "@/lib/admin/format";

const promoTypeLabels: Record<string, string> = {
  PERCENTAGE: "Pourcentage",
  FIXED_AMOUNT: "Montant fixe",
  FREE_DELIVERY: "Livraison offerte",
  FREE_PRODUCT: "Produit offert",
  SPECIAL_MENU: "Menu spécial",
};

function promoValue(type: string, value: number) {
  if (type === "PERCENTAGE") return `-${value}%`;
  if (type === "FIXED_AMOUNT") return `-${formatMoney(value)}`;
  if (type === "FREE_DELIVERY") return "Livraison offerte";
  return "—";
}

export default function PromotionsPage() {
  return (
    <>
      <PageHeader
        title="Promotions"
        description="Codes promo, réductions automatiques et offres limitées."
        actions={<AdminButton><Plus className="h-4 w-4" /> Nouveau code promo</AdminButton>}
      />
      <Card padded={false}>
        <Table>
          <thead>
            <tr>
              <Th>Code</Th><Th>Type</Th><Th>Valeur</Th><Th className="text-right">Min.</Th>
              <Th className="text-right">Utilisations</Th><Th>Expire le</Th><Th>Statut</Th>
            </tr>
          </thead>
          <tbody>
            {promoCodes.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50/60">
                <Td>
                  <span className="flex items-center gap-2 font-mono font-semibold text-slate-900">
                    <Ticket className="h-4 w-4 text-terracotta-500" /> {p.code}
                  </span>
                  <span className="text-xs text-slate-400">{p.description}</span>
                </Td>
                <Td className="text-slate-600">{promoTypeLabels[p.type]}</Td>
                <Td className="font-semibold text-terracotta-600">{promoValue(p.type, p.value)}</Td>
                <Td className="text-right text-slate-600">{p.minOrder > 0 ? formatMoney(p.minOrder) : "—"}</Td>
                <Td className="text-right text-slate-600">
                  {p.usedCount}{p.maxUses ? ` / ${p.maxUses}` : ""}
                </Td>
                <Td className="text-slate-500">{p.endsAt ? formatDate(p.endsAt) : "—"}</Td>
                <Td><StatusPill label={p.active ? "Active" : "Expirée"} className={p.active ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-500"} /></Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </>
  );
}
