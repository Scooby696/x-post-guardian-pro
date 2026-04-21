import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, X, Volume2, ChevronDown, ChevronUp } from "lucide-react";
import { base44 } from "@/api/base44Client";

const ROUTES = {
  home: "/", dashboard: "/dashboard", composer: "/composer",
  "feed analyzer": "/feed-analyzer", hooks: "/hooks", templates: "/templates",
  library: "/library", brand: "/brand", marketing: "/marketing",
  "growth guide": "/growth-guide", scheduled: "/scheduled",
  "x connect": "/x-connect",
};

const WAKE_WORD = "guardian";

function speak(text) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 1.05;
  u.pitch = 1;
  window.speechSynthesis.speak(u);
}

export default function VoiceController() {
  const navigate = useNavigate();
  const [active, setActive] = useState(false);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [status, setStatus] = useState("idle"); // idle | listening | thinking | speaking
  const [log, setLog] = useState([]);
  const [showLog, setShowLog] = useState(false);
  const [aiReply, setAiReply] = useState("");
  const recognitionRef = useRef(null);
  const manualRef = useRef(false); // user manually toggled mic

  const addLog = useCallback((msg, type = "info") => {
    setLog(prev => [...prev.slice(-29), { msg, type, ts: Date.now() }]);
  }, []);

  // Handle a finalized voice command/query
  const handleCommand = useCallback(async (text) => {
    const lower = text.toLowerCase().trim();
    setTranscript(text);
    addLog(`You: "${text}"`, "user");

    // Navigation commands
    for (const [key, path] of Object.entries(ROUTES)) {
      if (lower.includes(`go to ${key}`) || lower.includes(`open ${key}`) || lower.includes(`navigate to ${key}`)) {
        const msg = `Navigating to ${key}`;
        speak(msg);
        addLog(`Assistant: ${msg}`, "assistant");
        navigate(path);
        return;
      }
    }

    // Write / compose command → navigate to composer with topic
    const writeMatch = lower.match(/(?:write|compose|draft|create)\s+(?:a\s+)?(?:tweet|post|thread)?\s*(?:about|on)?\s*(.+)/);
    if (writeMatch) {
      const topic = writeMatch[1].trim();
      const msg = `Opening composer for "${topic}"`;
      speak(msg);
      addLog(`Assistant: ${msg}`, "assistant");
      navigate(`/composer?topic=${encodeURIComponent(topic)}`);
      return;
    }

    // Scroll commands
    if (lower.includes("scroll down")) { window.scrollBy({ top: 400, behavior: "smooth" }); return; }
    if (lower.includes("scroll up"))   { window.scrollBy({ top: -400, behavior: "smooth" }); return; }

    // General AI question
    setStatus("thinking");
    addLog("Assistant: thinking...", "assistant");
    try {
      const profile = (() => { try { return JSON.parse(localStorage.getItem("xpg_profile") || "{}"); } catch { return {}; } })();
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `You are the voice assistant for "X Post Guardian Pro", an AI Twitter/X content tool.
The user said: "${text}"
${profile.handle ? `User's X handle: @${profile.handle}, niche: ${profile.niche || "general"}` : ""}
Reply in 1-2 short sentences. Be helpful, direct, and friendly. If they want to create content, tell them to say "write a tweet about [topic]".`,
      });
      const reply = typeof res === "string" ? res : (res?.text || "Got it!");
      setAiReply(reply);
      speak(reply);
      addLog(`Assistant: ${reply}`, "assistant");
    } catch {
      speak("Sorry, I couldn't process that.");
    }
    setStatus("idle");
  }, [navigate, addLog]);

  // Start continuous recognition
  const startListening = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert("Voice recognition not supported in this browser. Try Chrome."); return; }

    const r = new SR();
    r.continuous = true;
    r.interimResults = true;
    r.lang = "en-US";

    let finalBuffer = "";

    r.onresult = (e) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) {
          finalBuffer += t + " ";
        } else {
          interim = t;
        }
      }
      setTranscript(interim || finalBuffer.trim());

      // Process final utterance
      if (finalBuffer.trim().length > 2) {
        const cmd = finalBuffer.trim();
        finalBuffer = "";
        handleCommand(cmd);
      }
    };

    r.onerror = (e) => {
      if (e.error !== "no-speech") addLog(`Error: ${e.error}`, "error");
    };

    r.onend = () => {
      if (manualRef.current) {
        // restart if user hasn't manually stopped
        try { r.start(); } catch {}
      } else {
        setListening(false);
        setStatus("idle");
      }
    };

    recognitionRef.current = r;
    r.start();
    setListening(true);
    setStatus("listening");
    speak("Voice assistant ready. Say a command.");
    addLog("Microphone on", "info");
  }, [handleCommand, addLog]);

  const stopListening = useCallback(() => {
    manualRef.current = false;
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setListening(false);
    setStatus("idle");
    setTranscript("");
    addLog("Microphone off", "info");
  }, [addLog]);

  const toggleMic = () => {
    if (listening) {
      stopListening();
    } else {
      manualRef.current = true;
      startListening();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      manualRef.current = false;
      recognitionRef.current?.stop();
      window.speechSynthesis?.cancel();
    };
  }, []);

  const statusColor = {
    idle: "bg-muted-foreground",
    listening: "bg-green-400",
    thinking: "bg-yellow-400",
    speaking: "bg-xblue",
  }[status] || "bg-muted-foreground";

  return (
    <>
      {/* Floating mic button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
      >
        {/* Panel */}
        <AnimatePresence>
          {active && (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.95 }}
              className="bg-card border border-border rounded-2xl shadow-2xl w-80 overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/40">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${statusColor} ${status === "listening" ? "animate-pulse" : ""}`} />
                  <span className="text-sm font-black text-white">Voice Assistant</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setShowLog(v => !v)} className="text-muted-foreground hover:text-white transition-colors">
                    {showLog ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                  </button>
                  <button onClick={() => { stopListening(); setActive(false); }} className="text-muted-foreground hover:text-white transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Transcript */}
              <div className="px-4 py-3 min-h-[56px]">
                {transcript ? (
                  <p className="text-white text-sm italic">"{transcript}"</p>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    {listening ? "Listening… say a command" : "Press the mic to start"}
                  </p>
                )}
              </div>

              {/* AI Reply */}
              <AnimatePresence>
                {aiReply && (
                  <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="mx-4 mb-3 bg-xblue/10 border border-xblue/30 rounded-xl px-3 py-2"
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <Volume2 className="w-3 h-3 text-xblue" />
                      <span className="text-xs font-bold text-xblue">Assistant</span>
                    </div>
                    <p className="text-sm text-white leading-relaxed">{aiReply}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Command hints */}
              <div className="px-4 pb-3 space-y-1">
                <p className="text-xs text-muted-foreground font-semibold mb-1.5">Try saying:</p>
                {[
                  "Go to composer",
                  "Write a tweet about consistency",
                  "Open dashboard",
                  "Go to hooks",
                ].map((hint, i) => (
                  <div key={i} className="text-xs text-muted-foreground bg-muted rounded-lg px-2.5 py-1.5">
                    "{hint}"
                  </div>
                ))}
              </div>

              {/* Mic toggle */}
              <div className="px-4 pb-4">
                <button
                  onClick={toggleMic}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-full font-bold text-sm transition-all ${
                    listening
                      ? "bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30"
                      : "bg-xblue text-black hover:bg-xblue/90"
                  }`}
                >
                  {listening ? <><MicOff className="w-4 h-4" /> Stop Listening</> : <><Mic className="w-4 h-4" /> Start Listening</>}
                </button>
              </div>

              {/* Log */}
              <AnimatePresence>
                {showLog && log.length > 0 && (
                  <motion.div
                    initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
                    className="overflow-hidden border-t border-border"
                  >
                    <div className="px-4 py-3 max-h-40 overflow-y-auto space-y-1">
                      {log.slice().reverse().map((entry, i) => (
                        <p key={i} className={`text-xs ${
                          entry.type === "user" ? "text-white" :
                          entry.type === "assistant" ? "text-xblue" :
                          entry.type === "error" ? "text-red-400" : "text-muted-foreground"
                        }`}>{entry.msg}</p>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.93 }}
          onClick={() => setActive(v => !v)}
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all ${
            listening
              ? "bg-green-500 shadow-green-500/40"
              : "bg-xblue shadow-xblue/40"
          }`}
        >
          {listening
            ? <Mic className="w-6 h-6 text-white animate-pulse" />
            : <Mic className="w-6 h-6 text-black" />
          }
        </motion.button>
      </motion.div>
    </>
  );
}