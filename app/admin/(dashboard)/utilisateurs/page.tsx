import { UserPlus } from "lucide-react";
import { PageHeader, AdminButton, Card, StatusPill, Table, Th, Td } from "@/components/admin/ui/kit";
import { adminUsers } from "@/data/admin/mock";
import { formatRelative } from "@/lib/admin/format";
import { roleLabels } from "@/lib/admin/nav";

const roleColor: Record<string, string> = {
  SUPER_ADMIN: "bg-purple-100 text-purple-700",
  MANAGER: "bg-blue-100 text-blue-700",
  KITCHEN: "bg-amber-100 text-amber-700",
  DRIVER: "bg-teal-100 text-teal-700",
  SUPPORT: "bg-slate-200 text-slate-600",
};

export default function UtilisateursPage() {
  return (
    <>
      <PageHeader
        title="Utilisateurs & permissions"
        description="Comptes internes, rôles et accès. Réservé au Super Admin."
        actions={<AdminButton><UserPlus className="h-4 w-4" /> Nouvel utilisateur</AdminButton>}
      />
      <Card padded={false}>
        <Table>
          <thead>
            <tr><Th>Utilisateur</Th><Th>Rôle</Th><Th>Téléphone</Th><Th>Dernière connexion</Th><Th>Statut</Th></tr>
          </thead>
          <tbody>
            {adminUsers.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50/60">
                <Td>
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-terracotta-500 text-xs font-bold text-white">
                      {u.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                    </span>
                    <span>
                      <span className="block font-medium text-slate-900">{u.name}</span>
                      <span className="block text-xs text-slate-400">{u.email}</span>
                    </span>
                  </div>
                </Td>
                <Td><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${roleColor[u.role]}`}>{roleLabels[u.role]}</span></Td>
                <Td className="text-slate-600">{u.phone ?? "—"}</Td>
                <Td className="text-xs text-slate-400">{u.lastLoginAt ? formatRelative(u.lastLoginAt) : "Jamais"}</Td>
                <Td><StatusPill label={u.active ? "Actif" : "Désactivé"} className={u.active ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-500"} /></Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </>
  );
}
