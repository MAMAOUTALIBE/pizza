import type { Metadata } from "next";
import { site } from "@/data/site";
import { LegalArticle } from "@/components/ui/LegalArticle";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  robots: { index: false, follow: true },
};

/** Politique de confidentialité (gabarit RGPD à compléter). */
export default function ConfidentialitePage() {
  return (
    <LegalArticle title="Politique de confidentialité" updatedAt="1er janvier 2026">
      <p>
        {site.fullName} accorde une grande importance à la protection de vos
        données personnelles. Cette politique décrit quelles données nous
        collectons et comment nous les utilisons.
      </p>

      <h2>Données collectées</h2>
      <p>
        Lors d&apos;une commande, d&apos;une réservation ou via le formulaire de
        contact, nous pouvons collecter votre nom, adresse, email, numéro de
        téléphone et l&apos;historique de vos commandes.
      </p>

      <h2>Utilisation des données</h2>
      <p>
        Vos données servent uniquement à traiter vos commandes et réservations,
        à vous contacter et, avec votre consentement, à vous adresser des offres
        commerciales.
      </p>

      <h2>Conservation</h2>
      <p>
        Vos données sont conservées le temps nécessaire au traitement de votre
        demande et conformément aux obligations légales en vigueur.
      </p>

      <h2>Vos droits</h2>
      <p>
        Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de
        rectification, de suppression et de portabilité de vos données. Pour
        l&apos;exercer, écrivez-nous à {site.email}.
      </p>

      <h2>Cookies</h2>
      <p>
        Ce site peut utiliser des cookies de mesure d&apos;audience et de
        fonctionnement. Vous pouvez les désactiver depuis les paramètres de votre
        navigateur.
      </p>
    </LegalArticle>
  );
}
