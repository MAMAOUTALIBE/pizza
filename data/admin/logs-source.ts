import { getPrisma, isPersistenceEnabled } from "@/lib/db";
import { activityLogs as mockLogs } from "@/data/admin/mock";
import type { ActivityLog } from "@/lib/admin/types";

/** Source du journal d'activité (même patron que orders-source). */
type PrismaLogRow = {
  id: string;
  action: string;
  entity: string | null;
  entityId: string | null;
  meta: unknown;
  createdAt: Date;
  user: { name: string } | null;
};

function detailFrom(meta: unknown, entityId: string | null): string {
  const m = (meta ?? {}) as Record<string, unknown>;
  if (m.number) return `${m.number}${m.status ? ` → ${m.status}` : ""}`;
  if (typeof m.detail === "string") return m.detail;
  return entityId ?? "—";
}

function mapLog(r: PrismaLogRow): ActivityLog {
  const m = (r.meta ?? {}) as Record<string, unknown>;
  return {
    id: r.id,
    userName: r.user?.name ?? (typeof m.byName === "string" ? m.byName : "Système"),
    action: r.action,
    entity: r.entity ?? "—",
    detail: detailFrom(r.meta, r.entityId),
    createdAt: r.createdAt.toISOString(),
  };
}

export async function getAdminActivityLogs(): Promise<{ logs: ActivityLog[]; live: boolean }> {
  if (!isPersistenceEnabled()) return { logs: mockLogs, live: false };
  try {
    const rows = await getPrisma().activityLog.findMany({
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: 200,
    });
    return { logs: rows.map((r) => mapLog(r as unknown as PrismaLogRow)), live: true };
  } catch (error) {
    console.error("Lecture du journal en base échouée — repli sur les mocks", error);
    return { logs: mockLogs, live: false };
  }
}
