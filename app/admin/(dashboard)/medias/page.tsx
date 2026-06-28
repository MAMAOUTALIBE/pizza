import Image from "next/image";
import { Upload } from "lucide-react";
import { PageHeader, AdminButton, Card } from "@/components/admin/ui/kit";
import { mediaFiles } from "@/data/admin/mock";

const folders = Array.from(new Set(mediaFiles.map((m) => m.folder)));

export default function MediasPage() {
  return (
    <>
      <PageHeader
        title="Médiathèque"
        description="Centralisez les visuels : pizzas, menus, restaurant, équipe et promotions."
        actions={<AdminButton><Upload className="h-4 w-4" /> Importer</AdminButton>}
      />

      <div className="mb-4 flex flex-wrap gap-2">
        <span className="rounded-lg bg-terracotta-500 px-3 py-1.5 text-sm font-medium text-white">Tous</span>
        {folders.map((f) => (
          <span key={f} className="rounded-lg bg-white px-3 py-1.5 text-sm font-medium capitalize text-slate-600 ring-1 ring-slate-200">{f}</span>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {mediaFiles.map((m) => (
          <Card key={m.id} padded={false} className="overflow-hidden">
            <div className="relative aspect-square bg-slate-100">
              <Image src={m.url} alt={m.name} fill className="object-cover" sizes="200px" />
            </div>
            <div className="p-3">
              <p className="truncate text-xs font-medium text-slate-700">{m.name}</p>
              <p className="text-[0.65rem] capitalize text-slate-400">{m.folder}</p>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
