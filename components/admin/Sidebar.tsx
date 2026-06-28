"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Leaf, X } from "lucide-react";
import { navGroups, canSee, type NavItem } from "@/lib/admin/nav";
import type { UserRole } from "@/lib/admin/types";
import { cn } from "@/lib/utils";

export interface SidebarBadges {
  pendingOrders: number;
  pendingReviews: number;
  lowStock: number;
}

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavRow({
  item,
  badges,
  onNavigate,
}: {
  item: NavItem;
  badges: SidebarBadges;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const active = isActive(pathname, item.href);
  const badge = item.badgeKey ? badges[item.badgeKey] : 0;
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      data-active={active}
      className={cn(
        "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-terracotta-500/15 text-terracotta-300"
          : "text-slate-300 hover:bg-white/5 hover:text-white",
      )}
    >
      <Icon
        className={cn(
          "h-[18px] w-[18px] shrink-0",
          active ? "text-terracotta-400" : "text-slate-400 group-hover:text-slate-200",
        )}
        aria-hidden
      />
      <span className="flex-1 truncate">{item.label}</span>
      {badge > 0 && (
        <span className="rounded-full bg-terracotta-500 px-2 py-0.5 text-[0.65rem] font-bold text-white">
          {badge}
        </span>
      )}
    </Link>
  );
}

/** Barre latérale du back-office (navigation filtrée par rôle). */
export function Sidebar({
  role,
  badges,
  open,
  onClose,
}: {
  role: UserRole;
  badges: SidebarBadges;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <>
      {/* Voile mobile */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
        aria-hidden
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-slate-950 transition-transform duration-300 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Marque */}
        <div className="flex h-16 items-center justify-between border-b border-white/5 px-5">
          <Link href="/admin" className="flex items-center gap-1.5" onClick={onClose}>
            <span className="font-script text-2xl text-white">La Bella</span>
            <Leaf className="h-4 w-4 text-basil-400" aria-hidden />
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer le menu"
            className="rounded-md p-1.5 text-slate-400 hover:bg-white/5 hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        {/* Navigation */}
        <nav className="no-scrollbar flex-1 space-y-6 overflow-y-auto px-3 py-5">
          {navGroups.map((group) => {
            const items = group.items.filter((i) => canSee(i, role));
            if (items.length === 0) return null;
            return (
              <div key={group.title}>
                <p className="px-3 pb-2 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  {group.title}
                </p>
                <div className="space-y-0.5">
                  {items.map((item) => (
                    <NavRow
                      key={item.href}
                      item={item}
                      badges={badges}
                      onNavigate={onClose}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Lien retour site */}
        <div className="border-t border-white/5 p-3">
          <Link
            href="/"
            className="block rounded-lg px-3 py-2 text-xs text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
          >
            ← Retour au site public
          </Link>
        </div>
      </aside>
    </>
  );
}
