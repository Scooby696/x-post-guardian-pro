import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { base44 } from "@/api/base44Client";
import {
  TrendingUp, Clock, Users, Zap, Shield, BookOpen,
  ChevronDown, ChevronUp, Sparkles, Send, Loader2,
  Hash, BarChart2, Star, MessageCircle, RefreshCw
} from "lucide-react";

const TOPICS = [
  {
    icon: Clock,
    color: "text-yellow-400",
    bg: "bg-yellow-400/10 border-yellow-400/20",
    title: "Prime Posting Times",
    summary: "When to post for maximum reach on X in 2026.",
    content: [
      { label: "Peak Engagement Windows", detail: "Weekdays 8–10am, 12–1pm, and 6–9pm (your audience's local time). Wednesday and Thursday consistently outperform weekends." },
      { label: "Thread Best Time", detail: "Launch threads at 8–9am EST. Replies posted throughout the day extend the thread's lifespan in the algorithm." },
      { label: "Weekend Strategy", detail: "Sundays 7–9pm can surprise — less competition, high leisure scrolling. Avoid Saturday mornings." },
      { label: "Time Zone Tip", detail: "If your audience is global, stagger posts: one at 8am EST, one at 6pm EST covers US + EU + UK morning peaks." },
    ],
  },
  {
    icon: TrendingUp,
    color: "text-xblue",
    bg: "bg-xblue/10 border-xblue/20",
    title: "Account Growth Habits",
    summary: "Daily habits that compound into massive follower growth.",
    content: [
      { label: "Reply Before You Post", detail: "Spend 15 min replying to 5–10 posts in your niche every morning before posting yourself. Replies drive profile visits." },
      { label: "Consistency Over Volume", detail: "1–3 quality posts/day beats 10 mediocre ones. X's algorithm rewards consistent schedules." },
      { label: "Pin a Value Post", detail: "Your pinned post is your billboard. Update it monthly with your best-performing or most valuable content." },
      { label: "Follow Strategically", detail: "Follow accounts your ideal followers follow. Engage genuinely. Never use follow/unfollow bots — instant strike risk." },
    ],
  },
  {
    icon: Users,
    color: "text-green-400",
    bg: "bg-green-400/10 border-green-400/20",
    title: "Community Building",
    summary: "How to build a loyal, engaged community around your content.",
    content: [
      { label: "Reply to Every Comment (first 30 days)", detail: "Replying to every reply signals to X's algorithm that your post generates conversation — it then boosts your reach." },
      { label: "Ask Questions", detail: "End 1 post per day with a direct question. 'What do you think?' doubles reply rate vs. statements alone." },
      { label: "Highlight Your Audience", detail: "Quote-repost a follower's great take with your commentary. They'll share it — and their network discovers you." },
      { label: "Create a Recurring Series", detail: "Weekly formats like '#MondayTips' or 'Friday Hot Takes' build anticipation and loyal repeat readers." },
    ],
  },
  {
    icon: BookOpen,
    color: "text-purple-400",
    bg: "bg-purple-400/10 border-purple-400/20",
    title: "Content Strategy",
    summary: "Content frameworks that drive shares, saves, and follows.",
    content: [
      { label: "The 80/20 Rule", detail: "80% value-driven content (tips, insights, how-tos), 20% promotional or personal. Flipping this kills growth." },
      { label: "Thread Power", detail: "Threads of 5–12 tweets get 3–5x the impressions of single tweets. Always end with a CTA: 'Follow for more like this.'" },
      { label: "Story Arc Posts", detail: "'I was struggling with X. Then I tried Y. Here's what happened.' Story-format posts outperform lists by 40%." },
      { label: "Repurpose Your Best Hits", detail: "Re-post your top tweet from 6 months ago with a fresh angle. New followers haven't seen it — and it likely still performs." },
    ],
  },
  {
    icon: Hash,
    color: "text-pink-400",
    bg: "bg-pink-400/10 border-pink-400/20",
    title: "Hashtags & Discovery",
    summary: "How to use hashtags correctly in 2026 without hurting reach.",
    content: [
      { label: "2026 Rule: 1–2 Hashtags Max", detail: "X's 2026 algorithm deprioritizes posts with 3+ hashtags. Use 1–2 highly relevant ones only." },
      { label: "Niche Over Broad", detail: "Use #ContentMarketing over #Marketing. Niche tags have less competition and more targeted audiences." },
      { label: "Hashtags in Replies", detail: "Add hashtags in a self-reply to keep the post clean and readable while still gaining discovery." },
      { label: "Trending with Caution", detail: "Only join trending hashtags when genuinely relevant. Forced hijacking damages credibility and can trigger spam flags." },
    ],
  },
  {
    icon: Shield,
    color: "text-red-400",
    bg: "bg-red-400/10 border-red-400/20",
    title: "Rule-Safe Growth",
    summary: "Grow fast without ever risking a strike, shadow ban, or suspension.",
    content: [
      { label: "Never Use Third-Party Bots", detail: "Auto-likers, auto-followers, and mass-DM tools violate X automation rules. One detection = permanent suspension risk." },
      { label: "Avoid Engagement Bait", detail: "Phrases like 'RT to win', 'follow for follow', or 'like if you agree' are flagged as low-quality engagement bait in 2026." },
      { label: "Label Paid Content", detail: "X requires #PaidPromotion or #Ad on any sponsored post. Failure to label is an instant enforcement risk." },
      { label: "Don't Mass-Tag", detail: "Tagging 5+ accounts per post triggers harassment filters. Keep @mentions to 1–2 per post, maximum." },
    ],
  },
  {
    icon: BarChart2,
    color: "text-orange-400",
    bg: "bg-orange-400/10 border-orange-400/20",
    title: "Analytics & Iteration",
    summary: "How to use data to double down on what works.",
    content: [
      { label: "Track Your Top 3 Weekly", detail: "Every Sunday, note your 3 best-performing posts. Find the pattern — format, topic, time? Replicate it." },
      { label: "Impressions vs Engagement", detail: "High impressions + low engagement = hook problem. High engagement + low impressions = posting time or hashtag problem." },
      { label: "Profile Visit Rate", detail: "If your post gets views but no profile visits, your bio isn't compelling. Optimize it with a clear value proposition." },
      { label: "A/B Test Hooks", detail: "Post the same idea with 2 different opening lines a week apart. The winner tells you what your audience responds to." },
    ],
  },
];

