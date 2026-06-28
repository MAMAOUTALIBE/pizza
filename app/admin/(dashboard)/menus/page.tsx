import Image from "next/image";
import { Plus, Check } from "lucide-react";
import { PageHeader, AdminButton, Card } from "@/components/admin/ui/kit";
import { formulas } from "@/data/menus";
import { formatMoney } from "@/lib/admin/format";

export default function MenusAdminPage() {
  return (
    <>
      <PageHeader
        title="Menus & formules"
        description="Composez et gérez les formules combinées proposées sur le site."
        actions={<AdminButton><Plus className="h-4 w-4" /> Nouvelle formule</AdminButton>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {formulas.map((f) => (
          <Card key={f.id} padded={false} className="overflow-hidden">
            <div className="relative aspect-[16/9] bg-slate-100">
              <Image src={f.image} alt={f.name} fill className="object-cover" sizes="(max-width:768px) 100vw, 33vw" />
              {f.popular && (
                <span className="absolute right-3 top-3 rounded-full bg-terracotta-500 px-2.5 py-1 text-xs font-semibold text-white">Populaire</span>
              )}
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-bold text-slate-900">{f.name}</h2>
                <span className="shrink-0 font-bold text-terracotta-600">{formatMoney(f.price)}</span>
              </div>
              <p className="mt-1 text-sm text-slate-500">{f.description}</p>
              <ul className="mt-3 space-y-1">
                {f.items.map((it) => (
                  <li key={it} className="flex items-start gap-1.5 text-xs text-slate-600">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" /> {it}
                  </li>
                ))}
              </ul>
              {f.availability && <p className="mt-3 text-xs text-slate-400">{f.availability}</p>}
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
