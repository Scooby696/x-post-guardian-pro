import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Library, BookOpen, Zap, Hash } from "lucide-react";
import { base44 } from "@/api/base44Client";

const typeConfig = {
  template: { icon: BookOpen, color: "text-xblue" },
  hook:     { icon: Zap,      color: "text-yellow-400" },
  thread:   { icon: Hash,     color: "text-purple-400" },
};

export default function LibraryPickerModal({ open, onClose, onPick }) {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    base44.entities.ContentItem.list("-use_count").then(data => {
      setItems(data);
      setLoading(false);
    });
  }, [open]);

  const filtered = items.filter(item => {
    const q = search.toLowerCase();
    return !q || item.title.toLowerCase().includes(q) || item.body.toLowerCase().includes(q);
  });

  async function handlePick(item) {
    await base44.entities.ContentItem.update(item.id, { use_count: (item.use_count ?? 0) + 1 });
    onPick(item.body);
    onClose();
    setSearch("");
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
            onClick={e => e.stopPropagation()}
            className="bg-card border border-border rounded-2xl w-full max-w-lg max-h-[80vh] flex flex-col"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-shrink-0">
              <div className="flex items-center gap-2">
                <Library className="w-4 h-4 text-xblue" />
                <span className="font-black text-white">Insert from Library</span>
              </div>
              <button onClick={onClose} className="text-muted-foreground hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-5 pt-4 pb-2 flex-shrink-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search your library..."
                  autoFocus
                  className="w-full bg-muted border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-xblue/60 transition-colors"
                />
              </div>
            </div>

            <div className="overflow-y-auto flex-1 px-5 pb-5 space-y-2 mt-2">
              {loading ? (
                <div className="flex justify-center py-10">
                  <div className="w-6 h-6 border-4 border-border border-t-xblue rounded-full animate-spin" />
                </div>
              ) : filtered.length === 0 ? (
                <p className="text-center text-muted-foreground py-10 text-sm">
                  {search ? "No results found." : "No items in library yet."}
                </p>
              ) : (
                filtered.map(item => {
                  const cfg = typeConfig[item.type] ?? typeConfig.template;
                  const Icon = cfg.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handlePick(item)}
                      className="w-full text-left p-4 rounded-xl border border-border hover:border-xblue/40 hover:bg-muted/60 transition-all space-y-1"
                    >
                      <div className="flex items-center gap-2">
                        <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${cfg.color}`} />
                        <span className="text-white text-sm font-bold">{item.title}</span>
                        <span className="text-xs text-muted-foreground ml-auto capitalize">{item.type}</span>
                      </div>
                      <p className="text-muted-foreground text-xs line-clamp-2 leading-relaxed pl-5">{item.body}</p>
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}