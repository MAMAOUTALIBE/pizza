import { getPrisma, isPersistenceEnabled } from "@/lib/db";
import { products as mockProducts } from "@/data/admin/mock";
import type { Product, ProductType } from "@/lib/admin/types";

/**
 * Source des produits du back-office (même patron que orders-source).
 * `soldCount` est approché par le nombre de lignes de commande liées (_count).
 */
const num = (v: unknown): number => Number(v ?? 0);

type PrismaProductRow = {
  id: string;
  name: string;
  slug: string;
  type: string;
  price: unknown;
  promoPrice: unknown;
  imageUrl: string | null;
  badges: string[];
  available: boolean;
  visible: boolean;
  featured: boolean;
  prepMinutes: number;
  category: { name: string } | null;
  _count: { orderItems: number };
};

function mapProduct(p: PrismaProductRow): Product {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    type: p.type as ProductType,
    category: p.category?.name ?? "—",
    price: num(p.price),
    promoPrice: p.promoPrice != null ? num(p.promoPrice) : undefined,
    image: p.imageUrl ?? undefined,
    badges: p.badges,
    available: p.available,
    visible: p.visible,
    featured: p.featured,
    prepMinutes: p.prepMinutes,
    soldCount: p._count.orderItems,
  };
}

export async function getAdminProducts(): Promise<{ products: Product[]; live: boolean }> {
  if (!isPersistenceEnabled()) return { products: mockProducts, live: false };
  try {
    const rows = await getPrisma().product.findMany({
      include: { category: { select: { name: true } }, _count: { select: { orderItems: true } } },
      orderBy: { position: "asc" },
      take: 500,
    });
    return { products: rows.map((r) => mapProduct(r as unknown as PrismaProductRow)), live: true };
  } catch (error) {
    console.error("Lecture des produits en base échouée — repli sur les mocks", error);
    return { products: mockProducts, live: false };
  }
}
