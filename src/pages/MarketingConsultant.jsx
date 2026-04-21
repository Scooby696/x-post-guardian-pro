import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Sparkles, Loader2, Copy, CheckCircle, Shield, BarChart2, Megaphone, Zap, MessageSquare, Calendar } from "lucide-react";
import { base44 } from "@/api/base44Client";

const MODES = [
  { key: "tweet",     label: "Single Tweet",     icon: MessageSquare, desc: "AI-crafted tweet using your hook + template" },
  { key: "thread",    label: "Thread",            icon: Zap,           desc: "Full multi-tweet thread on any topic" },
  { key: "marketing", label: "Full Campaign",     icon: Megaphone,     desc: "Complete marketing content plan" },
];

const TONES = ["engaging", "professional", "bold", "educational", "inspirational", "casual", "humorous"];

function CopyableBlock({ label, content, color = "text-xblue" }) {
  const [copied, setCopied] = useState(false);
  const text = Array.isArray(content) ? content.join("\n\n") : String(content);

  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 bg-muted/50 border-b border-border">
        <span className={`text-xs font-bold uppercase tracking-wide ${color}`}>{label}</span>
        <button
          onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1800); }}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-white transition-colors"
        >
          {copied ? <><CheckCircle className="w-3 h-3 text-green-400" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
        </button>
      </div>
      <div className="px-4 py-3">
        {Array.isArray(content) ? (
          <div className="space-y-3">
            {content.map((item, i) => (
              <div key={i} className="bg-muted rounded-lg px-3 py-2">
                <p className="text-sm text-white leading-relaxed whitespace-pre-wrap">{item}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-white leading-relaxed whitespace-pre-wrap">{content}</p>
        )}
      </div>
    </div>
  );
}

export default function MarketingConsultant() {
  const [mode, setMode] = useState("tweet");
  const [topic, setTopic] = useState("");
  const [hook, setHook] = useState("");
  const [template, setTemplate] = useState("");
  const [tone, setTone] = useState("engaging");
  const [brandContext, setBrandContext] = useState("");
  const [threadCount, setThreadCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  async function handleGenerate() {
    if (!topic.trim()) return;
    setLoading(true);
    setResult(null);
    setError("");
    const res = await base44.functions.invoke("aiContentWriter", {
      mode,
      topic,
      hook: hook || undefined,
      template: template || undefined,
      tone,
      brand_context: brandContext || undefined,
      thread_count: threadCount,
    });
    if (res.data?.success) {
      setResult(res.data.result);
    } else {
      setError(res.data?.error || "Something went wrong.");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-background font-inter">
      <div className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Megaphone className="w-5 h-5 text-xblue" />
            <span className="font-black text-white">Marketing Consultant</span>
            <span className="text-xs bg-xblue/10 border border-xblue/30 text-xblue px-2 py-0.5 rounded-full font-semibold">AI Powered</span>
          </div>
          <Link to="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Home
          </Link>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-xblue/10 border border-xblue/30 text-xblue px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            <BarChart2 className="w-4 h-4" /> X/Twitter Content Strategist
          </div>
          <h1 className="text-3xl font-black text-white mb-2">AI Marketing Consultant</h1>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto">Generate top-quality tweets, threads, and full campaigns — all rule-safe, all optimized for 2026 X engagement.</p>
        </div>

        {/* Mode selector */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {MODES.map(m => {
            const Icon = m.icon;
            return (
              <button
                key={m.key}
                onClick={() => { setMode(m.key); setResult(null); }}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  mode === m.key ? "border-xblue bg-xblue/10" : "border-border hover:border-xblue/40 bg-card"
                }`}
              >
                <Icon className={`w-5 h-5 mb-2 ${mode === m.key ? "text-xblue" : "text-muted-foreground"}`} />
                <p className={`font-bold text-sm ${mode === m.key ? "text-white" : "text-muted-foreground"}`}>{m.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{m.desc}</p>
              </button>
            );
          })}
        </div>

        {/* Input form */}
        <motion.div key={mode} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Topic / Product / Message *</label>
            <textarea
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder={mode === "marketing" ? "e.g. Launch campaign for my new productivity course for solopreneurs" : "e.g. Why consistency beats intensity for building an audience on X"}
              className="w-full h-24 bg-muted border border-border rounded-xl px-4 py-3 text-white text-sm placeholder:text-muted-foreground resize-none focus:outline-none focus:border-xblue/60 transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Hook (optional)</label>
              <input value={hook} onChange={e => setHook(e.target.value)}
                placeholder="Paste a hook from the Hook Library..." className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-muted-foreground focus:outline-none focus:border-xblue/60 transition-colors" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Tone</label>
              <select value={tone} onChange={e => setTone(e.target.value)}
                className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-xblue/60 transition-colors capitalize">
                {TONES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            {mode !== "tweet" && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Template (optional)</label>
                <input value={template} onChange={e => setTemplate(e.target.value)}
                  placeholder="Paste a template structure..." className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-muted-foreground focus:outline-none focus:border-xblue/60 transition-colors" />
              </div>
            )}
            {mode === "thread" && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Thread Length</label>
                <select value={threadCount} onChange={e => setThreadCount(Number(e.target.value))}
                  className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-xblue/60 transition-colors">
                  {[3, 5, 7, 10].map(n => <option key={n} value={n}>{n} tweets</option>)}
                </select>
              </div>
            )}
            <div className={`space-y-1 ${mode === "tweet" ? "md:col-span-2" : ""}`}>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Brand Context (optional)</label>
              <input value={brandContext} onChange={e => setBrandContext(e.target.value)}
                placeholder="e.g. I help bootstrapped founders build in public, casual + direct tone" className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-muted-foreground focus:outline-none focus:border-xblue/60 transition-colors" />
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!topic.trim() || loading}
            className="w-full flex items-center justify-center gap-2 bg-xblue text-black font-black py-3 rounded-full hover:bg-xblue/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</> : <><Sparkles className="w-4 h-4" /> Generate Content</>}
          </button>
        </motion.div>

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              <h2 className="font-black text-white text-xl">Your Content</h2>

              {/* Tweet */}
              {mode === "tweet" && result.tweet && (
                <>
                  <CopyableBlock label="📝 Tweet" content={result.tweet} color="text-xblue" />
                  {result.char_count && (
                    <p className="text-xs text-muted-foreground">{result.char_count}/280 characters</p>
                  )}
                  {result.tips?.length > 0 && (
                    <div className="space-y-2">
                      {result.tips.map((tip, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <Sparkles className="w-3.5 h-3.5 text-xblue flex-shrink-0 mt-0.5" />
                          {tip}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* Thread */}
              {mode === "thread" && result.tweets?.length > 0 && (
                <CopyableBlock label={`🧵 Thread (${result.tweets.length} tweets)`} content={result.tweets} color="text-purple-400" />
              )}

              {/* Marketing campaign */}
              {mode === "marketing" && (
                <div className="space-y-3">
                  {result.campaign_concept && <CopyableBlock label="💡 Campaign Concept" content={result.campaign_concept} color="text-yellow-400" />}
                  {result.tweets?.length > 0 && <CopyableBlock label="📣 Tweet Variations (Awareness / Engagement / Conversion)" content={result.tweets} color="text-xblue" />}
                  {result.thread_outline?.length > 0 && <CopyableBlock label="🧵 Thread Outline" content={result.thread_outline} color="text-purple-400" />}
                  {result.hooks?.length > 0 && <CopyableBlock label="⚡ Hooks to Test" content={result.hooks} color="text-yellow-400" />}
                  {result.schedule && <CopyableBlock label={<span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Posting Schedule</span>} content={result.schedule} color="text-green-400" />}
                  {result.compliance_notes && (
                    <div className="flex items-start gap-2 bg-green-500/5 border border-green-500/20 rounded-xl p-3">
                      <Shield className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-green-300">{result.compliance_notes}</p>
                    </div>
                  )}
                </div>
              )}

              {result.tips?.length > 0 && mode !== "tweet" && (
                <div className="space-y-1.5">
                  {result.tips.map((tip, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Sparkles className="w-3.5 h-3.5 text-xblue flex-shrink-0 mt-0.5" /> {tip}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {error && <p className="text-sm text-red-400 text-center">{error}</p>}
      </main>
    </div>
  );
}