"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, Search, Bell, LogOut, ChevronDown } from "lucide-react";
import { allNavItems, roleLabels } from "@/lib/admin/nav";
import type { NotificationItem, UserRole } from "@/lib/admin/types";
import { logoutAction } from "@/app/admin/login/actions";
import { formatRelative } from "@/lib/admin/format";
import { cn } from "@/lib/utils";

function usePageTitle() {
  const pathname = usePathname();
  if (pathname === "/admin") return "Dashboard";
  const match = allNavItems
    .filter((i) => i.href !== "/admin" && pathname.startsWith(i.href))
    .sort((a, b) => b.href.length - a.href.length)[0];
  return match?.label ?? "Back-office";
}

export function Topbar({
  name,
  role,
  notifications,
  onOpenSidebar,
}: {
  name: string;
  role: UserRole;
  notifications: NotificationItem[];
  onOpenSidebar: () => void;
}) {
  const title = usePageTitle();
  const [openNotif, setOpenNotif] = useState(false);
  const [openUser, setOpenUser] = useState(false);
  const unread = notifications.filter((n) => !n.read).length;

  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-6">
      <button
        type="button"
        onClick={onOpenSidebar}
        aria-label="Ouvrir le menu"
        className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
      >
        <Menu className="h-5 w-5" aria-hidden />
      </button>

      <h1 className="text-lg font-bold text-slate-900">{title}</h1>

      {/* Recherche */}
      <div className="relative ml-auto hidden md:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
        <input
          type="search"
          placeholder="Rechercher…"
          className="w-56 rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-terracotta-500 focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 lg:w-72"
        />
      </div>

      {/* Notifications */}
      <div className="relative ml-auto md:ml-0">
        <button
          type="button"
          onClick={() => {
            setOpenNotif((v) => !v);
            setOpenUser(false);
          }}
          aria-label="Notifications"
          className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100"
        >
          <Bell className="h-5 w-5" aria-hidden />
          {unread > 0 && (
            <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-terracotta-500 px-1 text-[0.6rem] font-bold text-white">
              {unread}
            </span>
          )}
        </button>

        {openNotif && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpenNotif(false)} aria-hidden />
            <div className="absolute right-0 z-20 mt-2 w-80 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <span className="text-sm font-semibold text-slate-900">Notifications</span>
                <span className="text-xs text-slate-400">{unread} non lues</span>
              </div>
              <ul className="max-h-80 divide-y divide-slate-100 overflow-y-auto">
                {notifications.slice(0, 6).map((n) => (
                  <li key={n.id} className={cn("px-4 py-3", !n.read && "bg-terracotta-50/40")}>
                    <p className="text-sm font-medium text-slate-800">{n.title}</p>
                    <p className="text-xs text-slate-500">{n.body}</p>
                    <p className="mt-1 text-[0.65rem] text-slate-400">{formatRelative(n.createdAt)}</p>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>

      {/* Menu utilisateur */}
      <div className="relative">
        <button
          type="button"
          onClick={() => {
            setOpenUser((v) => !v);
            setOpenNotif(false);
          }}
          className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-slate-100"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-terracotta-500 text-sm font-bold text-white">
            {initials}
          </span>
          <span className="hidden text-left sm:block">
            <span className="block text-sm font-semibold leading-tight text-slate-900">{name}</span>
            <span className="block text-xs leading-tight text-slate-500">{roleLabels[role]}</span>
          </span>
          <ChevronDown className="hidden h-4 w-4 text-slate-400 sm:block" aria-hidden />
        </button>

        {openUser && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpenUser(false)} aria-hidden />
            <div className="absolute right-0 z-20 mt-2 w-52 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
              <div className="border-b border-slate-100 px-4 py-3">
                <p className="text-sm font-semibold text-slate-900">{name}</p>
                <p className="text-xs text-slate-500">{roleLabels[role]}</p>
              </div>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-tomato-600 hover:bg-slate-50"
                >
                  <LogOut className="h-4 w-4" aria-hidden />
                  Se déconnecter
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
