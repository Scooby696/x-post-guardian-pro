import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus } from "lucide-react";

const TYPES = ["template", "thread", "hook"];

export default function AddContentModal({ open, onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("template");
  const [body, setBody] = useState("");
  const [tagsRaw, setTagsRaw] = useState("");

  function handleSave() {
    if (!title.trim() || !body.trim()) return;
    const tags = tagsRaw.split(",").map(t => t.trim().replace(/^#/, "")).filter(Boolean);
    onSave({ title: title.trim(), type, body: body.trim(), tags, use_count: 0 });
    setTitle(""); setType("template"); setBody(""); setTagsRaw("");
    onClose();
  }

  function handleClose() {
    setTitle(""); setType("template"); setBody(""); setTagsRaw("");
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
            onClick={e => e.stopPropagation()}
            className="bg-card border border-border rounded-2xl w-full max-w-lg"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="font-black text-white text-lg">Add to Library</h2>
              <button onClick={handleClose} className="text-muted-foreground hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Type selector */}
              <div className="flex gap-2">
                {TYPES.map(t => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className={`flex-1 py-2 rounded-xl text-sm font-bold capitalize border transition-all ${
                      type === t
                        ? "bg-xblue text-black border-xblue"
                        : "border-border text-muted-foreground hover:border-xblue/40 hover:text-white"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Title */}
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Title (e.g. 'Morning engagement hook')"
                className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-white placeholder:text-muted-foreground text-sm focus:outline-none focus:border-xblue/60 transition-colors"
              />

              {/* Body */}
              <textarea
                value={body}
                onChange={e => setBody(e.target.value)}
                placeholder={
                  type === "thread"
                    ? "Tweet 1\n---\nTweet 2\n---\nTweet 3"
                    : type === "hook"
                    ? "The #1 mistake most people make with X is..."
                    : "Your reusable tweet template here..."
                }
                className="w-full h-36 bg-muted border border-border rounded-xl px-4 py-3 text-white placeholder:text-muted-foreground text-sm resize-none focus:outline-none focus:border-xblue/60 transition-colors"
              />

              {/* Tags */}
              <input
                value={tagsRaw}
                onChange={e => setTagsRaw(e.target.value)}
                placeholder="Tags (comma-separated): growth, hooks, niche"
                className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-white placeholder:text-muted-foreground text-sm focus:outline-none focus:border-xblue/60 transition-colors"
              />

              <button
                onClick={handleSave}
                disabled={!title.trim() || !body.trim()}
                className="w-full flex items-center justify-center gap-2 bg-xblue text-black font-black py-3 rounded-full hover:bg-xblue/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <Plus className="w-4 h-4" /> Save to Library
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}