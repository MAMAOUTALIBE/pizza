import { Quote } from "lucide-react";
import { testimonials, averageRating } from "@/data/testimonials";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Rating } from "@/components/ui/Rating";
import { Reveal } from "@/components/ui/Reveal";

/** Section avis clients (preuve sociale). */
export function TestimonialsSection() {
  return (
    <section className="bg-paper py-20 lg:py-24">
      <div className="container-page">
        <SectionTitle
          eyebrow="Ils nous font confiance"
          title="Avis de nos clients"
          subtitle={`Une note moyenne de ${averageRating.toLocaleString("fr-FR")}/5 sur l'ensemble de nos avis.`}
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((t, i) => (
            <Reveal
              key={t.id}
              delay={i * 70}
              className="flex h-full flex-col rounded-2xl bg-white p-6 shadow-card"
            >
              <Quote className="h-7 w-7 text-terracotta-500/30" aria-hidden />
              <p className="mt-3 flex-1 text-sm leading-relaxed text-charcoal-800/80">
                “{t.comment}”
              </p>
              <div className="mt-4 border-t border-cream-200 pt-4">
                <Rating value={t.rating} />
                <p className="mt-2 text-sm font-semibold text-charcoal-900">
                  {t.name}
                </p>
                {t.location && (
                  <p className="text-xs text-charcoal-800/55">{t.location}</p>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
