import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Key } from "lucide-react";

export default function LicenseModal({ open, onClose, onActivate }) {
  const [key, setKey] = useState("");
  const [error, setError] = useState("");

  function handleSubmit() {
    if (!key.trim() || key.trim().length < 8) {
      setError("Please enter a valid license key.");
      return;
    }
    onActivate(key.trim());
    setKey("");
    setError("");
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={e => e.stopPropagation()}
            className="bg-card border border-border rounded-2xl p-8 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-xblue/10 flex items-center justify-center">
                  <Key className="w-5 h-5 text-xblue" />
                </div>
                <h2 className="text-xl font-black text-white">Enter License Key</h2>
              </div>
              <button onClick={onClose} className="text-muted-foreground hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-muted-foreground text-sm mb-5">
              After completing your Stripe purchase, enter your license key below to activate Pro.
            </p>

            <input
              type="text"
              value={key}
              onChange={e => { setKey(e.target.value); setError(""); }}
              placeholder="e.g. XRG-XXXX-XXXX-XXXX"
              className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-white placeholder:text-muted-foreground focus:outline-none focus:border-xblue/60 transition-colors mb-3"
            />

            {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

            <button
              onClick={handleSubmit}
              className="w-full bg-xblue text-black font-bold py-3 rounded-full hover:bg-xblue/90 transition-all"
            >
              🎉 Activate Pro
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}