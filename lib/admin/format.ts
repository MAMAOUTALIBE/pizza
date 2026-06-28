import { NOW } from "@/data/admin/mock";
import { formatPrice } from "@/lib/utils";

/**
 * Formatage des dates/montants du back-office.
 * Les durées relatives sont calculées par rapport à NOW (date de démo figée)
 * pour rester déterministes entre serveur et client.
 */

export const formatMoney = formatPrice;

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDateTime(iso: string): string {
  return `${formatDate(iso)} · ${formatTime(iso)}`;
}

/** Durée relative courte : « à l'instant », « il y a 5 min », « il y a 2 h », « il y a 3 j ». */
export function formatRelative(iso: string): string {
  const diffMs = NOW.getTime() - new Date(iso).getTime();
  const min = Math.round(diffMs / 60000);
  if (min < 1) return "à l'instant";
  if (min < 60) return `il y a ${min} min`;
  const hours = Math.round(min / 60);
  if (hours < 24) return `il y a ${hours} h`;
  const days = Math.round(hours / 24);
  if (days < 30) return `il y a ${days} j`;
  return formatDate(iso);
}

/** Nombre compact en français (1 234 → « 1 234 »). */
export function formatNumber(n: number): string {
  return new Intl.NumberFormat("fr-FR").format(n);
}
