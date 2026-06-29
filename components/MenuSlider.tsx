"use client";

import { useRef, useState } from "react";
import { formulas } from "@/data/menus";
import { MenuHighlightCard } from "@/components/MenuHighlightCard";
import { cn } from "@/lib/utils";

/** Slider plein écran des formules (mobile/tablette) — une formule par vue, swipe. */
export function MenuSlider() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const onScroll = () => {
    const el = ref.current;
    if (!el) return;
    setActive(Math.round(el.scrollLeft / el.clientWidth));
  };

  const goTo = (i: number) => {
    const el = ref.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  };

  return (
    <section className="bg-paper py-6 md:hidden">
      <div
        ref={ref}
        onScroll={onScroll}
        className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2"
      >
        {formulas.map((f) => (
          <div key={f.id} className="w-full shrink-0 snap-center">
            <MenuHighlightCard formula={f} />
          </div>
        ))}
      </div>

      {/* Pagination (dots) */}
      <div className="mt-4 flex items-center justify-center gap-2">
        {formulas.map((f, i) => (
          <button
            key={f.id}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Formule ${i + 1}`}
            className={cn(
              "h-2 rounded-full transition-all",
              i === active ? "w-6 bg-terracotta-500" : "w-2 bg-charcoal-900/20",
            )}
          />
        ))}
      </div>
    </section>
  );
}
