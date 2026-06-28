import { getPrisma, isPersistenceEnabled } from "@/lib/db";
import { reviews as mockReviews } from "@/data/admin/mock";
import type { Review, ReviewStatus } from "@/lib/admin/types";

/** Source des avis du back-office (même patron que orders-source). */
type PrismaReviewRow = {
  id: string;
  authorName: string;
  rating: number;
  comment: string | null;
  status: string;
  reply: string | null;
  createdAt: Date;
  product: { name: string } | null;
};

function mapReview(r: PrismaReviewRow): Review {
  return {
    id: r.id,
    authorName: r.authorName,
    rating: r.rating,
    comment: r.comment ?? "",
    productName: r.product?.name ?? undefined,
    status: r.status as ReviewStatus,
    reply: r.reply ?? undefined,
    createdAt: r.createdAt.toISOString(),
  };
}

export async function getAdminReviews(): Promise<{ reviews: Review[]; live: boolean }> {
  if (!isPersistenceEnabled()) return { reviews: mockReviews, live: false };
  try {
    const rows = await getPrisma().review.findMany({
      include: { product: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: 200,
    });
    return { reviews: rows.map((r) => mapReview(r as unknown as PrismaReviewRow)), live: true };
  } catch (error) {
    console.error("Lecture des avis en base échouée — repli sur les mocks", error);
    return { reviews: mockReviews, live: false };
  }
}
