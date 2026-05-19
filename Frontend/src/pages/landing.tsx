import { AnalysisPreviewSection } from "@/components/landing/analysis-preview";
import { FAQSection } from "@/components/landing/faq";
import { FeaturesSection } from "@/components/landing/features";
import { FinalCTASection } from "@/components/landing/final-cta";
import { LandingFooter } from "@/components/landing/footer";
import { HeroSection } from "@/components/landing/hero";
import { HowItWorksSection } from "@/components/landing/how-it-works";
import { MultilingualSection } from "@/components/landing/multilingual";
import { LandingNavbar } from "@/components/landing/navbar";
import { SecuritySection } from "@/components/landing/security";
import { TestimonialsSection } from "@/components/landing/testimonials";
import { TrustSection } from "@/components/landing/trust";

export default function LandingPage() {
  return (
    <div className="min-h-screen scroll-smooth bg-white text-slate-950 dark:bg-slate-950 dark:text-white">
      <LandingNavbar />
      <main>
        <HeroSection />
        <TrustSection />
        <FeaturesSection />
        <HowItWorksSection />
        <AnalysisPreviewSection />
        <MultilingualSection />
        <SecuritySection />
        <TestimonialsSection />
        <FAQSection />
        <FinalCTASection />
      </main>
      <LandingFooter />
    </div>
  );
}
