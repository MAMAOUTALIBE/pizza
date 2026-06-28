/** Petits utilitaires partagés (UI & formatage). */

/**
 * Concatène des classes conditionnelles sans dépendance externe.
 * Usage : cn("base", isActive && "active", undefined)
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/** Formate un prix en euros au format français (ex. 12,90 €). */
export function formatPrice(value: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(value);
}
