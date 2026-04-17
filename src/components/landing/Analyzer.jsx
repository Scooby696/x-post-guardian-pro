import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { analyzeDraft, getRewriteSuggestions } from "@/lib/analyzer";
import { getGrowthTips } from "@/lib/growthTips";
import GrowthTips from "@/components/landing/GrowthTips";
import { Shield, AlertTriangle, CheckCircle, XCircle, Lightbulb, RefreshCw } from "lucide-react";

const FREE_LIMIT = 15;

export default function Analyzer({ analysisCount, setAnalysisCount, isPro }) {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [growthTips, setGrowthTips] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const remaining = FREE_LIMIT - analysisCount;
  const canAnalyze = isPro || analysisCount < FREE_LIMIT;

  function handleAnalyze() {
    if (!text.trim()) return;
    if (!canAnalyze) return;
    const r = analyzeDraft(text);
    setResult(r);
    setGrowthTips(getGrowthTips(text));
    setShowSuggestions(false);
    if (!isPro) setAnalysisCount(c => c + 1);
  }

  function handleClear() {
    setText("");
    setResult(null);
    setGrowthTips([]);
    setShowSuggestions(false);
  }

  const scoreColor =
    !result ? "text-muted-foreground"
    : result.level === "safe" ? "text-green-400"
    : result.level === "warning" ? "text-yellow-400"
    : "text-red-400";

  const scoreBg =
    !result ? ""
    : result.level === "safe" ? "bg-green-500/10 border-green-500/30"
    : result.level === "warning" ? "bg-yellow-500/10 border-yellow-500/30"
    : "bg-red-500/10 border-red-500/30";

  const ScoreIcon = !result ? Shield
    : result.level === "safe" ? CheckCircle
    : result.level === "warning" ? AlertTriangle
    : XCircle;

  return (
    <section id="analyzer" className="py-24 px-6">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-4xl font-black text-white mb-3">Analyze Your Tweet</h2>
          <p className="text-muted-foreground">
            Paste any tweet or thread below for an instant risk assessment.
          </p>
          {!isPro && (
            <div className="inline-block mt-3 bg-muted border border-border text-muted-foreground text-sm px-4 py-1.5 rounded-full">
              {remaining > 0 ? `${remaining} free analyses remaining today` : "Daily limit reached — upgrade to Pro"}
            </div>
          )}
          {isPro && (
            <div className="inline-block mt-3 bg-xblue/10 border border-xblue/30 text-xblue text-sm px-4 py-1.5 rounded-full">
              ✅ Pro — Unlimited analyses
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-2xl p-6 space-y-4"
        >
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Paste your tweet or thread here..."
            className="w-full h-36 bg-muted border border-border rounded-xl p-4 text-white placeholder:text-muted-foreground text-base resize-none focus:outline-none focus:border-xblue/60 transition-colors"
          />

          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleAnalyze}
              disabled={!text.trim() || !canAnalyze}
              className="flex-1 bg-xblue text-black font-bold py-3 rounded-full disabled:opacity-40 disabled:cursor-not-allowed hover:bg-xblue/90 transition-all"
            >
              🛡️ Analyze Now
            </motion.button>
            {(text || result) && (
              <button
                onClick={handleClear}
                className="p-3 rounded-full border border-border hover:border-xblue/50 text-muted-foreground hover:text-white transition-all"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            )}
          </div>

          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4 pt-2"
              >
                {/* Score card */}
                <div className={`border rounded-xl p-5 flex items-center gap-5 ${scoreBg}`}>
                  <ScoreIcon className={`w-10 h-10 flex-shrink-0 ${scoreColor}`} />
                  <div>
                    <div className={`text-4xl font-black ${scoreColor}`}>{result.score}%</div>
                    <div className="text-sm text-muted-foreground mt-0.5">
                      {result.level === "safe" && "Low risk — looks good to post!"}
                      {result.level === "warning" && "Moderate risk — review before posting."}
                      {result.level === "danger" && "High risk — likely to trigger a flag or suspension."}
                    </div>
                  </div>
                </div>

                {/* Issues */}
                {result.issues.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Issues Detected</p>
                    {result.issues.map((issue, i) => (
                      <div key={i} className="flex items-start gap-3 bg-red-500/5 border border-red-500/20 rounded-lg p-3">
                        <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-red-300">{issue}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Suggestions toggle */}
                {result.issues.length > 0 && (
                  <button
                    onClick={() => setShowSuggestions(v => !v)}
                    className="flex items-center gap-2 text-xblue text-sm font-semibold hover:text-xblue/80 transition-colors"
                  >
                    <Lightbulb className="w-4 h-4" />
                    {showSuggestions ? "Hide" : "Show"} Fix Suggestions
                  </button>
                )}

                <AnimatePresence>
                  {showSuggestions && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2 overflow-hidden"
                    >
                      {getRewriteSuggestions(result.issues).map((s, i) => (
                        <div key={i} className="bg-xblue/5 border border-xblue/20 rounded-lg p-3">
                          <p className="text-xs font-bold text-xblue uppercase mb-1">{s.issue}</p>
                          <p className="text-sm text-muted-foreground">{s.fix}</p>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {result.issues.length === 0 && (
                  <div className="flex items-center gap-3 bg-green-500/5 border border-green-500/20 rounded-lg p-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-sm text-green-300">No rule violations found. Safe to post!</span>
                  </div>
                )}

                <GrowthTips tips={growthTips} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}