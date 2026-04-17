import { motion } from "framer-motion";
import { Shield, Zap, Eye, RefreshCw, AlertTriangle, Lock } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Instant Analysis",
    desc: "Get a risk score in milliseconds. No waiting, no friction — just paste and analyze.",
  },
  {
    icon: Shield,
    title: "6 Rule Categories",
    desc: "Covers violent language, harassment, spam links, paid promotion labeling, automation, and impersonation.",
  },
  {
    icon: Eye,
    title: "2026 Rules",
    desc: "Always up-to-date with X's current community guidelines and enforcement policies.",
  },
  {
    icon: AlertTriangle,
    title: "Clear Risk Scores",
    desc: "Color-coded scores (green/yellow/red) tell you exactly how risky your post is before you send it.",
  },
  {
    icon: RefreshCw,
    title: "Fix Suggestions",
    desc: "Don't just get flagged — get actionable rewrites that eliminate violations instantly.",
  },
  {
    icon: Lock,
    title: "Private & Secure",
    desc: "Your tweets are never stored or sent to any server. All analysis runs locally in your browser.",
  },
];

export default function Features() {
  return (
    <section className="py-24 px-6 border-t border-border">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-black text-white mb-4">Why X Rule Guardian?</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Built for creators, brands, and power users who can't afford a suspension.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-card border border-border rounded-2xl p-6 hover:border-xblue/40 transition-all group"
            >
              <div className="w-11 h-11 rounded-xl bg-xblue/10 flex items-center justify-center mb-4 group-hover:bg-xblue/20 transition-colors">
                <f.icon className="w-5 h-5 text-xblue" />
              </div>
              <h3 className="font-bold text-white text-lg mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}