import { useState, useRef, useEffect } from "react";
import { Shield, ChevronDown, BookOpen, Zap, Library, Target, Megaphone, Twitter, Clock, BarChart2, FileText, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const TOOLS = [
  { to: "/dashboard",    icon: Twitter,    label: "Dashboard",            desc: "Your command center" },
  { to: "/composer",     icon: FileText,   label: "Tweet Composer",       desc: "Write, check & schedule" },
  { to: "/feed-analyzer",icon: BarChart2,  label: "Feed Analyzer",        desc: "AI feed audit & timing" },
  { to: "/templates",    icon: BookOpen,   label: "Template Library",     desc: "Best tweet formats" },
  { to: "/hooks",        icon: Zap,        label: "Hook Library",         desc: "Trending AI hooks" },
  { to: "/library",      icon: Library,    label: "Content Library",      desc: "Your saved content" },
  { to: "/brand",        icon: Target,     label: "Brand Analyzer",       desc: "AI brand strategy" },
  { to: "/marketing",    icon: Megaphone,  label: "Marketing Consultant", desc: "AI campaign builder" },
  { to: "/growth-guide", icon: TrendingUp, label: "Growth Guide",         desc: "2026 X growth tips" },
  { to: "/scheduled",    icon: Clock,      label: "Scheduled Queue",      desc: "Manage your queue" },
];

export default function Navbar({ isPro, onLicenseClick }) {
  const [toolsOpen, setToolsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setToolsOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-xblue" />
          <span className="font-black text-white text-lg">X Post Guardian Pro</span>
          {isPro && <span className="text-xs font-bold bg-xblue text-black px-2 py-0.5 rounded-full ml-1">PRO</span>}
        </Link>

        <div className="flex items-center gap-4">
          {/* Analyzer link */}
          <button
            onClick={() => document.getElementById("analyzer")?.scrollIntoView({ behavior: "smooth" })}
            className="text-muted-foreground hover:text-white text-sm font-medium transition-colors hidden md:block">
            Analyzer
          </button>

          {/* Tools dropdown */}
          <div ref={ref} className="relative hidden md:block">
            <button
              onClick={() => setToolsOpen(v => !v)}
              className="flex items-center gap-1 text-muted-foreground hover:text-white text-sm font-medium transition-colors"
            >
              Tools <ChevronDown className={`w-3.5 h-3.5 transition-transform ${toolsOpen ? "rotate-180" : ""}`} />
            </button>

            {toolsOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden z-50">
                <div className="p-2 space-y-0.5">
                  {TOOLS.map(tool => {
                    const Icon = tool.icon;
                    return (
                      <Link
                        key={tool.to}
                        to={tool.to}
                        onClick={() => setToolsOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-xblue/10 flex items-center justify-center flex-shrink-0 group-hover:bg-xblue/20 transition-colors">
                          <Icon className="w-4 h-4 text-xblue" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{tool.label}</p>
                          <p className="text-xs text-muted-foreground">{tool.desc}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Pricing */}
          <button
            onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
            className="text-muted-foreground hover:text-white text-sm font-medium transition-colors hidden md:block">
            Pricing
          </button>

          {/* CTA */}
          {!isPro ? (
            <button
              onClick={onLicenseClick}
              className="bg-xblue text-black text-sm font-bold px-5 py-2 rounded-full hover:bg-xblue/90 transition-all">
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