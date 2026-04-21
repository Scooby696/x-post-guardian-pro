import { Trash2, Copy, Zap, BookOpen, Hash, CheckCircle } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

const typeConfig = {
  template: { icon: BookOpen, color: "text-xblue",      bg: "bg-xblue/10 border-xblue/20",         label: "Template" },
  thread:   { icon: Hash,     color: "text-purple-400", bg: "bg-purple-400/10 border-purple-400/20", label: "Thread" },
  hook:     { icon: Zap,      color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/20", label: "Hook" },
};

export default function ContentItemCard({ item, onDelete, onUse }) {
  const [copied, setCopied] = useState(false);
  const cfg = typeConfig[item.type] ?? typeConfig.template;
  const Icon = cfg.icon;

  function handleCopy() {
    navigator.clipboard.writeText(item.body);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -16 }}
      className="bg-card border border-border rounded-2xl p-5 space-y-3 hover:border-border/80 transition-all"
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.color}`}>
            <Icon className="w-3 h-3" /> {cfg.label}
          </span>
          {item.tags?.map(tag => (
            <span key={tag} className="text-xs text-muted-foreground bg-muted border border-border px-2 py-0.5 rounded-full">#{tag}</span>
          ))}
        </div>
        <button onClick={() => onDelete(item.id)} className="text-muted-foreground hover:text-red-400 transition-colors flex-shrink-0">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Title */}
      <h3 className="font-bold text-white text-sm">{item.title}</h3>

      {/* Body preview */}
      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 whitespace-pre-wrap">{item.body}</p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-xs text-muted-foreground">Used {item.use_count ?? 0}×</span>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-white border border-border hover:border-xblue/40 px-3 py-1.5 rounded-full transition-all"
          >
            {copied ? <><CheckCircle className="w-3.5 h-3.5 text-green-400" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
          </button>
          {onUse && (
            <button
              onClick={() => onUse(item)}
              className="flex items-center gap-1.5 text-xs font-bold text-black bg-xblue hover:bg-xblue/90 px-3 py-1.5 rounded-full transition-all"
            >
              Use in Draft
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}