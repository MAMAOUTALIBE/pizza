"use client";

import { useState } from "react";
import { Sidebar, type SidebarBadges } from "@/components/admin/Sidebar";
import { Topbar } from "@/components/admin/Topbar";
import type { NotificationItem, UserRole } from "@/lib/admin/types";

/**
 * Coquille du back-office : sidebar + topbar + zone de contenu.
 * Gere l'ouverture de la sidebar en mobile. Le controle d'acces par role est
 * applique cote serveur dans le layout /admin avant le rendu des pages.
 */
export function AdminShell({
  name,
  role,
  notifications,
  badges,
  children,
}: {
  name: string;
  role: UserRole;
  notifications: NotificationItem[];
  badges: SidebarBadges;
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100">
      <Sidebar
        role={role}
        badges={badges}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="lg:pl-64">
        <Topbar
          name={name}
          role={role}
          notifications={notifications}
          onOpenSidebar={() => setSidebarOpen(true)}
        />

        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
