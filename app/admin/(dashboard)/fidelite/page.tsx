import { Gift, Award, Star } from "lucide-react";
import { PageHeader, Card, CardHeader, Table, Th, Td } from "@/components/admin/ui/kit";
import { customers } from "@/data/admin/mock";

const tiers = [
  { name: "Bronze", min: 0, perk: "1 € dépensé = 1 point", color: "bg-amber-100 text-amber-700" },
  { name: "Argent", min: 500, perk: "-5 % sur les menus", color: "bg-slate-200 text-slate-600" },
  { name: "Or", min: 1500, perk: "1 pizza offerte / 10 commandes", color: "bg-yellow-100 text-yellow-700" },
  { name: "VIP", min: 3000, perk: "Livraison offerte à vie", color: "bg-purple-100 text-purple-700" },
];

const rules = [
  "1 € dépensé = 1 point cumulé",
  "100 points = 5 € de bon d'achat",
  "10 commandes = 1 pizza offerte",
  "Offre anniversaire automatique",
];

const topLoyalty = [...customers].sort((a, b) => b.loyaltyPoints - a.loyaltyPoints).slice(0, 8);

export default function FidelitePage() {
  return (
    <>
      <PageHeader
        title="Programme de fidélité"
        description="Points, paliers et récompenses pour fidéliser vos clients."
      />

      <div className="mb-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tiers.map((t) => (
          <Card key={t.name}>
            <div className="flex items-center justify-between">
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${t.color}`}>{t.name}</span>
              <Award className="h-5 w-5 text-slate-300" />
            </div>
            <p className="mt-3 text-sm font-medium text-slate-900">Dès {t.min} pts</p>
            <p className="text-xs text-slate-500">{t.perk}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2" padded={false}>
          <div className="p-5"><h2 className="text-sm font-semibold text-slate-900">Clients les plus fidèles</h2></div>
          <Table>
            <thead>
              <tr><Th>Client</Th><Th className="text-right">Commandes</Th><Th className="text-right">Points</Th></tr>
            </thead>
            <tbody>
              {topLoyalty.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/60">
                  <Td className="font-medium text-slate-900">{c.firstName} {c.lastName}</Td>
                  <Td className="text-right text-slate-600">{c.ordersCount}</Td>
                  <Td className="text-right">
                    <span className="inline-flex items-center gap-1 font-semibold text-terracotta-600">
                      <Star className="h-3.5 w-3.5 fill-terracotta-400 text-terracotta-400" /> {c.loyaltyPoints}
                    </span>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>

        <Card>
          <CardHeader title="Règles du programme" />
          <ul className="space-y-3">
            {rules.map((r) => (
              <li key={r} className="flex items-start gap-2.5 text-sm text-slate-600">
                <Gift className="mt-0.5 h-4 w-4 shrink-0 text-terracotta-500" /> {r}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}
