import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Twitter, User, AtSign, CheckCircle, Edit2, Save, Trash2, Globe, Users, FileText } from "lucide-react";
import { base44 } from "@/api/base44Client";

const NICHES = ["Tech", "Marketing", "Finance", "Fitness", "Creator Economy", "SaaS", "Personal Development", "Politics", "Sports", "Entertainment", "Business", "Design", "Education", "Other"];
const TONES = ["professional", "casual", "humorous", "inspirational", "educational", "bold"];

export default function XConnect() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    display_name: "",
    handle: "",
    bio: "",
    niche: "Tech",
    tone: "professional",
    followers: "",
    following: "",
    avg_likes: "",
    avg_retweets: "",
    goals: "",
  });

  useEffect(() => {
    const stored = localStorage.getItem("xpg_profile");
    if (stored) {
      const p = JSON.parse(stored);
      setProfile(p);
      setForm(p);
    }
  }, []);

  function handleSave() {
    localStorage.setItem("xpg_profile", JSON.stringify(form));
    setProfile(form);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleDisconnect() {
    localStorage.removeItem("xpg_profile");
    setProfile(null);
    setForm({ display_name: "", handle: "", bio: "", niche: "Tech", tone: "professional", followers: "", following: "", avg_likes: "", avg_retweets: "", goals: "" });
  }

  const isConnected = !!profile?.handle;

  return (
    <div className="min-h-screen bg-background font-inter">
      <div className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-2xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Twitter className="w-5 h-5 text-xblue" />
            <span className="font-black text-white">X Account Setup</span>
          </div>
          <Link to="/dashboard" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </Link>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-6 py-10 space-y-6">
        {/* Status banner */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl p-5 border flex items-center gap-4 ${isConnected ? "bg-green-500/10 border-green-500/30" : "bg-xblue/5 border-xblue/30"}`}
        >
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-black flex-shrink-0 ${isConnected ? "bg-green-500/20 text-green-400" : "bg-xblue/10 text-xblue"}`}>
            {isConnected ? <CheckCircle className="w-6 h-6" /> : <Twitter className="w-6 h-6" />}
          </div>
          <div className="flex-1">
            <p className={`font-black text-base ${isConnected ? "text-green-400" : "text-white"}`}>
              {isConnected ? `@${profile.handle} — Profile Set` : "Set Up Your X Profile"}
            </p>
            <p className="text-sm text-muted-foreground">
              {isConnected
                ? "Your profile context is active. All AI tools will tailor content to your brand."
                : "Add your X profile details so AI tools can create personalized content for your brand."}
            </p>
          </div>
          {isConnected && !editing && (
            <div className="flex gap-2">
              <button onClick={() => setEditing(true)} className="p-2 rounded-lg border border-border hover:border-xblue/40 text-muted-foreground hover:text-white transition-all">
                <Edit2 className="w-4 h-4" />
              </button>
              <button onClick={handleDisconnect} className="p-2 rounded-lg border border-border hover:border-red-400/40 text-muted-foreground hover:text-red-400 transition-all">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </motion.div>

        {/* Connected profile view */}
        {isConnected && !editing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-xblue/10 border border-xblue/30 flex items-center justify-center text-2xl font-black text-xblue">
                {profile.display_name?.[0]?.toUpperCase() || "X"}
              </div>
              <div>
                <p className="font-black text-white text-lg">{profile.display_name}</p>
                <p className="text-xblue text-sm">@{profile.handle}</p>
                <p className="text-muted-foreground text-xs mt-0.5 capitalize">{profile.niche} · {profile.tone} tone</p>
              </div>
            </div>
            {profile.bio && <p className="text-muted-foreground text-sm leading-relaxed border-l-2 border-xblue/30 pl-3">{profile.bio}</p>}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Followers", val: profile.followers || "—", icon: Users },
                { label: "Following", val: profile.following || "—", icon: Users },
                { label: "Avg Likes", val: profile.avg_likes || "—", icon: CheckCircle },
                { label: "Avg RTs", val: profile.avg_retweets || "—", icon: Twitter },
              ].map((s, i) => (
                <div key={i} className="bg-muted rounded-xl p-3 text-center">
                  <p className="text-white font-black text-lg">{s.val}</p>
                  <p className="text-muted-foreground text-xs">{s.label}</p>
                </div>
              ))}
            </div>
            {profile.goals && (
              <div className="bg-xblue/5 border border-xblue/20 rounded-xl p-3">
                <p className="text-xs font-bold text-xblue mb-1">Goals on X</p>
                <p className="text-sm text-muted-foreground">{profile.goals}</p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Link to="/composer" className="flex items-center justify-center gap-2 bg-xblue text-black font-black py-2.5 rounded-full hover:bg-xblue/90 transition-all text-sm">
                <FileText className="w-4 h-4" /> Compose Tweet
              </Link>
              <Link to="/feed-analyzer" className="flex items-center justify-center gap-2 border border-border text-white font-bold py-2.5 rounded-full hover:border-xblue/50 transition-all text-sm">
                <Globe className="w-4 h-4" /> Analyze Feed
              </Link>
            </div>
          </motion.div>
        )}

        {/* Form (setup or edit) */}
        {(!isConnected || editing) && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <h2 className="font-black text-white text-lg">{editing ? "Edit Profile" : "Enter Your X Profile Details"}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Display Name *</label>
                <input value={form.display_name} onChange={e => setForm(f => ({ ...f, display_name: e.target.value }))}
                  placeholder="e.g. Alex Johnson" className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-muted-foreground focus:outline-none focus:border-xblue/60 transition-colors" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">X Handle * (no @)</label>
                <div className="relative">
                  <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input value={form.handle} onChange={e => setForm(f => ({ ...f, handle: e.target.value.replace("@", "") }))}
                    placeholder="yourhandle" className="w-full bg-muted border border-border rounded-xl pl-9 pr-4 py-2.5 text-white text-sm placeholder:text-muted-foreground focus:outline-none focus:border-xblue/60 transition-colors" />
                </div>
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Current Bio</label>
                <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                  placeholder="Your current X bio..." rows={2}
                  className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-muted-foreground resize-none focus:outline-none focus:border-xblue/60 transition-colors" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Niche</label>
                <select value={form.niche} onChange={e => setForm(f => ({ ...f, niche: e.target.value }))}
                  className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-xblue/60 transition-colors">
                  {NICHES.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Brand Tone</label>
                <select value={form.tone} onChange={e => setForm(f => ({ ...f, tone: e.target.value }))}
                  className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-xblue/60 transition-colors capitalize">
                  {TONES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Followers (approx)</label>
                <input value={form.followers} onChange={e => setForm(f => ({ ...f, followers: e.target.value }))}
                  placeholder="e.g. 1,200" className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-muted-foreground focus:outline-none focus:border-xblue/60 transition-colors" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Avg Likes/Tweet</label>
                <input value={form.avg_likes} onChange={e => setForm(f => ({ ...f, avg_likes: e.target.value }))}
                  placeholder="e.g. 45" className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-muted-foreground focus:outline-none focus:border-xblue/60 transition-colors" />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Your Goals on X</label>
                <input value={form.goals} onChange={e => setForm(f => ({ ...f, goals: e.target.value }))}
                  placeholder="e.g. reach 10k followers, drive newsletter signups, build authority in SaaS" className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-muted-foreground focus:outline-none focus:border-xblue/60 transition-colors" />
              </div>
            </div>

            <div className="flex gap-3">
              {editing && (
                <button onClick={() => setEditing(false)} className="flex-1 border border-border text-muted-foreground font-bold py-3 rounded-full hover:text-white transition-all text-sm">
                  Cancel
                </button>
              )}
              <button
                onClick={handleSave}
                disabled={!form.display_name.trim() || !form.handle.trim()}
                className="flex-1 flex items-center justify-center gap-2 bg-xblue text-black font-black py-3 rounded-full hover:bg-xblue/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                {saved ? <><CheckCircle className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> {editing ? "Save Changes" : "Connect Profile"}</>}
              </button>
            </div>
          </motion.div>
        )}

        <div className="text-center text-xs text-muted-foreground">
          Your profile data is stored locally in your browser. No X API credentials required.
        </div>
      </main>
    </div>
  );
}