function TopicCard({ topic }) {
  const [open, setOpen] = useState(false);
  const Icon = topic.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`border rounded-2xl overflow-hidden transition-all ${topic.bg}`}
    >
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left"
      >
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-xl bg-black/20 flex items-center justify-center flex-shrink-0`}>
            <Icon className={`w-5 h-5 ${topic.color}`} />
          </div>
          <div>
            <h3 className={`font-bold text-white text-base`}>{topic.title}</h3>
            <p className="text-muted-foreground text-sm">{topic.summary}</p>
          </div>
        </div>
        {open ? <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 grid gap-3">
              {topic.content.map((item, i) => (
                <div key={i} className="bg-black/20 rounded-xl p-4">
                  <p className={`text-xs font-bold uppercase tracking-wide mb-1 ${topic.color}`}>{item.label}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.detail}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function AIAdvisor() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAsk() {
    if (!question.trim() || loading) return;
    setLoading(true);
    setAnswer("");
    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `You are an expert X/Twitter growth strategist and community builder for 2026. 
A user is asking for growth advice. Answer concisely with actionable, specific advice. 
Always keep recommendations compliant with X's 2026 Community Guidelines (no bots, no engagement bait, no spam, label paid content, max 1-2 hashtags, no mass @mentions).
Format your response clearly with short paragraphs or bullet points.

User question: ${question}`,
    });
    setAnswer(res);
    setLoading(false);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-card border border-xblue/30 rounded-2xl p-6 mt-10"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-xblue/10 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-xblue" />
        </div>
        <div>
          <h3 className="font-black text-white text-lg">AI Growth Advisor</h3>
          <p className="text-muted-foreground text-sm">Ask anything about growing your X account — rules-safe advice, powered by AI.</p>
        </div>
      </div>

      <div className="flex gap-3">
        <input
          type="text"
          value={question}
          onChange={e => setQuestion(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleAsk()}
          placeholder="e.g. How do I grow my tech niche community to 10k followers?"
          className="flex-1 bg-muted border border-border rounded-xl px-4 py-3 text-white placeholder:text-muted-foreground text-sm focus:outline-none focus:border-xblue/60 transition-colors"
        />
        <button
          onClick={handleAsk}
          disabled={!question.trim() || loading}
          className="bg-xblue text-black font-bold px-5 py-3 rounded-xl hover:bg-xblue/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </div>

      <AnimatePresence>
        {answer && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 bg-muted border border-border rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-xblue uppercase tracking-wide flex items-center gap-1">
                <Star className="w-3 h-3" /> AI Advice
              </span>
              <button onClick={() => { setAnswer(""); setQuestion(""); }} className="text-muted-foreground hover:text-white transition-colors">
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function GrowthGuide() {
  return (
    <div className="min-h-screen bg-background font-inter">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center gap-3">
          <TrendingUp className="w-5 h-5 text-xblue" />
          <span className="font-black text-white">Growth Guide</span>
          <span className="text-xs bg-xblue/10 border border-xblue/30 text-xblue px-2 py-0.5 rounded-full font-semibold">2026</span>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-xblue/10 border border-xblue/30 text-xblue px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
            <Sparkles className="w-4 h-4" />
            Rule-Safe Growth — X 2026 Guidelines
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            Grow Your Account<br />
            <span className="text-xblue">Without Getting Suspended</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need to grow followers, build community, and maximize reach — all fully compliant with X's 2026 rules.
          </p>
        </motion.div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { val: "7", label: "Growth Topics" },
            { val: "AI", label: "Powered Advisor" },
            { val: "2026", label: "Rules Compliant" },
            { val: "Free", label: "Always" },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-card border border-border rounded-xl p-4 text-center"
            >
              <div className="text-2xl font-black text-xblue">{s.val}</div>
              <div className="text-muted-foreground text-xs mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Topics */}
        <div className="space-y-4 mb-4">
          {TOPICS.map((topic, i) => (
            <TopicCard key={i} topic={topic} />
          ))}
        </div>

        {/* AI Advisor */}
        <AIAdvisor />
      </main>
    </div>
  );
}