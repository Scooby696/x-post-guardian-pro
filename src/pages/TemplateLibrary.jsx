import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, Copy, CheckCircle, Zap } from "lucide-react";

const TEMPLATES = [
  // Value / Educational
  { id: 1, title: "The Numbered List", category: "value", niche: "any", body: "X things I wish I knew about [TOPIC] before starting:\n\n1. [Point 1]\n2. [Point 2]\n3. [Point 3]\n4. [Point 4]\n\nSave this for later. 👇", why: "Lists get 3x more bookmarks than narrative posts" },
  { id: 2, title: "The Contrarian Take", category: "controversy", niche: "any", body: "Hot take: [POPULAR BELIEF] is wrong.\n\nHere's what actually works:\n\n[Your counter-take in 1-2 sentences]\n\nChange my mind.", why: "Contrarian posts drive high-quality replies from engaged users" },
  { id: 3, title: "The Before/After", category: "story", niche: "any", body: "Before: [Old situation]\nAfter: [New situation]\n\nWhat changed? [1 key insight or action]\n\nThis took me [timeframe]. Here's how:", why: "Transformation stories drive follows and saves" },
  { id: 4, title: "The Myth Buster", category: "value", niche: "any", body: "Most people think [COMMON MISCONCEPTION].\n\nThey're wrong.\n\n[The real truth in 1-2 sentences]\n\nHere's the proof:", why: "Correcting myths positions you as an authority" },
  { id: 5, title: "The Mistake Post", category: "story", niche: "any", body: "I made a [EXPENSIVE/BIG] mistake so you don't have to.\n\n[What happened in 1 sentence]\n\nLessons:\n→ [Lesson 1]\n→ [Lesson 2]\n→ [Lesson 3]", why: "Vulnerability + value = massive engagement" },
  { id: 6, title: "The Quick Win", category: "value", niche: "any", body: "You can [DESIRED OUTCOME] in [SHORT TIMEFRAME].\n\nHere's the exact process:\n\nStep 1: [Action]\nStep 2: [Action]\nStep 3: [Action]\n\nTry this today.", why: "Actionable quick wins are highly shareable" },
  { id: 7, title: "The Secret Reveal", category: "curiosity", niche: "any", body: "The [INDUSTRY/NICHE] secret nobody talks about:\n\n[The insight]\n\nWhy doesn't everyone know this? [Reason]\n\nNow you do.", why: "\"Secret\" framing drives 40% more clicks on threads" },
  { id: 8, title: "The Comparison", category: "value", niche: "any", body: "[OPTION A] vs [OPTION B]:\n\n[Option A]: [pros/cons]\n[Option B]: [pros/cons]\n\nMy verdict: [Your recommendation]\n\nHere's why:", why: "Comparison posts generate high reply volume" },
  { id: 9, title: "The Resource List", category: "value", niche: "any", body: "[NUMBER] free tools/resources for [GOAL]:\n\n1. [Tool] — [what it does]\n2. [Tool] — [what it does]\n3. [Tool] — [what it does]\n4. [Tool] — [what it does]\n\nBookmark this.", why: "Resource lists are the most-saved tweet format" },
  { id: 10, title: "The Personal Story Arc", category: "story", niche: "any", body: "[TIME PERIOD] ago, I [where you started].\n\nToday, I [where you are now].\n\nThe single biggest shift:\n\n[The key insight or action]\n\nThread on exactly how 👇", why: "Story arc threads average 5x the engagement of single tweets" },
  { id: 11, title: "The Prediction", category: "controversy", niche: "any", body: "Prediction: [BOLD CLAIM about your niche] by [YEAR].\n\nWhy I believe this:\n→ [Reason 1]\n→ [Reason 2]\n→ [Reason 3]\n\nAm I wrong?", why: "Predictions invite replies and debate, boosting algorithmic reach" },
  { id: 12, title: "The Warning", category: "fear", niche: "any", body: "Stop [COMMON MISTAKE] immediately.\n\nIt's costing you [negative outcome].\n\nWhat to do instead:\n\n[Better approach in 2-3 sentences]", why: "Loss aversion posts stop the scroll reliably" },
  { id: 13, title: "The Framework", category: "value", niche: "any", body: "My [NAME] framework for [GOAL]:\n\n[Letter 1] — [What it stands for]\n[Letter 2] — [What it stands for]\n[Letter 3] — [What it stands for]\n\nUse this every time you [situation].", why: "Frameworks are highly shareable and bookmark-worthy" },
  { id: 14, title: "The Day in the Life", category: "story", niche: "any", body: "My [DAY/WEEK] as a [YOUR ROLE]:\n\n[Time]: [Activity]\n[Time]: [Activity]\n[Time]: [Activity]\n\nThe part people don't see: [honest insight]", why: "Behind-the-scenes content drives follows from aspirational audience" },
  { id: 15, title: "The Opinion", category: "controversy", niche: "any", body: "Unpopular opinion: [YOUR TAKE]\n\n[2-3 sentences expanding on it]\n\nMost people won't agree. That's fine.", why: "Opinion posts with mild controversy outperform neutral posts 3:1" },
];

