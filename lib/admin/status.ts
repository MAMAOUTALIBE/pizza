/**
 * Libellés FR + styles (couleurs) des différents statuts du back-office.
 * Centralisé pour une cohérence visuelle sur tous les modules.
 */

type StatusStyle = { label: string; className: string };

const tone = {
  blue: "bg-blue-100 text-blue-700",
  amber: "bg-amber-100 text-amber-700",
  orange: "bg-orange-100 text-orange-700",
  purple: "bg-purple-100 text-purple-700",
  green: "bg-emerald-100 text-emerald-700",
  red: "bg-red-100 text-red-700",
  slate: "bg-slate-200 text-slate-600",
  teal: "bg-teal-100 text-teal-700",
};

export const orderStatusStyles: Record<string, StatusStyle> = {
  NEW: { label: "Nouvelle", className: tone.blue },
  CONFIRMED: { label: "Confirmée", className: tone.teal },
  PREPARING: { label: "En préparation", className: tone.amber },
  READY: { label: "Prête", className: tone.purple },
  OUT_FOR_DELIVERY: { label: "En livraison", className: tone.orange },
  DELIVERED: { label: "Livrée", className: tone.green },
  PICKED_UP: { label: "Récupérée", className: tone.green },
  CANCELLED: { label: "Annulée", className: tone.red },
  REFUNDED: { label: "Remboursée", className: tone.slate },
};

export const paymentStatusStyles: Record<string, StatusStyle> = {
  PAID: { label: "Payé", className: tone.green },
  PENDING: { label: "En attente", className: tone.amber },
  FAILED: { label: "Échoué", className: tone.red },
  REFUNDED: { label: "Remboursé", className: tone.slate },
  PARTIALLY_REFUNDED: { label: "Remb. partiel", className: tone.slate },
};

export const paymentMethodLabels: Record<string, string> = {
  CARD_ONLINE: "CB en ligne",
  CARD_ON_SITE: "CB sur place",
  CASH: "Espèces",
  MEAL_VOUCHER: "Titre-resto",
};

export const channelStyles: Record<string, StatusStyle> = {
  DELIVERY: { label: "Livraison", className: tone.orange },
  PICKUP: { label: "À emporter", className: tone.teal },
  DINE_IN: { label: "Sur place", className: tone.purple },
  QR_TABLE: { label: "QR à table", className: tone.blue },
};

export const reservationStatusStyles: Record<string, StatusStyle> = {
  PENDING: { label: "En attente", className: tone.amber },
  CONFIRMED: { label: "Confirmée", className: tone.green },
  ARRIVED: { label: "Arrivée", className: tone.teal },
  CANCELLED: { label: "Annulée", className: tone.red },
  NO_SHOW: { label: "No-show", className: tone.slate },
};

export const deliveryStatusStyles: Record<string, StatusStyle> = {
  UNASSIGNED: { label: "À assigner", className: tone.slate },
  ASSIGNED: { label: "Assignée", className: tone.blue },
  EN_ROUTE: { label: "En route", className: tone.orange },
  DELIVERED: { label: "Livrée", className: tone.green },
  ISSUE: { label: "Problème", className: tone.red },
  CANCELLED: { label: "Annulée", className: tone.red },
};

export const reviewStatusStyles: Record<string, StatusStyle> = {
  PENDING: { label: "À modérer", className: tone.amber },
  PUBLISHED: { label: "Publié", className: tone.green },
  HIDDEN: { label: "Masqué", className: tone.slate },
  FLAGGED: { label: "Signalé", className: tone.red },
};

export const stockStatusStyles: Record<string, StatusStyle> = {
  OK: { label: "En stock", className: tone.green },
  LOW: { label: "Stock bas", className: tone.amber },
  OUT: { label: "Rupture", className: tone.red },
};

export const campaignStatusStyles: Record<string, StatusStyle> = {
  DRAFT: { label: "Brouillon", className: tone.slate },
  SCHEDULED: { label: "Programmée", className: tone.blue },
  SENDING: { label: "En envoi", className: tone.amber },
  SENT: { label: "Envoyée", className: tone.green },
  CANCELLED: { label: "Annulée", className: tone.red },
};
