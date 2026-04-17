import { motion } from "framer-motion";
import { TrendingUp, Zap, Hash, MessageCircle, Type, Sparkles } from "lucide-react";

const categoryConfig = {
  Hook:        { icon: Zap,           color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/20" },
  Format:      { icon: Type,          color: "text-purple-400", bg: "bg-purple-400/10 border-purple-400/20" },
  Engagement:  { icon: MessageCircle, color: "text-xblue",      bg: "bg-xblue/10 border-xblue/20" },
  Discovery:   { icon: Hash,          color: "text-green-400",  bg: "bg-green-400/10 border-green-400/20" },
  Content:     { icon: Sparkles,      color: "text-pink-400",   bg: "bg-pink-400/10 border-pink-400/20" },
};

export default function GrowthTips({ tips }) {
  if (!tips || tips.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="mt-4 bg-card border border-border rounded-xl p-5"
    >
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-xblue" />
        <h3 className="font-bold text-white text-sm">Growth Tips <span className="text-muted-foreground font-normal">— 2026 X Engagement</span></h3>
      </div>

      <div className="space-y-3">
        {tips.map((item, i) => {
          const cfg = categoryConfig[item.category] || categoryConfig.Content;
          const Icon = cfg.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.07 }}
              className={`flex items-start gap-3 border rounded-lg p-3 ${cfg.bg}`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 mt-0.5 ${cfg.color}`} />
              <div>
                <span className={`text-xs font-bold uppercase tracking-wide ${cfg.color}`}>{item.category} · </span>
                <span className="text-sm text-muted-foreground">{item.tip}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}