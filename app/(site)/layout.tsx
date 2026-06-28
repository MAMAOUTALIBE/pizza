import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BottomNav } from "@/components/BottomNav";
import { CartProvider } from "@/components/cart/CartProvider";
import { CartDrawer } from "@/components/cart/CartDrawer";

/**
 * Layout du site public : header fixe + contenu + footer.
 * Sur mobile/tablette : barre d'action basse (BottomNav) + panier en drawer.
 * (Le back-office /admin possède son propre layout, sans ce header.)
 */
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      {/* Dégagement bas sur mobile pour la barre d'action fixe */}
      <div className="flex min-h-screen flex-col bg-cream-100 pb-[calc(4rem_+_env(safe-area-inset-bottom))] lg:pb-0">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>

      <CartDrawer />
      <BottomNav />
    </CartProvider>
  );
}
