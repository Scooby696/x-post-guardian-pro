import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, BarChart2, Loader2, Sparkles, Clock, TrendingUp, AlertTriangle, CheckCircle, ChevronDown, ChevronUp, RefreshCw } from "lucide-react";
import { base44 } from "@/api/base44Client";

function Section({ title, color = "text-xblue", children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button onClick={() => setOpen(v => !v)} className="w-full flex items-center justify-between px-4 py-3 bg-muted/40 hover:bg-muted/60 transition-colors">
        <span className={`font-bold text-sm ${color}`}>{title}</span>
        {open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
            <div className="px-4 py-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ScoreBar({ label, score, color }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className={`text-xs font-bold ${color}`}>{score}/100</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`h-full rounded-full ${score >= 70 ? "bg-green-400" : score >= 40 ? "bg-yellow-400" : "bg-red-400"}`}
        />
      </div>
    </div>
  );
}

export default function FeedAnalyzer() {
  const [profile, setProfile] = useState(null);
  const [tweets, setTweets] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [step, setStep] = useState("input"); // input | results

  useEffect(() => {
    const stored = localStorage.getItem("xpg_profile");
    if (stored) setProfile(JSON.parse(stored));
  }, []);

  async function handleAnalyze() {
    if (!tweets.trim()) return;
    setLoading(true);
    setResult(null);

    const profileContext = profile
      ? `User profile: @${profile.handle} (${profile.niche}, ${profile.tone} tone, ${profile.followers || "unknown"} followers, goals: ${profile.goals || "grow account"})`
      : "No profile set — analyze generically";

    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `You are an elite X/Twitter account growth analyst for 2026.

${profileContext}

Analyze these recent tweets and provide a DEEP, ACTIONABLE account audit:

TWEETS TO ANALYZE:
${tweets}

Provide analysis covering:

1. CONTENT SCORES (0-100 each):
   - Hook strength (how compelling are the opening lines)
   - Engagement potential (likely to get replies/RTs)  
   - Value delivery (educational/entertaining value)
   - Brand consistency (consistent voice/niche)
   - Overall quality

2. POSTING TIME ANALYSIS:
   - Detect timestamps if present in tweets
   - Recommend best posting windows for their niche (specific hours + days)
   - Worst times to avoid

3. CONTENT PATTERNS:
   - What formats they use most (lists, stories, questions, etc.)
   - What's working (high potential content)
   - What's hurting performance
   - Missing content types they should add

4. TOP 3 QUICK WINS:
   - Specific, immediately actionable improvements

5. GROWTH BOTTLENECK:
   - The single biggest thing holding back their growth

6. 5 PERSONALIZED TWEET IDEAS:
   - Based on their niche and style, ready-to-use tweet concepts

7. OPTIMAL POSTING SCHEDULE:
   - Specific weekly schedule recommendation with times

All advice must comply with X's 2026 Community Guidelines.

Return JSON:
{
  scores: { hook_strength: number, engagement_potential: number, value_delivery: number, brand_consistency: number, overall: number },
  posting_times: { best_windows: string[], worst_times: string[], optimal_schedule: string },
  content_patterns: { formats_used: string[], whats_working: string[], whats_hurting: string[], missing_types: string[] },
  quick_wins: string[],
  growth_bottleneck: string,
  tweet_ideas: string[],
  summary: string
}`,
      response_json_schema: {
        type: "object",
        properties: {
          scores: { type: "object" },
          posting_times: { type: "object" },
          content_patterns: { type: "object" },
          quick_wins: { type: "array", items: { type: "string" } },
          growth_bottleneck: { type: "string" },
          tweet_ideas: { type: "array", items: { type: "string" } },
          summary: { type: "string" }
        }
      }
    });

    setResult(res);
    setStep("results");
    setLoading(false);
  }

  function handleReset() {
    setStep("input");
    setResult(null);
    setTweets("");
  }

  return (
    <div className="min-h-screen bg-background font-inter">
      <div className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart2 className="w-5 h-5 text-xblue" />
            <span className="font-black text-white">Feed Analyzer</span>
            {profile && <span className="text-xs bg-green-500/10 border border-green-500/30 text-green-400 px-2 py-0.5 rounded-full font-semibold">@{profile.handle}</span>}
          </div>
          <div className="flex items-center gap-3">
            {step === "results" && (
              <button onClick={handleReset} className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-white border border-border px-3 py-1.5 rounded-full transition-all">
                <RefreshCw className="w-3.5 h-3.5" /> New Analysis
              </button>
            )}
            <Link to="/dashboard" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" /> Dashboard
            </Link>
          </div>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-6 py-10 space-y-6">
        {step === "input" && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-xblue/10 border border-xblue/30 text-xblue px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
                <Sparkles className="w-4 h-4" /> AI-Powered Feed Audit
              </div>
              <h1 className="text-3xl font-black text-white mb-2">Analyze Your X Feed</h1>
              <p className="text-muted-foreground text-sm max-w-xl mx-auto">Paste 5–20 of your recent tweets below. The AI will audit your content strategy, posting times, and give you a personalized growth plan.</p>
            </div>

            {!profile && (
              <div className="bg-yellow-400/10 border border-yellow-400/20 rounded-xl p-4 flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-yellow-400">No profile set</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Analysis will be generic. <Link to="/x-connect" className="text-xblue underline">Set up your profile</Link> for personalized insights.</p>
                </div>
              </div>
            )}

            <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Paste Your Recent Tweets *</label>
                <p className="text-xs text-muted-foreground">Include timestamps if possible. Separate tweets with a blank line or "---"</p>
              </div>
              <textarea
                value={tweets}
                onChange={e => setTweets(e.target.value)}
                placeholder={`Paste your tweets here, e.g.:

Tweet 1 (Mon 9am): Most people spend 80% of their time on tasks that generate 20% of results. Here's how I fixed that...

---

Tweet 2 (Tue 3pm): Hot take: consistency beats talent every single time in content creation.

---

Tweet 3 (Wed 7pm): 5 free tools that saved me 10 hours this week...`}
                className="w-full h-64 bg-muted border border-border rounded-xl p-4 text-white text-sm placeholder:text-muted-foreground resize-none focus:outline-none focus:border-xblue/60 transition-colors"
              />
              <button
                onClick={handleAnalyze}
                disabled={!tweets.trim() || loading}
                className="w-full flex items-center justify-center gap-2 bg-xblue text-black font-black py-3 rounded-full hover:bg-xblue/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing your feed...</> : <><BarChart2 className="w-4 h-4" /> Analyze My Feed</>}
              </button>
            </div>
          </motion.div>
        )}

        {step === "results" && result && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <h2 className="font-black text-white text-2xl">Your Feed Audit</h2>

            {/* Summary */}
            {result.summary && (
              <div className="bg-xblue/5 border border-xblue/30 rounded-2xl p-5">
                <p className="text-xs font-bold text-xblue uppercase tracking-wide mb-2">Overall Assessment</p>
                <p className="text-white text-sm leading-relaxed">{result.summary}</p>
              </div>
            )}

            {/* Scores */}
            {result.scores && (
              <Section title="📊 Content Scores" color="text-xblue">
                <div className="space-y-3">
                  <ScoreBar label="Hook Strength" score={result.scores.hook_strength} />
                  <ScoreBar label="Engagement Potential" score={result.scores.engagement_potential} />
                  <ScoreBar label="Value Delivery" score={result.scores.value_delivery} />
                  <ScoreBar label="Brand Consistency" score={result.scores.brand_consistency} />
                  <div className="pt-2 border-t border-border">
                    <ScoreBar label="Overall Quality" score={result.scores.overall} color="text-xblue" />
                  </div>
                </div>
              </Section>
            )}

            {/* Posting times */}
            {result.posting_times && (
              <Section title="⏰ Posting Time Insights" color="text-green-400">
                <div className="space-y-4">
                  {result.posting_times.best_windows?.length > 0 && (
                    <div>
                      <p className="text-xs font-bold text-green-400 mb-2">Best Times to Post</p>
                      <div className="space-y-1.5">
                        {result.posting_times.best_windows.map((w, i) => (
                          <div key={i} className="flex items-center gap-2 bg-green-500/5 border border-green-500/20 rounded-lg px-3 py-2">
                            <Clock className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                            <p className="text-sm text-white">{w}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {result.posting_times.worst_times?.length > 0 && (
                    <div>
                      <p className="text-xs font-bold text-red-400 mb-2">Times to Avoid</p>
                      <div className="space-y-1">
                        {result.posting_times.worst_times.map((t, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <AlertTriangle className="w-3 h-3 text-red-400 flex-shrink-0" />
                            <p className="text-sm text-muted-foreground">{t}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {result.posting_times.optimal_schedule && (
                    <div className="bg-muted rounded-xl p-3">
                      <p className="text-xs font-bold text-muted-foreground mb-1">Recommended Weekly Schedule</p>
                      <p className="text-sm text-white leading-relaxed whitespace-pre-wrap">{result.posting_times.optimal_schedule}</p>
                    </div>
                  )}
                </div>
              </Section>
            )}

            {/* Content patterns */}
            {result.content_patterns && (
              <Section title="🔍 Content Pattern Analysis" color="text-purple-400">
                <div className="space-y-4">
                  {result.content_patterns.whats_working?.length > 0 && (
                    <div>
                      <p className="text-xs font-bold text-green-400 mb-2">✅ What's Working</p>
                      {result.content_patterns.whats_working.map((w, i) => (
                        <div key={i} className="flex items-start gap-2 mb-1.5">
                          <CheckCircle className="w-3.5 h-3.5 text-green-400 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-muted-foreground">{w}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {result.content_patterns.whats_hurting?.length > 0 && (
                    <div>
                      <p className="text-xs font-bold text-red-400 mb-2">⚠️ What's Hurting Performance</p>
                      {result.content_patterns.whats_hurting.map((w, i) => (
                        <div key={i} className="flex items-start gap-2 mb-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-muted-foreground">{w}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {result.content_patterns.missing_types?.length > 0 && (
                    <div>
                      <p className="text-xs font-bold text-yellow-400 mb-2">💡 Missing Content Types to Add</p>
                      {result.content_patterns.missing_types.map((m, i) => (
                        <div key={i} className="flex items-start gap-2 mb-1.5">
                          <TrendingUp className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-muted-foreground">{m}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Section>
            )}

            {/* Growth bottleneck */}
            {result.growth_bottleneck && (
              <div className="bg-orange-400/10 border border-orange-400/30 rounded-2xl p-5">
                <p className="text-xs font-bold text-orange-400 uppercase tracking-wide mb-2">🚧 Your #1 Growth Bottleneck</p>
                <p className="text-white text-sm leading-relaxed font-medium">{result.growth_bottleneck}</p>
              </div>
            )}

            {/* Quick wins */}
            {result.quick_wins?.length > 0 && (
              <Section title="⚡ Top 3 Quick Wins" color="text-yellow-400">
                <div className="space-y-3">
                  {result.quick_wins.map((win, i) => (
                    <div key={i} className="flex items-start gap-3 bg-yellow-400/5 border border-yellow-400/20 rounded-xl p-3">
                      <span className="text-yellow-400 font-black text-sm flex-shrink-0">#{i + 1}</span>
                      <p className="text-sm text-white leading-relaxed">{win}</p>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Tweet ideas */}
            {result.tweet_ideas?.length > 0 && (
              <Section title="💡 5 Personalized Tweet Ideas" color="text-xblue">
                <div className="space-y-2">
                  {result.tweet_ideas.map((idea, i) => (
                    <div key={i} className="bg-muted border border-border rounded-xl p-3 flex items-start gap-3">
                      <span className="text-xblue font-black text-xs flex-shrink-0 mt-0.5">{i + 1}</span>
                      <p className="text-sm text-white leading-relaxed">{idea}</p>
                    </div>
                  ))}
                </div>
                <Link to="/composer" className="mt-4 flex items-center justify-center gap-2 bg-xblue text-black font-black py-2.5 rounded-full hover:bg-xblue/90 transition-all text-sm w-full">
                  <Sparkles className="w-4 h-4" /> Write These with AI →
                </Link>
              </Section>
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
}