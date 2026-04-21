import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Zap, RefreshCw, Copy, CheckCircle, TrendingUp, Star, Filter } from "lucide-react";
import { base44 } from "@/api/base44Client";

const CATEGORIES = ["all", "curiosity", "controversy", "value", "story", "social_proof", "fear", "humor", "challenge"];

const catConfig = {
  curiosity:     { color: "text-yellow-400",  bg: "bg-yellow-400/10 border-yellow-400/20",  emoji: "🤔" },
  controversy:   { color: "text-red-400",     bg: "bg-red-400/10 border-red-400/20",        emoji: "🔥" },
  value:         { color: "text-green-400",   bg: "bg-green-400/10 border-green-400/20",    emoji: "💎" },
  story:         { color: "text-purple-400",  bg: "bg-purple-400/10 border-purple-400/20",  emoji: "📖" },
  social_proof:  { color: "text-xblue",       bg: "bg-xblue/10 border-xblue/20",            emoji: "🏆" },
  fear:          { color: "text-orange-400",  bg: "bg-orange-400/10 border-orange-400/20",  emoji: "⚠️" },
  humor:         { color: "text-pink-400",    bg: "bg-pink-400/10 border-pink-400/20",      emoji: "😄" },
  challenge:     { color: "text-cyan-400",    bg: "bg-cyan-400/10 border-cyan-400/20",      emoji: "💪" },
};

function HookCard({ hook, onCopyToLibrary }) {
  const [copied, setCopied] = useState(false);
  const cfg = catConfig[hook.category] ?? catConfig.value;

  function handleCopy() {
    navigator.clipboard.writeText(hook.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="bg-card border border-border rounded-2xl p-4 space-y-3 hover:border-border/80 transition-all"
    >
      <div className="flex items-center justify-between gap-2">
        <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.color}`}>
          {cfg.emoji} {hook.category.replace("_", " ")}
        </span>
        <div className="flex items-center gap-2">
          {hook.is_trending && (
            <span className="flex items-center gap-1 text-xs text-yellow-400 font-bold">
              <TrendingUp className="w-3 h-3" /> Trending
            </span>
          )}
          {hook.engagement_score && (
            <span className="text-xs text-muted-foreground font-semibold flex items-center gap-1">
              <Star className="w-3 h-3 text-xblue" /> {hook.engagement_score}
            </span>
          )}
        </div>
      </div>

      <p className="text-white text-sm leading-relaxed font-medium">"{hook.text}"</p>

      <div className="flex gap-2">
        <button
          onClick={handleCopy}
          className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-white border border-border hover:border-xblue/40 py-2 rounded-full transition-all"
        >
          {copied ? <><CheckCircle className="w-3.5 h-3.5 text-green-400" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
        </button>
        <Link
          to={`/draft?hook=${encodeURIComponent(hook.text)}`}
          className="flex-1 flex items-center justify-center gap-1.5 text-xs font-black text-black bg-xblue hover:bg-xblue/90 py-2 rounded-full transition-all"
        >
          <Zap className="w-3.5 h-3.5" /> Use in Draft
        </Link>
      </div>
    </motion.div>
  );
}

export default function HookLibrary() {
  const [hooks, setHooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [cat, setCat] = useState("all");
  const [lastRefresh, setLastRefresh] = useState(null);

  useEffect(() => { fetchHooks(); }, []);

  async function fetchHooks() {
    setLoading(true);
    const data = await base44.entities.HookItem.list("-engagement_score");
    setHooks(data);
    if (data.length > 0 && data[0].last_refreshed) setLastRefresh(data[0].last_refreshed);
    setLoading(false);
  }

  async function handleRefresh() {
    setRefreshing(true);
    await base44.functions.invoke("refreshHooks", {});
    await fetchHooks();
    setRefreshing(false);
  }

  const filtered = cat === "all" ? hooks : hooks.filter(h => h.category === cat);
  const trending = hooks.filter(h => h.is_trending).length;

  return (
    <div className="min-h-screen bg-background font-inter">
      <div className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-yellow-400" />
            <span className="font-black text-white">Hook Library</span>
            <span className="text-xs bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 px-2 py-0.5 rounded-full font-semibold">{trending} trending</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-white border border-border hover:border-xblue/40 px-3 py-1.5 rounded-full transition-all disabled:opacity-40"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} /> Refresh
            </button>
            <Link to="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" /> Home
            </Link>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-6 py-10 space-y-6">
        <div className="text-center mb-2">
          <h1 className="text-3xl font-black text-white mb-2">Working Hooks for X/Twitter</h1>
          <p className="text-muted-foreground text-sm">AI-curated, rule-compliant hooks updated regularly. Click any hook to use it in your next tweet.</p>
          {lastRefresh && <p className="text-xs text-muted-foreground mt-1">Last refreshed: {lastRefresh}</p>}
        </div>

        {/* Category filter */}
        <div className="flex gap-2 flex-wrap justify-center">
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border capitalize transition-all ${
                cat === c ? "bg-xblue text-black border-xblue" : "border-border text-muted-foreground hover:border-xblue/40 hover:text-white"
              }`}
            >
              {catConfig[c]?.emoji} {c.replace("_", " ")}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-8 h-8 border-4 border-border border-t-yellow-400 rounded-full animate-spin" />
            <p className="text-muted-foreground text-sm">Loading hooks...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <p className="text-muted-foreground text-lg font-semibold">No hooks yet</p>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="bg-yellow-400 text-black font-black px-6 py-2.5 rounded-full hover:bg-yellow-300 transition-all text-sm disabled:opacity-40"
            >
              {refreshing ? "Generating..." : "⚡ Generate Hooks with AI"}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {filtered.map(hook => <HookCard key={hook.id} hook={hook} />)}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
}