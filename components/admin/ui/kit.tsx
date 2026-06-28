import type { ReactNode } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, ArrowDownRight, Construction } from "lucide-react";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/* Panneau / carte                                                            */
/* -------------------------------------------------------------------------- */
export function Card({
  children,
  className,
  padded = true,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200 bg-white shadow-sm",
        padded && "p-5",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  action,
  className,
}: {
  title: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-4 flex items-center justify-between gap-3", className)}>
      <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
      {action}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Carte de KPI                                                               */
/* -------------------------------------------------------------------------- */
export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  hint,
  accent = "terracotta",
}: {
  label: string;
  value: ReactNode;
  icon: LucideIcon;
  trend?: number;
  hint?: string;
  accent?: "terracotta" | "green" | "blue" | "amber" | "purple" | "red";
}) {
  const accents: Record<string, string> = {
    terracotta: "bg-terracotta-50 text-terracotta-600",
    green: "bg-emerald-50 text-emerald-600",
    blue: "bg-blue-50 text-blue-600",
    amber: "bg-amber-50 text-amber-600",
    purple: "bg-purple-50 text-purple-600",
    red: "bg-red-50 text-red-600",
  };
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <span className={cn("flex h-10 w-10 items-center justify-center rounded-xl", accents[accent])}>
          <Icon className="h-5 w-5" aria-hidden />
        </span>
        {typeof trend === "number" && (
          <span
            className={cn(
              "flex items-center gap-0.5 text-xs font-semibold",
              trend >= 0 ? "text-emerald-600" : "text-red-600",
            )}
          >
            {trend >= 0 ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        <p className="text-sm text-slate-500">{label}</p>
        {hint && <p className="mt-0.5 text-xs text-slate-400">{hint}</p>}
      </div>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/* Pastille de statut                                                         */
/* -------------------------------------------------------------------------- */
export function StatusPill({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium",
        className,
      )}
    >
      {label}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* En-tête de page de module                                                  */
/* -------------------------------------------------------------------------- */
export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Bouton admin                                                               */
/* -------------------------------------------------------------------------- */
export function AdminButton({
  children,
  variant = "primary",
  className,
  href,
  ...props
}: {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  href?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const variants = {
    primary: "bg-terracotta-500 text-white hover:bg-terracotta-600",
    secondary: "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
    ghost: "text-slate-600 hover:bg-slate-100",
  };
  const cls = cn(
    "inline-flex items-center justify-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors",
    variants[variant],
    className,
  );
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button className={cls} {...props}>
      {children}
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/* Tableau                                                                    */
/* -------------------------------------------------------------------------- */
export function Table({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  );
}

export function Th({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <th
      className={cn(
        "whitespace-nowrap border-b border-slate-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500",
        className,
      )}
    >
      {children}
    </th>
  );
}

export function Td({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <td className={cn("border-b border-slate-100 px-4 py-3 text-slate-700", className)}>
      {children}
    </td>
  );
}

/* -------------------------------------------------------------------------- */
/* État vide                                                                  */
/* -------------------------------------------------------------------------- */
export function EmptyState({ message }: { message: string }) {
  return (
    <div className="py-12 text-center text-sm text-slate-400">{message}</div>
  );
}

/* -------------------------------------------------------------------------- */
/* Placeholder de module (scaffold)                                           */
/* -------------------------------------------------------------------------- */
export function ModulePlaceholder({
  title,
  description,
  features,
}: {
  title: string;
  description: string;
  features: string[];
}) {
  return (
    <>
      <PageHeader title={title} description={description} />
      <Card className="border-dashed">
        <div className="flex flex-col items-start gap-4 sm:flex-row">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <Construction className="h-6 w-6" aria-hidden />
          </span>
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Module structuré — prêt à brancher
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-slate-500">
              L&apos;ossature, la navigation et le contrôle d&apos;accès de ce
              module sont en place. Voici les fonctionnalités prévues, à connecter
              à l&apos;API Prisma&nbsp;:
            </p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-terracotta-400" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>
    </>
  );
}
