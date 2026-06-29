import {
  LayoutDashboard,
  ChefHat,
  ShoppingBag,
  CalendarCheck,
  Bike,
  CreditCard,
  Pizza,
  UtensilsCrossed,
  Tags,
  SlidersHorizontal,
  Boxes,
  Users,
  Star,
  Gift,
  Ticket,
  Megaphone,
  Globe,
  Image as ImageIcon,
  Bell,
  Bot,
  BarChart3,
  UserCog,
  Settings,
  ScrollText,
  type LucideIcon,
} from "lucide-react";
import type { UserRole } from "@/lib/admin/types";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Rôles autorisés. Absent = tous les rôles connectés. */
  roles?: UserRole[];
  /** Pastille de comptage optionnelle (clé résolue dans la Sidebar). */
  badgeKey?: "pendingOrders" | "pendingReviews" | "lowStock";
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

/**
 * Arborescence de la sidebar du back-office, regroupée par domaine.
 * L'ordre suit la navigation décrite dans le cahier des charges.
 */
export const navGroups: NavGroup[] = [
  {
    title: "Pilotage",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { label: "Vue cuisine", href: "/admin/cuisine", icon: ChefHat, roles: ["SUPER_ADMIN", "MANAGER", "KITCHEN"] },
    ],
  },
  {
    title: "Ventes",
    items: [
      { label: "Commandes", href: "/admin/commandes", icon: ShoppingBag, badgeKey: "pendingOrders", roles: ["SUPER_ADMIN", "MANAGER", "KITCHEN", "SUPPORT"] },
      { label: "Réservations", href: "/admin/reservations", icon: CalendarCheck, roles: ["SUPER_ADMIN", "MANAGER", "SUPPORT"] },
      { label: "Livraisons", href: "/admin/livraisons", icon: Bike, roles: ["SUPER_ADMIN", "MANAGER", "DRIVER"] },
      { label: "Paiements", href: "/admin/paiements", icon: CreditCard, roles: ["SUPER_ADMIN", "MANAGER"] },
    ],
  },
  {
    title: "Catalogue",
    items: [
      { label: "Produits", href: "/admin/produits", icon: Pizza, roles: ["SUPER_ADMIN", "MANAGER", "KITCHEN"] },
      { label: "Menus", href: "/admin/menus", icon: UtensilsCrossed, roles: ["SUPER_ADMIN", "MANAGER"] },
      { label: "Catégories", href: "/admin/categories", icon: Tags, roles: ["SUPER_ADMIN", "MANAGER"] },
      { label: "Options", href: "/admin/options", icon: SlidersHorizontal, roles: ["SUPER_ADMIN", "MANAGER"] },
      { label: "Stocks", href: "/admin/stocks", icon: Boxes, badgeKey: "lowStock", roles: ["SUPER_ADMIN", "MANAGER", "KITCHEN"] },
    ],
  },
  {
    title: "Relation client",
    items: [
      { label: "Clients", href: "/admin/clients", icon: Users, roles: ["SUPER_ADMIN", "MANAGER", "SUPPORT"] },
      { label: "Avis", href: "/admin/avis", icon: Star, badgeKey: "pendingReviews", roles: ["SUPER_ADMIN", "MANAGER", "SUPPORT"] },
      { label: "Promotions", href: "/admin/promotions", icon: Ticket, roles: ["SUPER_ADMIN", "MANAGER"] },
      { label: "Fidélité", href: "/admin/fidelite", icon: Gift, roles: ["SUPER_ADMIN", "MANAGER"] },
      { label: "Marketing", href: "/admin/marketing", icon: Megaphone, roles: ["SUPER_ADMIN", "MANAGER"] },
    ],
  },
  {
    title: "Contenu",
    items: [
      { label: "Site web", href: "/admin/site", icon: Globe, roles: ["SUPER_ADMIN", "MANAGER"] },
      { label: "Médiathèque", href: "/admin/medias", icon: ImageIcon, roles: ["SUPER_ADMIN", "MANAGER"] },
    ],
  },
  {
    title: "Système",
    items: [
      { label: "Notifications", href: "/admin/notifications", icon: Bell },
      { label: "IA Assistant", href: "/admin/ia", icon: Bot, roles: ["SUPER_ADMIN", "MANAGER"] },
      { label: "Rapports", href: "/admin/rapports", icon: BarChart3, roles: ["SUPER_ADMIN", "MANAGER"] },
      { label: "Utilisateurs", href: "/admin/utilisateurs", icon: UserCog, roles: ["SUPER_ADMIN"] },
      { label: "Paramètres", href: "/admin/parametres", icon: Settings, roles: ["SUPER_ADMIN", "MANAGER"] },
      { label: "Logs", href: "/admin/logs", icon: ScrollText, roles: ["SUPER_ADMIN"] },
    ],
  },
];

/** Tous les items à plat (pour le filtrage par rôle et le contrôle d'accès). */
export const allNavItems = navGroups.flatMap((g) => g.items);

/** Un rôle peut-il voir cet item ? */
export function canSee(item: NavItem, role: UserRole): boolean {
  return !item.roles || item.roles.includes(role);
}

/**
 * Un rôle a-t-il accès à un chemin /admin/* ?
 * Match sur le préfixe d'item le plus spécifique.
 */
export function canAccessPath(pathname: string, role: UserRole): boolean {
  // Le dashboard racine est accessible à tous les rôles connectés.
  if (pathname === "/admin") return true;
  const match = allNavItems
    .filter((i) => i.href !== "/admin" && pathname.startsWith(i.href))
    .sort((a, b) => b.href.length - a.href.length)[0];
  if (!match) return true; // pages utilitaires non listées (profil, etc.)
  return canSee(match, role);
}

export const roleLabels: Record<UserRole, string> = {
  SUPER_ADMIN: "Super Admin",
  MANAGER: "Gérant",
  KITCHEN: "Cuisine",
  DRIVER: "Livreur",
  SUPPORT: "Support",
};
