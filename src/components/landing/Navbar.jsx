import { Shield } from "lucide-react";
import { Link } from "react-router-dom";

export default function Navbar({ isPro, onLicenseClick }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-xblue" />
          <span className="font-black text-white text-lg">X Rule Guardian</span>
          {isPro && (
            <span className="text-xs font-bold bg-xblue text-black px-2 py-0.5 rounded-full ml-1">PRO</span>
          )}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => document.getElementById("analyzer")?.scrollIntoView({ behavior: "smooth" })}
            className="text-muted-foreground hover:text-white text-sm font-medium transition-colors hidden sm:block"
          >
            Analyzer
          </button>
          <button
            onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
            className="text-muted-foreground hover:text-white text-sm font-medium transition-colors hidden sm:block"
          >
            Pricing
          </button>
          <Link
            to="/growth-guide"
            className="text-muted-foreground hover:text-white text-sm font-medium transition-colors hidden sm:block"
          >
            Growth Guide
          </Link>
          {!isPro ? (
            <button
              onClick={onLicenseClick}
              className="bg-xblue text-black text-sm font-bold px-5 py-2 rounded-full hover:bg-xblue/90 transition-all"
            >
              Upgrade Pro
            </button>
          ) : (
            <div className="text-green-400 text-sm font-semibold">✅ Pro Active</div>
          )}
        </div>
      </div>
    </nav>
  );
}