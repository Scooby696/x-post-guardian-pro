import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Analyzer from "@/components/landing/Analyzer";
import Features from "@/components/landing/Features";
import Pricing from "@/components/landing/Pricing";
import LicenseModal from "@/components/landing/LicenseModal";
import Footer from "@/components/landing/Footer";
import { TrendingUp, ArrowRight } from "lucide-react";

const STORAGE_KEY_COUNT = "xrg_analysis_count";
const STORAGE_KEY_DATE = "xrg_analysis_date";
const STORAGE_KEY_PRO = "xrg_is_pro";

function getTodayCount() {
  const today = new Date().toDateString();
  const savedDate = localStorage.getItem(STORAGE_KEY_DATE);
  if (savedDate !== today) {
    localStorage.setItem(STORAGE_KEY_DATE, today);
    localStorage.setItem(STORAGE_KEY_COUNT, "0");
    return 0;
  }
  return parseInt(localStorage.getItem(STORAGE_KEY_COUNT) || "0", 10);
}

export default function Home() {
  const [isPro, setIsPro] = useState(false);
  const [analysisCount, setAnalysisCount] = useState(0);
  const [licenseOpen, setLicenseOpen] = useState(false);

  useEffect(() => {
    setIsPro(localStorage.getItem(STORAGE_KEY_PRO) === "true");
    setAnalysisCount(getTodayCount());
  }, []);

  function handleSetCount(updater) {
    setAnalysisCount(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      localStorage.setItem(STORAGE_KEY_COUNT, String(next));
      return next;
    });
  }

  function handleActivateLicense(key) {
    localStorage.setItem(STORAGE_KEY_PRO, "true");
    setIsPro(true);
  }

  return (
    <div className="min-h-screen bg-background font-inter">
      <Navbar isPro={isPro} onLicenseClick={() => setLicenseOpen(true)} />

      <main className="pt-16">
        <Hero onAnalyzeClick={() => document.getElementById("analyzer")?.scrollIntoView({ behavior: "smooth" })} />
        <Analyzer
          analysisCount={analysisCount}
          setAnalysisCount={handleSetCount}
          isPro={isPro}
        />
        <Features />

        {/* Growth Guide CTA Banner */}
        <section className="py-12 px-6 border-t border-border">
          <div className="max-w-4xl mx-auto">
            <Link to="/growth-guide" className="block group">
              <div className="bg-xblue/5 border border-xblue/30 hover:border-xblue/60 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 transition-all hover:bg-xblue/10">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-xblue/10 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-7 h-7 text-xblue" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-xblue uppercase tracking-wide mb-1">New — AI Powered</div>
                    <h3 className="text-xl font-black text-white">Growth Guide 2026</h3>
                    <p className="text-muted-foreground text-sm mt-1">Prime posting times, community growth tactics, content strategy — all rule-safe. Ask the AI advisor anything.</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xblue font-bold text-sm whitespace-nowrap group-hover:gap-3 transition-all">
                  Explore Guide <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          </div>
        </section>

        <Pricing onUpgradeClick={() => setLicenseOpen(true)} />
      </main>

      <Footer />

      <LicenseModal
        open={licenseOpen}
        onClose={() => setLicenseOpen(false)}
        onActivate={handleActivateLicense}
      />
    </div>
  );
}