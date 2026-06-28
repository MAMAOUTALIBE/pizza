import type { Metadata, Viewport } from "next";
import { Inter, Oswald, Pacifico } from "next/font/google";
import { site } from "@/data/site";
import "./globals.css";

/**
 * Typographies de la marque, injectées en variables CSS :
 * - Pacifico  → script élégant (logo, sur-titres « Le goût »)
 * - Oswald    → titres condensés d'impact (« DE L'ITALIE », « NOS PIZZAS »)
 * - Inter     → corps de texte lisible
 */
const pacifico = Pacifico({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-script",
  display: "swap",
});

const oswald = Oswald({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.fullName} — Le goût de l'Italie`,
    template: `%s · ${site.fullName}`,
  },
  description: site.description,
  keywords: [
    "pizzeria",
    "pizza artisanale",
    "feu de bois",
    "livraison pizza",
    "pizza Paris",
    "restaurant italien",
  ],
  authors: [{ name: site.fullName }],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: site.url,
    siteName: site.fullName,
    title: `${site.fullName} — Le goût de l'Italie`,
    description: site.description,
    images: [{ url: "/images/pizzeria/01_hero_pizza_premium.png", width: 1200, height: 630, alt: site.fullName }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.fullName} — Le goût de l'Italie`,
    description: site.description,
    images: ["/images/pizzeria/01_hero_pizza_premium.png"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#181412",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="fr"
      className={`${pacifico.variable} ${oswald.variable} ${inter.variable}`}
      data-scroll-behavior="smooth"
    >
      <body>{children}</body>
    </html>
  );
}
