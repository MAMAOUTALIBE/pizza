import { Plus } from "lucide-react";
import { PageHeader, AdminButton, Card } from "@/components/admin/ui/kit";
import { formatMoney } from "@/lib/admin/format";

// Groupes d'options de démonstration (en prod : modèle OptionGroup / ProductOption).
const optionGroups = [
  {
    id: "g-taille",
    name: "Taille",
    required: true,
    multiple: false,
    options: [
      { name: "Junior (26cm)", delta: -2 },
      { name: "Normale (33cm)", delta: 0 },
      { name: "Méga (40cm)", delta: 4 },
    ],
  },
  {
    id: "g-pate",
    name: "Type de pâte",
    required: true,
    multiple: false,
    options: [
      { name: "Pâte fine", delta: 0 },
      { name: "Pâte épaisse", delta: 0 },
      { name: "Pâte sans gluten", delta: 2 },
    ],
  },
  {
    id: "g-supp",
    name: "Suppléments",
    required: false,
    multiple: true,
    options: [
      { name: "Fromage en plus", delta: 1.5 },
      { name: "Viande supplémentaire", delta: 2.5 },
      { name: "Œuf", delta: 1 },
      { name: "Olives", delta: 1 },
      { name: "Champignons", delta: 1 },
      { name: "Sauce piquante", delta: 0.5 },
    ],
  },
];

export default function OptionsPage() {
  return (
    <>
      <PageHeader
        title="Options & suppléments"
        description="Groupes d'options affectables aux produits (taille, pâte, suppléments…)."
        actions={<AdminButton><Plus className="h-4 w-4" /> Nouveau groupe</AdminButton>}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {optionGroups.map((g) => (
          <Card key={g.id}>
            <div className="flex items-start justify-between">
              <h2 className="font-semibold text-slate-900">{g.name}</h2>
              <div className="flex gap-1">
                <span className={`rounded-full px-2 py-0.5 text-[0.65rem] font-medium ${g.required ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-500"}`}>
                  {g.required ? "Obligatoire" : "Facultatif"}
                </span>
                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[0.65rem] font-medium text-blue-700">
                  {g.multiple ? "Choix multiple" : "Choix unique"}
                </span>
              </div>
            </div>
            <ul className="mt-4 space-y-2">
              {g.options.map((o) => (
                <li key={o.name} className="flex items-center justify-between border-b border-slate-50 pb-2 text-sm last:border-0">
                  <span className="text-slate-600">{o.name}</span>
                  <span className={o.delta === 0 ? "text-slate-400" : "font-medium text-terracotta-600"}>
                    {o.delta === 0 ? "Inclus" : `${o.delta > 0 ? "+" : ""}${formatMoney(o.delta)}`}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </>
  );
}
