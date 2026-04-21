import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Sparkles, Shield, Target, Loader2, Save, CheckCircle, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

const TONES = ["professional", "casual", "humorous", "inspirational", "educational", "bold"];

function ResultSection({ title, items, color = "text-xblue" }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button onClick={() => setOpen(v => !v)} className="w-full flex items-center justify-between px-4 py-3 bg-muted/50 hover:bg-muted transition-colors">
        <span className={`font-bold text-sm ${color}`}>{title}</span>
        {open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
            <div className="px-4 py-3 space-y-2">
              {Array.isArray(items) ? items.map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className={`text-xs font-bold mt-0.5 flex-shrink-0 ${color}`}>→</span>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item}</p>
                </div>
              )) : (
                <p className="text-sm text-muted-foreground leading-relaxed">{items}</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function BrandAnalyzer() {
  const [profiles, setProfiles] = useState([]);
  const [form, setForm] = useState({ brand_name: "", niche: "", target_audience: "", tone: "professional", unique_value: "", goals: "" });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeProfile, setActiveProfile] = useState(null);

  useEffect(() => { loadProfiles(); }, []);

  async function loadProfiles() {
    const data = await base44.entities.BrandProfile.list("-created_date");
    setProfiles(data);
  }

  async function handleAnalyze() {
    if (!form.brand_name.trim() || !form.niche.trim()) return;
    setLoading(true);
    setResult(null);
    const res = await base44.functions.invoke("brandAnalyzer", form);
    setResult(res.data?.analysis);
    setLoading(false);
  }

  async function handleSave() {
    if (!result) return;
    setSaving(true);
    const profile = await base44.entities.BrandProfile.create({
      ...form,
      ai_analysis: JSON.stringify(result),
      content_pillars: result.content_pillars,
      voice_guidelines: result.voice_guidelines?.join("\n"),
    });
    setProfiles(prev => [profile, ...prev]);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setSaving(false);
  }

  async function handleDeleteProfile(id) {
    await base44.entities.BrandProfile.delete(id);
    setProfiles(prev => prev.filter(p => p.id !== id));
    if (activeProfile?.id === id) setActiveProfile(null);
  }

  function loadProfile(p) {
    setForm({ brand_name: p.brand_name, niche: p.niche, target_audience: p.target_audience || "", tone: p.tone || "professional", unique_value: p.unique_value || "", goals: p.goals || "" });
    if (p.ai_analysis) {
      try { setResult(JSON.parse(p.ai_analysis)); } catch { setResult(null); }
    }
    setActiveProfile(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="min-h-screen bg-background font-inter">
      <div className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Target className="w-5 h-5 text-xblue" />
            <span className="font-black text-white">Brand Analyzer</span>
          </div>
          <Link to="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Home
          </Link>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-xblue/10 border border-xblue/30 text-xblue px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            <Sparkles className="w-4 h-4" /> AI-Powered Brand Strategy
          </div>
          <h1 className="text-3xl font-black text-white mb-2">Build Your X Brand</h1>
          <p className="text-muted-foreground text-sm">Get a complete AI-generated brand playbook — positioning, content pillars, voice, and growth strategy.</p>
        </div>

        {/* Form */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <h2 className="font-black text-white text-lg">About Your Brand</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Brand / Your Name *</label>
              <input value={form.brand_name} onChange={e => setForm(f => ({ ...f, brand_name: e.target.value }))}
                placeholder="e.g. TechByAlex" className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-muted-foreground focus:outline-none focus:border-xblue/60 transition-colors" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Niche *</label>
              <input value={form.niche} onChange={e => setForm(f => ({ ...f, niche: e.target.value }))}
                placeholder="e.g. SaaS marketing, personal finance" className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-muted-foreground focus:outline-none focus:border-xblue/60 transition-colors" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Target Audience</label>
              <input value={form.target_audience} onChange={e => setForm(f => ({ ...f, target_audience: e.target.value }))}
                placeholder="e.g. founders, freelancers, marketers" className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-muted-foreground focus:outline-none focus:border-xblue/60 transition-colors" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Brand Tone</label>
              <select value={form.tone} onChange={e => setForm(f => ({ ...f, tone: e.target.value }))}
                className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-xblue/60 transition-colors capitalize">
                {TONES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">What makes you unique?</label>
              <input value={form.unique_value} onChange={e => setForm(f => ({ ...f, unique_value: e.target.value }))}
                placeholder="e.g. I combine coding and storytelling to make tech accessible" className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-muted-foreground focus:outline-none focus:border-xblue/60 transition-colors" />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Goals on X</label>
              <input value={form.goals} onChange={e => setForm(f => ({ ...f, goals: e.target.value }))}
                placeholder="e.g. reach 10k followers, drive newsletter signups, become a thought leader" className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-muted-foreground focus:outline-none focus:border-xblue/60 transition-colors" />
            </div>
          </div>
          <button
            onClick={handleAnalyze}
            disabled={!form.brand_name.trim() || !form.niche.trim() || loading}
            className="w-full flex items-center justify-center gap-2 bg-xblue text-black font-black py-3 rounded-full hover:bg-xblue/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing your brand...</> : <><Sparkles className="w-4 h-4" /> Analyze My Brand</>}
          </button>
        </motion.div>

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-black text-white text-xl">Your Brand Playbook</h2>
                <button
                  onClick={handleSave}
                  disabled={saving || saved}
                  className="flex items-center gap-1.5 text-sm font-bold border border-border hover:border-xblue/50 text-muted-foreground hover:text-white px-4 py-2 rounded-full transition-all disabled:opacity-40"
                >
                  {saved ? <><CheckCircle className="w-4 h-4 text-green-400" /> Saved!</> : saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> Save Profile</>}
                </button>
              </div>

              {result.positioning && (
                <div className="bg-xblue/5 border border-xblue/30 rounded-2xl p-5">
                  <p className="text-xs font-bold text-xblue uppercase tracking-wide mb-1">Brand Positioning</p>
                  <p className="text-white font-bold text-base leading-relaxed">{result.positioning}</p>
                </div>
              )}

              {result.bio_suggestion && (
                <div className="bg-muted border border-border rounded-xl p-4 space-y-1">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Optimized X Bio</p>
                  <p className="text-white text-sm font-medium">"{result.bio_suggestion}"</p>
                  <p className="text-xs text-muted-foreground">{result.bio_suggestion.length}/160 chars</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {result.content_pillars?.length > 0 && <ResultSection title="📌 Content Pillars" items={result.content_pillars} color="text-xblue" />}
                {result.voice_guidelines?.length > 0 && <ResultSection title="🎙️ Voice & Tone" items={result.voice_guidelines} color="text-purple-400" />}
                {result.signature_angles?.length > 0 && <ResultSection title="✨ Signature Angles" items={result.signature_angles} color="text-yellow-400" />}
                {result.growth_tactics?.length > 0 && <ResultSection title="🚀 Growth Tactics" items={result.growth_tactics} color="text-green-400" />}
                {result.content_rhythm && <ResultSection title="📅 Content Rhythm" items={result.content_rhythm} color="text-xblue" />}
                {result.avoid?.length > 0 && <ResultSection title="⚠️ What to Avoid" items={result.avoid} color="text-red-400" />}
              </div>

              <div className="flex items-center gap-2 bg-green-500/5 border border-green-500/20 rounded-xl p-3">
                <Shield className="w-4 h-4 text-green-400 flex-shrink-0" />
                <p className="text-xs text-green-300">All recommendations comply with X's 2026 Community Guidelines.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Saved profiles */}
        {profiles.length > 0 && (
          <div className="space-y-3">
            <h2 className="font-black text-white text-lg">Saved Brand Profiles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {profiles.map(p => (
                <div key={p.id} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between gap-3">
                  <button onClick={() => loadProfile(p)} className="text-left flex-1">
                    <p className="font-bold text-white text-sm">{p.brand_name}</p>
                    <p className="text-xs text-muted-foreground">{p.niche} · {p.tone}</p>
                  </button>
                  <button onClick={() => handleDeleteProfile(p.id)} className="text-muted-foreground hover:text-red-400 transition-colors flex-shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}