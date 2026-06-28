"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Pizza, ShoppingBag } from "lucide-react";
import { mainNav } from "@/data/site";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/Logo";
import { CTAButton } from "@/components/ui/CTAButton";
import { MobileMenu } from "@/components/MobileMenu";
import { useCart } from "@/components/cart/CartProvider";

/**
 * Header premium semi-fixe : translucide sur le haut de page, devient opaque
 * avec ombre au scroll. Navigation desktop centrée + CTA, drawer en mobile.
 */
export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { totalItems, openCart } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-charcoal-900/95 shadow-lg backdrop-blur-md"
            : "bg-gradient-to-b from-charcoal-950/80 to-transparent",
        )}
      >
        <div className="container-page flex h-20 items-center justify-between gap-4">
          <Logo tone="dark" />

          {/* Navigation desktop */}
          <nav
            aria-label="Navigation principale"
            className="hidden items-center gap-7 lg:flex"
          >
            {mainNav.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  data-active={active}
                  className={cn(
                    "nav-link",
                    active ? "text-terracotta-400" : "text-cream-100 hover:text-cream-50",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <CTAButton href="/commander" size="sm" className="hidden sm:inline-flex">
              <Pizza className="h-4 w-4" aria-hidden />
              Commander en ligne
              {totalItems > 0 && (
                <span className="ml-1 rounded-full bg-white px-2 py-0.5 text-[0.65rem] font-bold text-terracotta-600">
                  {totalItems}
                </span>
              )}
            </CTAButton>

            {/* Panier (mobile) — ouvre le drawer */}
            <button
              type="button"
              onClick={openCart}
              aria-label={`Panier (${totalItems} article${totalItems > 1 ? "s" : ""})`}
              className="relative flex h-11 w-11 items-center justify-center rounded-full text-cream-50 transition-colors hover:bg-cream-50/10 active:scale-95 lg:hidden"
            >
              <ShoppingBag className="h-6 w-6" aria-hidden />
              {totalItems > 0 && (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-tomato-600 px-1 text-[0.6rem] font-bold text-white">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Bouton burger (mobile) */}
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Ouvrir le menu"
              className="flex h-11 w-11 items-center justify-center rounded-full text-cream-50 transition-colors hover:bg-cream-50/10 active:scale-95 lg:hidden"
            >
              <Menu className="h-6 w-6" aria-hidden />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        pathname={pathname}
        cartCount={totalItems}
      />
    </>
  );
}
