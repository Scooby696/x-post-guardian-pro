import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Sparkles, Copy, CheckCircle, AlertTriangle, XCircle,
  Eye, CalendarPlus, Loader2, Zap, BookOpen, Library, Twitter, RefreshCw, Shield
} from "lucide-react";
import { base44 } from "@/api/base44Client";
import { analyzeDraft } from "@/lib/analyzer";
import { saveScheduledTweet } from "@/lib/scheduler";
import TweetPreviewModal from "@/components/draft/TweetPreviewModal";
import CharacterRing from "@/components/draft/CharacterRing";
import DateTimePicker from "@/components/draft/DateTimePicker";
import LibraryPickerModal from "@/components/draft/LibraryPickerModal";

const X_LIMIT = 280;

export default function Composer() {
  const [profile, setProfile] = useState(null);
  const [text, setText] = useState("");
  const [scheduledAt, setScheduledAt] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiTopic, setAiTopic] = useState("");
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [copied, setCopied] = useState(false);
  const [scheduled, setScheduled] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("xpg_profile");
    if (stored) setProfile(JSON.parse(stored));

    // Pre-fill from URL params (from hook/template libraries)
    const params = new URLSearchParams(window.location.search);
    const hook = params.get("hook");
    const template = params.get("template");
    if (hook) setText(hook);
    if (template) setText(template);
  }, []);

  const remaining = X_LIMIT - text.length;
  const isOver = remaining < 0;
  const isNear = !isOver && remaining <= 20;

  function handleAnalyze() {
    if (!text.trim()) return;
    setAnalysis(analyzeDraft(text));
  }

  async function handleAIWrite() {
    if (!aiTopic.trim()) return;
    setAiLoading(true);
    const brandCtx = profile
      ? `Brand: @${profile.handle}, niche: ${profile.niche}, tone: ${profile.tone}, goals: ${profile.goals || "grow account"}`
      : "";
    const res = await base44.functions.invoke("aiContentWriter", {
      mode: "tweet",
      topic: aiTopic,
      tone: profile?.tone || "engaging",
      brand_context: brandCtx,
    });
    if (res.data?.result?.tweet) setText(res.data.result.tweet);
    setAiLoading(false);
    setShowAiPanel(false);
    setAiTopic("");
  }

  function handleCopy() {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleSchedule() {
    if (!text.trim() || isOver || !scheduledAt) return;
    const dt = new Date(scheduledAt);
    const result = analysis || analyzeDraft(text);
    saveScheduledTweet({
      id: `tweet-${Date.now()}`,
      text,
      score: result.score,
      level: result.level,
      issues: result.issues,
      scheduledFor: dt.toISOString(),
      displayDate: dt.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
      displayTime: dt.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }),
      slotLabel: "Custom",
      isPrime: false,
      status: "scheduled",
      savedAt: new Date().toISOString(),
    });
    setScheduled(true);
    setTimeout(() => setScheduled(false), 2500);
  }

  const scoreColor = !analysis ? "" : analysis.level === "safe" ? "text-green-400" : analysis.level === "warning" ? "text-yellow-400" : "text-red-400";
  const scoreBg = !analysis ? "" : analysis.level === "safe" ? "bg-green-500/10 border-green-500/30" : analysis.level === "warning" ? "bg-yellow-500/10 border-yellow-500/30" : "bg-red-500/10 border-red-500/30";

  return (
    <div className="min-h-screen bg-background font-inter">
      <div className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-2xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Twitter className="w-5 h-5 text-xblue" />
            <span className="font-black text-white">Tweet Composer</span>
            {profile && <span className="text-xs bg-xblue/10 border border-xblue/30 text-xblue px-2 py-0.5 rounded-full">@{profile.handle}</span>}
          </div>
          <Link to="/dashboard" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </Link>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-6 py-8 space-y-5">
        {/* AI Write Panel toggle */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-2xl overflow-hidden">
          <button onClick={() => setShowAiPanel(v => !v)}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-xblue" />
              <span className="font-black text-white text-sm">Write with AI</span>
              <span className="text-xs text-muted-foreground">— generate tweet from a topic</span>
            </div>
            <RefreshCw className={`w-4 h-4 text-muted-foreground transition-transform ${showAiPanel ? "rotate-90" : ""}`} />
          </button>
          <AnimatePresence>
            {showAiPanel && (
              <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                <div className="px-5 pb-5 space-y-3 border-t border-border pt-4">
                  <input
                    value={aiTopic}
                    onChange={e => setAiTopic(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleAIWrite()}
                    placeholder={`e.g. Why ${profile?.niche || "consistency"} is the #1 growth lever in 2026`}
                    className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-muted-foreground focus:outline-none focus:border-xblue/60 transition-colors"
                  />
                  <button onClick={handleAIWrite} disabled={!aiTopic.trim() || aiLoading}
                    className="w-full flex items-center justify-center gap-2 bg-xblue text-black font-black py-2.5 rounded-full hover:bg-xblue/90 disabled:opacity-40 transition-all text-sm">
                    {aiLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Writing...</> : <><Sparkles className="w-4 h-4" /> Generate Tweet</>}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Composer */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-card border border-border rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-black text-white">Compose</h2>
            <div className="flex gap-2">
              <button onClick={() => setLibraryOpen(true)}
                className="flex items-center gap-1 text-xs font-bold text-muted-foreground hover:text-white border border-border hover:border-xblue/40 px-2.5 py-1.5 rounded-full transition-all">
                <Library className="w-3 h-3" /> Library
              </button>
              <Link to="/templates"
                className="flex items-center gap-1 text-xs font-bold text-muted-foreground hover:text-white border border-border hover:border-xblue/40 px-2.5 py-1.5 rounded-full transition-all">
                <BookOpen className="w-3 h-3" /> Templates
              </Link>
              <Link to="/hooks"
                className="flex items-center gap-1 text-xs font-bold text-muted-foreground hover:text-white border border-border hover:border-yellow-400/40 px-2.5 py-1.5 rounded-full transition-all">
                <Zap className="w-3 h-3" /> Hooks
              </Link>
            </div>
          </div>

          <div className="relative">
            <textarea
              value={text}
              onChange={e => { setText(e.target.value); setAnalysis(null); }}
              placeholder="What's happening?..."
              className={`w-full h-40 bg-muted border rounded-xl p-4 text-white placeholder:text-muted-foreground text-base resize-none focus:outline-none transition-colors ${isOver ? "border-red-500/60" : "border-border focus:border-xblue/60"}`}
            />
            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              <span className={`text-sm font-bold tabular-nums ${isOver ? "text-red-400" : isNear ? "text-yellow-400" : "text-muted-foreground"}`}>{remaining}</span>
              <CharacterRing used={text.length} limit={X_LIMIT} />
            </div>
          </div>

          <AnimatePresence>
            {isOver && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
                <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span className="text-sm text-red-300">Exceeds 280-char limit by {Math.abs(remaining)}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick actions row */}
          <div className="flex gap-2 flex-wrap">
            <button onClick={handleAnalyze} disabled={!text.trim()}
              className="flex items-center gap-1.5 text-xs font-bold border border-border hover:border-xblue/40 text-muted-foreground hover:text-white px-3 py-2 rounded-full transition-all disabled:opacity-40">
              <Shield className="w-3.5 h-3.5" /> Check Rules
            </button>
            <button onClick={() => setPreviewOpen(true)} disabled={!text.trim()}
              className="flex items-center gap-1.5 text-xs font-bold border border-border hover:border-xblue/40 text-muted-foreground hover:text-white px-3 py-2 rounded-full transition-all disabled:opacity-40">
              <Eye className="w-3.5 h-3.5" /> Preview
            </button>
            <button onClick={handleCopy} disabled={!text.trim()}
              className="flex items-center gap-1.5 text-xs font-bold border border-border hover:border-green-400/40 text-muted-foreground hover:text-green-400 px-3 py-2 rounded-full transition-all disabled:opacity-40">
              {copied ? <><CheckCircle className="w-3.5 h-3.5 text-green-400" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy to Post</>}
            </button>
          </div>

          {copied && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-green-500/10 border border-green-500/30 rounded-xl p-3 text-center">
              <p className="text-green-400 font-bold text-sm">✅ Copied! Paste it directly into X/Twitter to post.</p>
              <a href="https://twitter.com/compose/tweet" target="_blank" rel="noopener noreferrer"
                className="text-xblue text-xs underline mt-1 block">Open X/Twitter →</a>
            </motion.div>
          )}
        </motion.div>

        {/* Rule check result */}
        <AnimatePresence>
          {analysis && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className={`border rounded-2xl p-4 space-y-3 ${scoreBg}`}>
              <div className="flex items-center gap-3">
                <span className={`text-3xl font-black ${scoreColor}`}>{analysis.score}%</span>
                <div>
                  <p className={`font-bold text-sm ${scoreColor}`}>
                    {analysis.level === "safe" ? "Safe to post!" : analysis.level === "warning" ? "Review before posting" : "High risk — edit needed"}
                  </p>
                  <p className="text-xs text-muted-foreground">{analysis.issues.length} issue{analysis.issues.length !== 1 ? "s" : ""} found</p>
                </div>
              </div>
              {analysis.issues.map((issue, i) => (
                <div key={i} className="flex items-start gap-2 bg-red-500/5 border border-red-500/20 rounded-lg p-2.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-red-300">{issue}</span>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Schedule */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card border border-border rounded-2xl p-5 space-y-4">
          <h2 className="font-black text-white text-sm">Schedule for Later</h2>
          <DateTimePicker value={scheduledAt} onChange={setScheduledAt} />
          <button
            onClick={handleSchedule}
            disabled={!text.trim() || isOver || !scheduledAt || scheduled}
            className="w-full flex items-center justify-center gap-2 bg-xblue text-black font-black py-3 rounded-full hover:bg-xblue/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm"
          >
            {scheduled ? <><CheckCircle className="w-4 h-4" /> Scheduled!</> : <><CalendarPlus className="w-4 h-4" /> Schedule Tweet</>}
          </button>
          {scheduled && (
            <p className="text-center text-xs text-green-400">
              ✅ Saved! <Link to="/scheduled" className="text-xblue underline">View queue →</Link>
            </p>
          )}
        </motion.div>
      </main>

      <TweetPreviewModal open={previewOpen} onClose={() => setPreviewOpen(false)} text={text} />
      <LibraryPickerModal open={libraryOpen} onClose={() => setLibraryOpen(false)} onPick={body => setText(body)} />
    </div>
  );
}