const CATEGORIES = ["all", "value", "story", "controversy", "curiosity", "fear"];
const catStyle = {
  value:       { color: "text-green-400",  bg: "bg-green-400/10 border-green-400/20",   label: "Value" },
  story:       { color: "text-purple-400", bg: "bg-purple-400/10 border-purple-400/20", label: "Story" },
  controversy: { color: "text-red-400",    bg: "bg-red-400/10 border-red-400/20",        label: "Controversy" },
  curiosity:   { color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/20", label: "Curiosity" },
  fear:        { color: "text-orange-400", bg: "bg-orange-400/10 border-orange-400/20", label: "Fear/Warning" },
};

function TemplateCard({ tpl }) {
  const [copied, setCopied] = useState(false);
  const cfg = catStyle[tpl.category] ?? catStyle.value;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-2xl p-5 space-y-3 hover:border-border/80 transition-all flex flex-col"
    >
      <div className="flex items-start justify-between gap-2">
        <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.color}`}>
          {cfg.label}
        </span>
        <span className="text-xs text-muted-foreground">{tpl.niche === "any" ? "Any niche" : tpl.niche}</span>
      </div>

      <h3 className="font-black text-white text-sm">{tpl.title}</h3>

      <pre className="text-muted-foreground text-xs leading-relaxed whitespace-pre-wrap font-sans bg-muted border border-border rounded-xl p-3 flex-1">
        {tpl.body}
      </pre>

      <div className="bg-xblue/5 border border-xblue/20 rounded-lg px-3 py-2">
        <p className="text-xs text-xblue">💡 {tpl.why}</p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => { navigator.clipboard.writeText(tpl.body); setCopied(true); setTimeout(() => setCopied(false), 1800); }}
          className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-white border border-border hover:border-xblue/40 py-2 rounded-full transition-all"
        >
          {copied ? <><CheckCircle className="w-3.5 h-3.5 text-green-400" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
        </button>
        <Link
          to={`/draft?template=${encodeURIComponent(tpl.body)}`}
          className="flex-1 flex items-center justify-center gap-1.5 text-xs font-black text-black bg-xblue hover:bg-xblue/90 py-2 rounded-full transition-all"
        >
          <Zap className="w-3.5 h-3.5" /> Use in Draft
        </Link>
      </div>
    </motion.div>
  );
}

export default function TemplateLibrary() {
  const [cat, setCat] = useState("all");
  const filtered = cat === "all" ? TEMPLATES : TEMPLATES.filter(t => t.category === cat);

  return (
    <div className="min-h-screen bg-background font-inter">
      <div className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-xblue" />
            <span className="font-black text-white">Template Library</span>
            <span className="text-xs bg-xblue/10 border border-xblue/30 text-xblue px-2 py-0.5 rounded-full font-semibold">{TEMPLATES.length} templates</span>
          </div>
          <Link to="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Home
          </Link>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-6 py-10 space-y-6">
        <div className="text-center mb-2">
          <h1 className="text-3xl font-black text-white mb-2">Best Tweet Templates</h1>
          <p className="text-muted-foreground text-sm">Proven formats that drive engagement — fully compliant with X's 2026 rules. Copy, customize, post.</p>
        </div>

        <div className="flex gap-2 flex-wrap justify-center">
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold border capitalize transition-all ${
                cat === c ? "bg-xblue text-black border-xblue" : "border-border text-muted-foreground hover:border-xblue/40 hover:text-white"
              }`}
            >
              {c === "all" ? `All (${TEMPLATES.length})` : `${catStyle[c]?.label} (${TEMPLATES.filter(t => t.category === c).length})`}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(tpl => <TemplateCard key={tpl.id} tpl={tpl} />)}
        </div>
      </main>
    </div>
  );
}