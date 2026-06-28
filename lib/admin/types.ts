/**
 * Types du domaine back-office (CRM).
 * Reflètent les modèles Prisma (cf. prisma/schema.prisma) sous une forme
 * adaptée à l'affichage. La couche data/admin/* fournit des données mockées
 * déterministes ; en production, ces mêmes types seront renvoyés par Prisma.
 */

export type UserRole = "SUPER_ADMIN" | "MANAGER" | "KITCHEN" | "DRIVER" | "SUPPORT";

export type OrderStatus =
  | "NEW"
  | "CONFIRMED"
  | "PREPARING"
  | "READY"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "PICKED_UP"
  | "CANCELLED"
  | "REFUNDED";

export type OrderChannel = "DELIVERY" | "PICKUP" | "DINE_IN" | "QR_TABLE";
export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED" | "PARTIALLY_REFUNDED";
export type PaymentMethod = "CARD_ONLINE" | "CARD_ON_SITE" | "CASH" | "MEAL_VOUCHER";
export type ReservationStatus = "PENDING" | "CONFIRMED" | "ARRIVED" | "CANCELLED" | "NO_SHOW";
export type DeliveryStatus = "UNASSIGNED" | "ASSIGNED" | "EN_ROUTE" | "DELIVERED" | "ISSUE" | "CANCELLED";
export type ProductType = "PIZZA" | "DRINK" | "DESSERT" | "SIDE" | "SAUCE";
export type ReviewStatus = "PENDING" | "PUBLISHED" | "HIDDEN" | "FLAGGED";
export type StockStatus = "OK" | "LOW" | "OUT";
export type PromoType = "PERCENTAGE" | "FIXED_AMOUNT" | "FREE_DELIVERY" | "FREE_PRODUCT" | "SPECIAL_MENU";
export type CampaignChannel = "EMAIL" | "SMS";
export type CampaignStatus = "DRAFT" | "SCHEDULED" | "SENDING" | "SENT" | "CANCELLED";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  active: boolean;
  lastLoginAt: string | null;
  createdAt: string;
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  tags: string[];
  ordersCount: number;
  totalSpent: number;
  avgBasket: number;
  lastOrderAt: string | null;
  createdAt: string;
  allergies?: string;
  marketingOptIn: boolean;
  smsOptIn: boolean;
  loyaltyPoints: number;
}

export interface OrderItem {
  name: string;
  quantity: number;
  unitPrice: number;
  options?: string[];
}

export interface Order {
  id: string;
  number: string;
  channel: OrderChannel;
  status: OrderStatus;
  customerName: string;
  customerPhone: string;
  address?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  customerNote?: string;
  allergyNote?: string;
  internalNote?: string;
  createdAt: string;
  prepMinutes: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  type: ProductType;
  category: string;
  price: number;
  promoPrice?: number;
  image?: string;
  badges: string[];
  available: boolean;
  visible: boolean;
  featured: boolean;
  prepMinutes: number;
  soldCount: number;
}

export interface Reservation {
  id: string;
  name: string;
  phone: string;
  email?: string;
  date: string;
  partySize: number;
  status: ReservationStatus;
  note?: string;
}

export interface PromoCode {
  id: string;
  code: string;
  description: string;
  type: PromoType;
  value: number;
  minOrder: number;
  usedCount: number;
  maxUses: number | null;
  endsAt: string | null;
  active: boolean;
}

export interface Review {
  id: string;
  authorName: string;
  rating: number;
  comment: string;
  productName?: string;
  status: ReviewStatus;
  reply?: string;
  createdAt: string;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  available: boolean;
  activeDeliveries: number;
  totalDeliveries: number;
}

export interface DeliveryZone {
  id: string;
  name: string;
  postalCodes: string[];
  fee: number;
  minOrder: number;
  etaMinutes: number;
  active: boolean;
}

export interface StockItem {
  id: string;
  name: string;
  unit: string;
  quantity: number;
  threshold: number;
  status: StockStatus;
}

export interface Campaign {
  id: string;
  name: string;
  channel: CampaignChannel;
  status: CampaignStatus;
  segment: string;
  recipients: number;
  openRate: number | null;
  clickRate: number | null;
  sentAt: string | null;
}

export interface NotificationItem {
  id: string;
  type: "NEW_ORDER" | "PAYMENT_RECEIVED" | "NEW_RESERVATION" | "LOW_STOCK" | "NEW_REVIEW" | "DELIVERY_LATE";
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  userName: string;
  action: string;
  entity: string;
  detail: string;
  createdAt: string;
}

export interface MediaFile {
  id: string;
  url: string;
  name: string;
  folder: string;
}
