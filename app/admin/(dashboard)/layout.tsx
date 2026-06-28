import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { getSession } from "@/lib/admin/auth";
import { AdminShell } from "@/components/admin/AdminShell";
import { notifications, orders, reviews, stockItems } from "@/data/admin/mock";
import { canAccessPath } from "@/lib/admin/nav";

export const metadata: Metadata = {
  title: "Back-office · La Bella",
  robots: { index: false, follow: false },
};

// Le back-office dépend de la session → toujours rendu dynamiquement.
export const dynamic = "force-dynamic";

/**
 * Layout protégé du back-office.
 * Vérifie la session (signature + expiration) et monte la coquille admin.
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  const pathname = (await headers()).get("x-admin-pathname") ?? "/admin";
  const allowed = canAccessPath(pathname, session.role);

  // Compteurs de badges affichés dans la sidebar.
  const badges = {
    pendingOrders: orders.filter((o) => o.status === "NEW" || o.status === "CONFIRMED").length,
    pendingReviews: reviews.filter((r) => r.status === "PENDING").length,
    lowStock: stockItems.filter((s) => s.status !== "OK").length,
  };

  return (
    <AdminShell
      name={session.name}
      role={session.role}
      notifications={notifications}
      badges={badges}
    >
      {allowed ? children : <AccessDenied />}
    </AdminShell>
  );
}

function AccessDenied() {
  return (
    <div className="mx-auto mt-16 max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <ShieldAlert className="mx-auto h-12 w-12 text-tomato-500" aria-hidden />
      <h2 className="mt-4 text-xl font-bold text-slate-900">Acces refuse</h2>
      <p className="mt-2 text-sm text-slate-500">
        Votre role ne dispose pas des permissions necessaires pour acceder a
        cette section.
      </p>
      <Link
        href="/admin"
        className="mt-6 inline-block rounded-lg bg-terracotta-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-terracotta-600"
      >
        Retour au dashboard
      </Link>
    </div>
  );
}
