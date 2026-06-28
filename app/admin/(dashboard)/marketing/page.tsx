import { Plus, Mail, MessageSquare } from "lucide-react";
import { PageHeader, AdminButton, Card, StatusPill, Table, Th, Td } from "@/components/admin/ui/kit";
import { campaigns } from "@/data/admin/mock";
import { formatDate } from "@/lib/admin/format";
import { campaignStatusStyles } from "@/lib/admin/status";

const segments = [
  "Clients fidèles", "Clients inactifs (30j)", "Nouveaux clients",
  "Gros paniers", "Clients livraison", "Clients retrait",
];

export default function MarketingPage() {
  return (
    <>
      <PageHeader
        title="Marketing & campagnes"
        description="Emails et SMS ciblés : nouveautés, relances et offres personnalisées."
        actions={<AdminButton><Plus className="h-4 w-4" /> Nouvelle campagne</AdminButton>}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2" padded={false}>
          <div className="p-5"><h2 className="text-sm font-semibold text-slate-900">Campagnes</h2></div>
          <Table>
            <thead>
              <tr><Th>Campagne</Th><Th>Canal</Th><Th>Segment</Th><Th className="text-right">Destinataires</Th><Th className="text-right">Ouv. / Clics</Th><Th>Statut</Th></tr>
            </thead>
            <tbody>
              {campaigns.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/60">
                  <Td>
                    <span className="font-medium text-slate-900">{c.name}</span>
                    {c.sentAt && <span className="block text-xs text-slate-400">Envoyée le {formatDate(c.sentAt)}</span>}
                  </Td>
                  <Td>
                    <span className="inline-flex items-center gap-1 text-slate-600">
                      {c.channel === "EMAIL" ? <Mail className="h-4 w-4" /> : <MessageSquare className="h-4 w-4" />}
                      {c.channel === "EMAIL" ? "Email" : "SMS"}
                    </span>
                  </Td>
                  <Td className="text-slate-600">{c.segment}</Td>
                  <Td className="text-right text-slate-600">{c.recipients || "—"}</Td>
                  <Td className="text-right text-slate-600">
                    {c.openRate != null ? `${c.openRate}% / ${c.clickRate}%` : "—"}
                  </Td>
                  <Td><StatusPill {...campaignStatusStyles[c.status]} /></Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>

        <Card>
          <h2 className="mb-3 text-sm font-semibold text-slate-900">Segments disponibles</h2>
          <ul className="space-y-2">
            {segments.map((s) => (
              <li key={s} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">
                {s}
                <button className="text-xs font-medium text-terracotta-600 hover:underline">Cibler</button>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}
