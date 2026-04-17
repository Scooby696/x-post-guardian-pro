import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, Star, Calendar, CheckCircle } from "lucide-react";
import { getPrimeSlots, saveScheduledTweet } from "@/lib/scheduler";

export default function ScheduleModal({ open, onClose, tweetText, analysisResult }) {
  const [selected, setSelected] = useState(null);
  const [saved, setSaved] = useState(false);

  const slots = getPrimeSlots();

  function handleSave() {
    if (!selected) return;
    const tweet = {
      id: `tweet-${Date.now()}`,
      text: tweetText,
      score: analysisResult?.score ?? null,
      level: analysisResult?.level ?? null,
      issues: analysisResult?.issues ?? [],
      scheduledFor: selected.datetime,
      displayDate: selected.displayDate,
      displayTime: selected.displayTime,
      slotLabel: selected.label,
      isPrime: selected.isPrime,
      status: "scheduled",
      savedAt: new Date().toISOString(),
    };
    saveScheduledTweet(tweet);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setSelected(null);
      onClose();
    }, 1500);
  }

  function handleClose() {
    setSelected(null);
    setSaved(false);
    onClose();
  }

  const levelColor = {
    safe: "text-green-400 bg-green-500/10 border-green-500/30",
    warning: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
    danger: "text-red-400 bg-red-500/10 border-red-500/30",
  }[analysisResult?.level] ?? "";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={e => e.stopPropagation()}
            className="bg-card border border-border rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-xblue/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-xblue" />
                </div>
                <div>
                  <h2 className="font-black text-white text-lg">Schedule Tweet</h2>
                  <p className="text-muted-foreground text-xs">Pick a prime posting time</p>
                </div>
              </div>
              <button onClick={handleClose} className="text-muted-foreground hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Tweet preview */}
              <div className="bg-muted border border-border rounded-xl p-4">
                <p className="text-sm text-white line-clamp-3">{tweetText}</p>
                {analysisResult && (
                  <div className={`inline-flex items-center gap-1.5 mt-2 text-xs font-bold px-2 py-0.5 rounded-full border ${levelColor}`}>
                    {analysisResult.score}% safe · {analysisResult.level}
                  </div>
                )}
              </div>

              {/* Slots */}
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Star className="w-3 h-3 text-yellow-400" /> Prime Posting Slots — Next 7 Days
                </p>
                <div className="space-y-2">
                  {slots.map(slot => (
                    <button
                      key={slot.id}
                      onClick={() => setSelected(slot)}
                      className={`w-full flex items-center justify-between gap-3 p-3 rounded-xl border text-left transition-all ${
                        selected?.id === slot.id
                          ? "border-xblue bg-xblue/10"
                          : "border-border hover:border-xblue/40 hover:bg-muted/60"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white">{slot.displayDate} · {slot.displayTime}</span>
                            {slot.isPrime && (
                              <span className="text-xs font-bold text-yellow-400 bg-yellow-400/10 px-1.5 py-0.5 rounded-full">⭐ Best Day</span>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">{slot.label} — {slot.desc}</div>
                        </div>
                      </div>
                      {selected?.id === slot.id && (
                        <CheckCircle className="w-4 h-4 text-xblue flex-shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Save button */}
              <button
                onClick={handleSave}
                disabled={!selected || saved}
                className="w-full bg-xblue text-black font-black py-3 rounded-full hover:bg-xblue/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {saved ? (
                  <><CheckCircle className="w-4 h-4" /> Scheduled!</>
                ) : (
                  <><Clock className="w-4 h-4" /> Schedule for {selected ? `${selected.displayDate} ${selected.displayTime}` : "selected time"}</>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}