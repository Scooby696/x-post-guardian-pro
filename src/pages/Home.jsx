import { useState, useEffect } from "react";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Analyzer from "@/components/landing/Analyzer";
import Features from "@/components/landing/Features";
import Pricing from "@/components/landing/Pricing";
import LicenseModal from "@/components/landing/LicenseModal";
import Footer from "@/components/landing/Footer";

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