import type { ReactNode } from "react";
import { PageHero } from "@/components/ui/PageHero";

/**
 * Mise en page des pages de contenu légal/éditorial (texte long lisible).
 * Styles de prose appliqués localement (pas de plugin typography requis).
 */
export function LegalArticle({
  title,
  updatedAt,
  children,
}: {
  title: string;
  updatedAt?: string;
  children: ReactNode;
}) {
  return (
    <>
      <PageHero eyebrow="Informations" title={title} />
      <section className="bg-paper py-16 lg:py-20">
        <div className="container-page max-w-3xl">
          {updatedAt && (
            <p className="mb-8 text-sm text-charcoal-800/55">
              Dernière mise à jour : {updatedAt}
            </p>
          )}
          <div className="space-y-6 text-charcoal-800/80 [&_a]:text-terracotta-600 [&_a:hover]:underline [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-charcoal-900 [&_p]:leading-relaxed">
            {children}
          </div>
        </div>
      </section>
    </>
  );
}
