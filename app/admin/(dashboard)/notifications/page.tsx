import { ShoppingBag, CalendarCheck, AlertTriangle, Star, CreditCard, Clock } from "lucide-react";
import { PageHeader, Card } from "@/components/admin/ui/kit";
import { notifications } from "@/data/admin/mock";
import { formatRelative } from "@/lib/admin/format";
import { cn } from "@/lib/utils";

const icons = {
  NEW_ORDER: { Icon: ShoppingBag, color: "bg-blue-50 text-blue-600" },
  PAYMENT_RECEIVED: { Icon: CreditCard, color: "bg-emerald-50 text-emerald-600" },
  NEW_RESERVATION: { Icon: CalendarCheck, color: "bg-purple-50 text-purple-600" },
  LOW_STOCK: { Icon: AlertTriangle, color: "bg-amber-50 text-amber-600" },
  NEW_REVIEW: { Icon: Star, color: "bg-terracotta-50 text-terracotta-600" },
  DELIVERY_LATE: { Icon: Clock, color: "bg-red-50 text-red-600" },
} as const;

export default function NotificationsPage() {
  return (
    <>
      <PageHeader
        title="Notifications"
        description="Tous les événements importants du restaurant en temps réel."
      />
      <Card padded={false}>
        <ul className="divide-y divide-slate-100">
          {notifications.map((n) => {
            const { Icon, color } = icons[n.type];
            return (
              <li key={n.id} className={cn("flex items-start gap-4 p-4", !n.read && "bg-terracotta-50/30")}>
                <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", color)}>
                  <Icon className="h-5 w-5" />
                </span>
                <div className="flex-1">
                  <p className="font-medium text-slate-900">{n.title}</p>
                  <p className="text-sm text-slate-500">{n.body}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="whitespace-nowrap text-xs text-slate-400">{formatRelative(n.createdAt)}</span>
                  {!n.read && <span className="h-2 w-2 rounded-full bg-terracotta-500" aria-label="Non lue" />}
                </div>
              </li>
            );
          })}
        </ul>
      </Card>
    </>
  );
}
