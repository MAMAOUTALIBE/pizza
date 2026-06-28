import { PageHeader, Card, Table, Th, Td } from "@/components/admin/ui/kit";
import { getAdminActivityLogs } from "@/data/admin/logs-source";
import { DataSourceBadge } from "@/components/admin/ui/DataSourceBadge";
import { formatDateTime } from "@/lib/admin/format";

export default async function LogsPage() {
  const { logs, live } = await getAdminActivityLogs();

  return (
    <>
      <PageHeader
        title="Journal d'activité"
        description="Traçabilité des actions sensibles : commandes, prix, remboursements, RGPD, paramètres."
        actions={<DataSourceBadge live={live} />}
      />
      <Card padded={false}>
        <Table>
          <thead>
            <tr><Th>Utilisateur</Th><Th>Action</Th><Th>Entité</Th><Th>Détail</Th><Th className="text-right">Date</Th></tr>
          </thead>
          <tbody>
            {logs.map((l) => (
              <tr key={l.id} className="hover:bg-slate-50/60">
                <Td className="font-medium text-slate-900">{l.userName}</Td>
                <Td><code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-600">{l.action}</code></Td>
                <Td className="text-slate-600">{l.entity}</Td>
                <Td className="text-slate-500">{l.detail}</Td>
                <Td className="text-right text-xs text-slate-400">{formatDateTime(l.createdAt)}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </>
  );
}
