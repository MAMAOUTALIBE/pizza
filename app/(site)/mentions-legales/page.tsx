import type { Metadata } from "next";
import { site } from "@/data/site";
import { LegalArticle } from "@/components/ui/LegalArticle";

export const metadata: Metadata = {
  title: "Mentions légales",
  robots: { index: false, follow: true },
};

/** Mentions légales (gabarit à compléter par le restaurant). */
export default function MentionsLegalesPage() {
  return (
    <LegalArticle title="Mentions légales" updatedAt="1er janvier 2026">
      <h2>Éditeur du site</h2>
      <p>
        {site.fullName} — {site.address.full}. Téléphone : {site.phone}. Email :{" "}
        {site.email}. SIRET : 000 000 000 00000. (Gabarit à compléter avec les
        informations réelles de l&apos;entreprise.)
      </p>

      <h2>Directeur de la publication</h2>
      <p>Le représentant légal de {site.fullName}.</p>

      <h2>Hébergement</h2>
      <p>
        Ce site est hébergé par un prestataire d&apos;hébergement web. Coordonnées
        de l&apos;hébergeur à compléter.
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        L&apos;ensemble des contenus présents sur ce site (textes, images, logo,
        charte graphique) est la propriété de {site.fullName}, sauf mention
        contraire, et ne peut être reproduit sans autorisation préalable.
      </p>

      <h2>Crédits visuels</h2>
      <p>
        Les visuels actuels sont des placeholders à remplacer par les
        photographies officielles du restaurant.
      </p>
    </LegalArticle>
  );
}
