import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Twitter, BarChart2, Shield, BookOpen, Zap, Library, Target,
  Megaphone, TrendingUp, Clock, FileText, CheckCircle, AtSign,
  ArrowRight, Edit2, Globe
} from "lucide-react";

const TOOLS = [
  {
    to: "/composer",
    icon: FileText,
    color: "text-xblue",
    bg: "bg-xblue/10 border-xblue/20",
    title: "Tweet Composer",
    desc: "Write, analyze, and schedule tweets with AI assistance",
    badge: "AI",
  },
  {
    to: "/feed-analyzer",
    icon: BarChart2,
    color: "text-green-400",
    bg: "bg-green-400/10 border-green-400/20",
    title: "Feed Analyzer",
    desc: "Audit your content strategy & get optimal posting times",
    badge: "AI",
  },
  {
    to: "/",
    icon: Shield,
    color: "text-purple-400",
    bg: "bg-purple-400/10 border-purple-400/20",
    title: "Rule Checker",
    desc: "Instantly scan any tweet for X policy violations",
    badge: null,
  },
  {
    to: "/templates",
    icon: BookOpen,
    color: "text-xblue",
    bg: "bg-xblue/10 border-xblue/20",
    title: "Template Library",
    desc: "15 proven tweet formats that drive engagement",
    badge: "15",
  },
  {
    to: "/hooks",
    icon: Zap,
    color: "text-yellow-400",
    bg: "bg-yellow-400/10 border-yellow-400/20",
    title: "Hook Library",
    desc: "AI-generated high-performing hooks by category",
    badge: "AI",
  },
  {
    to: "/library",
    icon: Library,
    color: "text-pink-400",
    bg: "bg-pink-400/10 border-pink-400/20",
    title: "Content Library",
    desc: "Save and organize your best content for reuse",
    badge: null,
  },
  {
    to: "/brand",
    icon: Target,
    color: "text-orange-400",
    bg: "bg-orange-400/10 border-orange-400/20",
    title: "Brand Analyzer",
    desc: "Full AI brand playbook — positioning, pillars, voice",
    badge: "AI",
  },
  {
    to: "/marketing",
    icon: Megaphone,
    color: "text-cyan-400",
    bg: "bg-cyan-400/10 border-cyan-400/20",
    title: "Marketing Consultant",
    desc: "Generate tweets, threads & full campaigns with AI",
    badge: "AI",
  },
  {
    to: "/growth-guide",
    icon: TrendingUp,
    color: "text-green-400",
    bg: "bg-green-400/10 border-green-400/20",
    title: "Growth Guide 2026",
    desc: "Data-backed posting times and growth tactics",
    badge: null,
  },
  {
    to: "/scheduled",
    icon: Clock,
    color: "text-xblue",
    bg: "bg-xblue/10 border-xblue/20",
    title: "Scheduled Queue",
    desc: "Manage your upcoming scheduled tweets",
    badge: null,
  },
];

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [scheduledCount, setScheduledCount] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem("xpg_profile");
    if (stored) setProfile(JSON.parse(stored));
    try {
      const tweets = JSON.parse(localStorage.getItem("xrg_scheduled_tweets") || "[]");
      setScheduledCount(tweets.filter(t => t.status === "scheduled").length);
    } catch {}
  }, []);

  return (
    <div className="min-h-screen bg-background font-inter">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-xblue" />
            <span className="font-black text-white">X Post Guardian Pro</span>
          </div>
          <Link to="/" className="text-sm text-muted-foreground hover:text-white transition-colors">Home</Link>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        {/* Profile hero */}
        {profile ? (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-xblue/10 via-purple-500/5 to-transparent border border-xblue/30 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-xblue/20 border border-xblue/40 flex items-center justify-center text-2xl font-black text-xblue flex-shrink-0">
                {profile.display_name?.[0]?.toUpperCase() || "X"}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-black text-white text-lg">{profile.display_name}</p>
                  <CheckCircle className="w-4 h-4 text-green-400" />
                </div>
                <p className="text-xblue text-sm">@{profile.handle}</p>
                <p className="text-muted-foreground text-xs mt-0.5 capitalize">{profile.niche} · {profile.tone} tone</p>
              </div>
            </div>
            <div className="flex gap-3 flex-wrap">
              <div className="text-center bg-black/30 rounded-xl px-4 py-2">
                <p className="text-white font-black">{profile.followers || "—"}</p>
                <p className="text-xs text-muted-foreground">Followers</p>
              </div>
              <div className="text-center bg-black/30 rounded-xl px-4 py-2">
                <p className="text-white font-black">{scheduledCount}</p>
                <p className="text-xs text-muted-foreground">Scheduled</p>
              </div>
              <Link to="/x-connect"
                className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-white border border-border hover:border-xblue/40 px-3 py-2 rounded-full transition-all">
                <Edit2 className="w-3.5 h-3.5" /> Edit Profile
              </Link>
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-xblue/30 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-xblue/10 border border-xblue/30 flex items-center justify-center">
                <AtSign className="w-6 h-6 text-xblue" />
              </div>
              <div>
                <p className="font-black text-white">Set Up Your X Profile</p>
                <p className="text-muted-foreground text-sm">Add your account details for personalized AI content.</p>
              </div>
            </div>
            <Link to="/x-connect"
              className="flex items-center gap-2 bg-xblue text-black font-black px-5 py-2.5 rounded-full hover:bg-xblue/90 transition-all text-sm whitespace-nowrap">
              <Twitter className="w-4 h-4" /> Connect Profile
            </Link>
          </motion.div>
        )}

        {/* Quick actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { to: "/composer",     icon: FileText, label: "Compose",     color: "bg-xblue text-black" },
            { to: "/feed-analyzer",icon: BarChart2,label: "Feed Audit",  color: "bg-green-400/10 border border-green-400/30 text-green-400" },
            { to: "/scheduled",    icon: Clock,    label: "Queue",       color: "bg-muted border border-border text-white" },
            { to: "/marketing",    icon: Megaphone,label: "Campaign",    color: "bg-muted border border-border text-white" },
          ].map((a, i) => {
            const Icon = a.icon;
            return (
              <Link key={i} to={a.to}>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm cursor-pointer transition-all ${a.color}`}>
                  <Icon className="w-4 h-4" /> {a.label}
                </motion.div>
              </Link>
            );
          })}
        </div>

        {/* All tools grid */}
        <div>
          <h2 className="font-black text-white text-xl mb-4">All Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TOOLS.map((tool, i) => {
              const Icon = tool.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link to={tool.to} className="flex items-center gap-4 p-4 bg-card border border-border rounded-2xl hover:border-xblue/40 transition-all group">
                    <div className={`w-11 h-11 rounded-xl border flex items-center justify-center flex-shrink-0 ${tool.bg}`}>
                      <Icon className={`w-5 h-5 ${tool.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-white text-sm">{tool.title}</p>
                        {tool.badge && (
                          <span className="text-xs font-bold bg-xblue/10 text-xblue border border-xblue/20 px-1.5 py-0.5 rounded-full">{tool.badge}</span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">{tool.desc}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-xblue group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Compliance note */}
        <div className="flex items-center gap-3 bg-green-500/5 border border-green-500/20 rounded-xl p-4">
          <Shield className="w-5 h-5 text-green-400 flex-shrink-0" />
          <p className="text-sm text-muted-foreground">All AI-generated content is designed to comply with <span className="text-white font-semibold">X's 2026 Community Guidelines</span>. Always review before posting.</p>
        </div>
      </main>
    </div>
  );
}