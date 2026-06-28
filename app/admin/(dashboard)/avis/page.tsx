import { Star } from "lucide-react";
import { PageHeader, StatCard } from "@/components/admin/ui/kit";
import { ReviewsModeration } from "@/components/admin/modules/ReviewsModeration";
import { getAdminReviews } from "@/data/admin/reviews-source";
import { DataSourceBadge } from "@/components/admin/ui/DataSourceBadge";

export default async function AvisPage() {
  const { reviews, live } = await getAdminReviews();
  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  const pending = reviews.filter((r) => r.status === "PENDING").length;

  return (
    <>
      <PageHeader
        title="Avis clients"
        description="Modérez, publiez et répondez aux avis laissés par vos clients."
        actions={<DataSourceBadge live={live} />}
      />
      <div className="mb-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Note moyenne" value={`${avg.toFixed(1)}/5`} icon={Star} accent="amber" />
        <StatCard label="Total avis" value={reviews.length} icon={Star} accent="terracotta" />
        <StatCard label="À modérer" value={pending} icon={Star} accent="blue" />
      </div>
      <ReviewsModeration reviews={reviews} />
    </>
  );
}
