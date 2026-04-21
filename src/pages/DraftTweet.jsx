import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Eye, CalendarPlus, CheckCircle, AlertTriangle, XCircle, Twitter, Library } from "lucide-react";
import { saveScheduledTweet } from "@/lib/scheduler";
import TweetPreviewModal from "@/components/draft/TweetPreviewModal";
import CharacterRing from "@/components/draft/CharacterRing";
import DateTimePicker from "@/components/draft/DateTimePicker";
import LibraryPickerModal from "@/components/draft/LibraryPickerModal";

const X_LIMIT = 280;

export default function DraftTweet() {
  const [text, setText] = useState("");
  const [scheduledAt, setScheduledAt] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  const remaining = X_LIMIT - text.length;
  const isOverLimit = remaining < 0;
  const isNearLimit = remaining >= 0 && remaining <= 20;
  const canSchedule = text.trim().length > 0 && !isOverLimit && scheduledAt;

  const limitColor = isOverLimit
    ? "text-red-400"
    : isNearLimit
    ? "text-yellow-400"
    : "text-muted-foreground";

  function handleSchedule() {
    if (!canSchedule) return;
    const dt = new Date(scheduledAt);
    const tweet = {
      id: `tweet-${Date.now()}`,
      text,
      score: null,
      level: null,
      issues: [],
      scheduledFor: dt.toISOString(),
      displayDate: dt.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
      displayTime: dt.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }),
      slotLabel: "Custom",
      isPrime: false,
      status: "scheduled",
      savedAt: new Date().toISOString(),
    };
    saveScheduledTweet(tweet);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="min-h-screen bg-background font-inter">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-2xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Twitter className="w-5 h-5 text-xblue" />
            <span className="font-black text-white">Draft & Schedule</span>
          </div>
          <Link to="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Home
          </Link>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-6 py-10 space-y-6">
        {/* Tweet composer */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-2xl p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-black text-white text-lg">Compose Tweet</h2>
            <button
              onClick={() => setLibraryOpen(true)}
              className="flex items-center gap-1.5 text-xs font-bold text-xblue hover:text-xblue/80 border border-xblue/30 hover:border-xblue/60 px-3 py-1.5 rounded-full transition-all"
            >
              <Library className="w-3.5 h-3.5" /> From Library
            </button>
          </div>

          {/* Textarea */}
          <div className="relative">
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="What's happening?..."
              className={`w-full h-40 bg-muted border rounded-xl p-4 text-white placeholder:text-muted-foreground text-base resize-none focus:outline-none transition-colors ${
                isOverLimit
                  ? "border-red-500/60 focus:border-red-500"
                  : "border-border focus:border-xblue/60"
              }`}
            />
            {/* Character ring + count */}
            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              <span className={`text-sm font-bold tabular-nums ${limitColor}`}>{remaining}</span>
              <CharacterRing used={text.length} limit={X_LIMIT} />
            </div>
          </div>

          {/* Over-limit warning */}
          <AnimatePresence>
            {isOverLimit && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2"
              >
                <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span className="text-sm text-red-300">
                  Tweet exceeds X's 280-character limit by {Math.abs(remaining)} character{Math.abs(remaining) !== 1 ? "s" : ""}.
                </span>
              </motion.div>
            )}
            {isNearLimit && !isOverLimit && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-3 py-2"
              >
                <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                <span className="text-sm text-yellow-300">Approaching character limit — {remaining} left.</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Date & time picker */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="bg-card border border-border rounded-2xl p-6 space-y-4"
        >
          <h2 className="font-black text-white text-lg">Schedule Date & Time</h2>
          <DateTimePicker value={scheduledAt} onChange={setScheduledAt} />
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14 }}
          className="flex gap-3"
        >
          <button
            onClick={() => setPreviewOpen(true)}
            disabled={!text.trim()}
            className="flex-1 flex items-center justify-center gap-2 border border-border text-white font-bold py-3 rounded-full hover:border-xblue/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm"
          >
            <Eye className="w-4 h-4" /> Preview
          </button>

          <button
            onClick={handleSchedule}
            disabled={!canSchedule || saved}
            className="flex-1 flex items-center justify-center gap-2 bg-xblue text-black font-black py-3 rounded-full hover:bg-xblue/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm"
          >
            {saved ? (
              <><CheckCircle className="w-4 h-4" /> Scheduled!</>
            ) : (
              <><CalendarPlus className="w-4 h-4" /> Schedule Tweet</>
            )}
          </button>
        </motion.div>

        {saved && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-sm text-green-400 font-semibold"
          >
            ✅ Tweet saved!{" "}
            <Link to="/scheduled" className="underline text-xblue">View scheduled tweets →</Link>
          </motion.div>
        )}
      </main>

      <TweetPreviewModal open={previewOpen} onClose={() => setPreviewOpen(false)} text={text} />
      <LibraryPickerModal open={libraryOpen} onClose={() => setLibraryOpen(false)} onPick={body => setText(body)} />
    </div>
  );
}