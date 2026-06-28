"use client";

import Link from "next/link";
import { useEffect } from "react";
import { X, Phone } from "lucide-react";
import { mainNav, site } from "@/data/site";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/Logo";
import { CTAButton } from "@/components/ui/CTAButton";

/** Drawer de navigation mobile (plein écran, fond sombre). */
export function MobileMenu({
  open,
  onClose,
  pathname,
  cartCount = 0,
}: {
  open: boolean;
  onClose: () => void;
  pathname: string;
  cartCount?: number;
}) {
  // Verrouille le scroll du body et ferme avec Échap quand le menu est ouvert.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-[60] lg:hidden",
        open ? "pointer-events-auto" : "pointer-events-none",
      )}
      aria-hidden={!open}
      inert={!open}
    >
      {/* Voile */}
      <div
        className={cn(
          "absolute inset-0 bg-charcoal-950/70 backdrop-blur-sm transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0",
        )}
        onClick={onClose}
      />

      {/* Panneau */}
      <nav
        aria-label="Navigation mobile"
        className={cn(
          "absolute right-0 top-0 flex h-full w-[82%] max-w-sm flex-col bg-charcoal-900 px-6 pb-8 pt-6 shadow-2xl transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between">
          <Logo tone="dark" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer le menu"
            className="flex h-10 w-10 items-center justify-center rounded-full text-cream-50 transition-colors hover:bg-cream-50/10"
          >
            <X className="h-6 w-6" aria-hidden />
          </button>
        </div>

        <ul className="mt-10 flex flex-col gap-1">
          {mainNav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "block rounded-xl px-4 py-3 text-lg font-medium uppercase tracking-wide transition-colors",
                    active
                      ? "bg-terracotta-500/15 text-terracotta-400"
                      : "text-cream-100 hover:bg-cream-50/5",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-auto space-y-4">
          <CTAButton href="/commander" size="lg" className="w-full" onClick={onClose}>
            Commander en ligne
            {cartCount > 0 && (
              <span className="rounded-full bg-white px-2 py-0.5 text-[0.65rem] font-bold text-terracotta-600">
                {cartCount}
              </span>
            )}
          </CTAButton>
          <a
            href={site.phoneHref}
            className="flex items-center justify-center gap-2 text-sm text-cream-200/80 transition-colors hover:text-cream-50"
          >
            <Phone className="h-4 w-4" aria-hidden />
            {site.phone}
          </a>
        </div>
      </nav>
    </div>
  );
}
