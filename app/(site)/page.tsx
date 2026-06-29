import { HeroSection } from "@/sections/HeroSection";
import { PizzasSection } from "@/sections/PizzasSection";
import { QualitySection } from "@/sections/QualitySection";
import { PromoSection } from "@/sections/PromoSection";
import { TestimonialsSection } from "@/sections/TestimonialsSection";

/** Page d'accueil — assemblage des sections vitrine. */
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <PizzasSection />
      {/* Sections « storytelling » réservées au desktop pour garder le mobile compact */}
      <div className="hidden lg:block">
        <QualitySection />
      </div>
      <PromoSection />
      <div className="hidden lg:block">
        <TestimonialsSection />
      </div>
    </>
  );
}
