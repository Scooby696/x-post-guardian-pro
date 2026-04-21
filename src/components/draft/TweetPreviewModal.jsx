import { motion, AnimatePresence } from "framer-motion";
import { X, Twitter, Heart, MessageCircle, Repeat2, Share } from "lucide-react";

export default function TweetPreviewModal({ open, onClose, text }) {
  const now = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  const date = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={e => e.stopPropagation()}
            className="bg-card border border-border rounded-2xl w-full max-w-sm overflow-hidden"
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Twitter className="w-4 h-4 text-xblue" />
                <span className="font-bold text-white text-sm">Tweet Preview</span>
              </div>
              <button onClick={onClose} className="text-muted-foreground hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Simulated X/Twitter post */}
            <div className="p-5">
              <div className="bg-black border border-white/10 rounded-2xl p-4 space-y-3">
                {/* Author row */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-xblue/20 border border-xblue/30 flex items-center justify-center text-xblue font-black text-sm flex-shrink-0">
                    U
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-white font-bold text-sm">Your Name</span>
                      <svg className="w-3.5 h-3.5 text-xblue" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91-1.01-1-2.52-1.27-3.91-.81-.66-1.31-1.9-2.19-3.34-2.19s-2.68.88-3.34 2.19c-1.39-.46-2.9-.2-3.91.81-1 1.01-1.27 2.52-.81 3.91C1.63 9.33.75 10.57.75 12s.88 2.67 2.19 3.34c-.46 1.39-.2 2.9.81 3.91 1.01 1 2.52 1.27 3.91.81.66 1.31 1.9 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.46 2.9.2 3.91-.81 1-1.01 1.27-2.52.81-3.91 1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z" />
                      </svg>
                    </div>
                    <span className="text-muted-foreground text-xs">@yourhandle</span>
                  </div>
                  <div className="ml-auto">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-white" aria-hidden="true">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.631L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
                    </svg>
                  </div>
                </div>

                {/* Tweet text */}
                <p className="text-white text-sm leading-relaxed whitespace-pre-wrap break-words">{text}</p>

                {/* Timestamp */}
                <p className="text-muted-foreground text-xs">{now} · {date}</p>

                {/* Divider */}
                <div className="border-t border-white/10" />

                {/* Actions */}
                <div className="flex items-center justify-between text-muted-foreground">
                  {[
                    { icon: MessageCircle, label: "0" },
                    { icon: Repeat2, label: "0" },
                    { icon: Heart, label: "0" },
                    { icon: Share, label: null },
                  ].map(({ icon: Icon, label }, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs hover:text-xblue transition-colors cursor-default">
                      <Icon className="w-4 h-4" />
                      {label && <span>{label}</span>}
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-center text-xs text-muted-foreground mt-3">This is a preview — not yet posted.</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}