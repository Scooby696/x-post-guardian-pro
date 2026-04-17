import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getScheduledTweets, deleteScheduledTweet, updateScheduledTweetStatus } from "@/lib/scheduler";
import { Clock, Trash2, CheckCircle, AlertTriangle, XCircle, Calendar, ArrowLeft, Inbox } from "lucide-react";

const levelConfig = {
  safe:    { color: "text-green-400",  bg: "bg-green-500/10 border-green-500/30",   icon: CheckCircle },
  warning: { color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/30", icon: AlertTriangle },
  danger:  { color: "text-red-400",    bg: "bg-red-500/10 border-red-500/30",        icon: XCircle },
};

const statusConfig = {
  scheduled: { label: "Scheduled",   color: "text-xblue",      bg: "bg-xblue/10 border-xblue/30" },
  posted:    { label: "Posted",       color: "text-green-400",  bg: "bg-green-500/10 border-green-500/30" },
  skipped:   { label: "Skipped",      color: "text-muted-foreground", bg: "bg-muted border-border" },
};

function TweetCard({ tweet, onDelete, onStatusChange }) {
  const level = levelConfig[tweet.level] ?? levelConfig.safe;
  const LevelIcon = level.icon;
  const status = statusConfig[tweet.status] ?? statusConfig.scheduled;
  const isPast = new Date(tweet.scheduledFor) < new Date();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-card border border-border rounded-2xl p-5 space-y-4"
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <div className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${status.bg} ${status.color}`}>
            <Clock className="w-3 h-3" />
            {status.label}
          </div>
          {tweet.isPrime && (
            <span className="text-xs font-bold text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 px-2 py-0.5 rounded-full">⭐ Prime Slot</span>
          )}
        </div>
        <button
          onClick={() => onDelete(tweet.id)}
          className="text-muted-foreground hover:text-red-400 transition-colors flex-shrink-0"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Tweet text */}
      <p className="text-white text-sm leading-relaxed">{tweet.text}</p>

      {/* Safety badge */}
      {tweet.level && (
        <div className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${level.bg} ${level.color}`}>
          <LevelIcon className="w-3 h-3" />
          {tweet.score}% safe · {tweet.level}
          {tweet.issues?.length > 0 && ` · ${tweet.issues.length} issue${tweet.issues.length > 1 ? "s" : ""}`}
        </div>
      )}

      {/* Schedule info */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Calendar className="w-4 h-4 text-xblue" />
        <span><span className="text-white font-semibold">{tweet.displayDate}</span> at <span className="text-white font-semibold">{tweet.displayTime}</span></span>
        <span className="text-xs">· {tweet.slotLabel}</span>
        {isPast && tweet.status === "scheduled" && (
          <span className="text-xs text-yellow-400 font-semibold">· Time passed</span>
        )}
      </div>

      {/* Status actions */}
      {tweet.status === "scheduled" && (
        <div className="flex gap-2 pt-1">
          <button
            onClick={() => onStatusChange(tweet.id, "posted")}
            className="flex-1 text-xs font-bold py-2 rounded-lg border border-green-500/30 text-green-400 hover:bg-green-500/10 transition-all"
          >
            ✅ Mark as Posted
          </button>
          <button
            onClick={() => onStatusChange(tweet.id, "skipped")}
            className="flex-1 text-xs font-bold py-2 rounded-lg border border-border text-muted-foreground hover:border-xblue/30 hover:text-white transition-all"
          >
            Skip
          </button>
        </div>
      )}
    </motion.div>
  );
}

export default function ScheduledTweets() {
  const [tweets, setTweets] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    setTweets(getScheduledTweets());
  }, []);

  function handleDelete(id) {
    setTweets(deleteScheduledTweet(id));
  }

  function handleStatusChange(id, status) {
    setTweets(updateScheduledTweetStatus(id, status));
  }

  const filtered = filter === "all" ? tweets : tweets.filter(t => t.status === filter);

  const counts = {
    all: tweets.length,
    scheduled: tweets.filter(t => t.status === "scheduled").length,
    posted: tweets.filter(t => t.status === "posted").length,
    skipped: tweets.filter(t => t.status === "skipped").length,
  };

  return (
    <div className="min-h-screen bg-background font-inter">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" /> Home
            </Link>
            <Clock className="w-5 h-5 text-xblue" />
            <span className="font-black text-white">Scheduled Tweets</span>
            <span className="text-xs bg-xblue/10 border border-xblue/30 text-xblue px-2 py-0.5 rounded-full font-semibold">{counts.scheduled} upcoming</span>
          </div>
          <Link
            to="/"
            className="text-xs font-bold text-xblue hover:text-xblue/80 transition-colors"
          >
            + Schedule More
          </Link>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-6 py-10">
        {/* Filter tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {[
            { key: "all",       label: "All" },
            { key: "scheduled", label: "Upcoming" },
            { key: "posted",    label: "Posted" },
            { key: "skipped",   label: "Skipped" },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
                filter === tab.key
                  ? "bg-xblue text-black border-xblue"
                  : "border-border text-muted-foreground hover:border-xblue/40 hover:text-white"
              }`}
            >
              {tab.label} <span className="opacity-60 ml-1">{counts[tab.key]}</span>
            </button>
          ))}
        </div>

        {/* Tweet list */}
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24 flex flex-col items-center gap-4"
          >
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
              <Inbox className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-lg font-semibold">No tweets here yet</p>
            <Link
              to="/"
              className="bg-xblue text-black font-bold px-6 py-2.5 rounded-full hover:bg-xblue/90 transition-all text-sm"
            >
              Analyze & Schedule a Tweet
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {filtered.map(tweet => (
                <TweetCard
                  key={tweet.id}
                  tweet={tweet}
                  onDelete={handleDelete}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
}