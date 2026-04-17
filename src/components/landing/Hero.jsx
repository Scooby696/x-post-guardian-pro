import { motion } from "framer-motion";
import { Shield, Zap, ArrowDown } from "lucide-react";

export default function Hero({ onAnalyzeClick }) {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-xblue/10 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 max-w-4xl mx-auto"
      >
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-xblue/10 border border-xblue/30 text-xblue px-4 py-2 rounded-full text-sm font-semibold mb-8">
          <Zap className="w-4 h-4" />
          2026 X/Twitter Rules — Always Updated
        </div>

        <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
          <span className="text-white">Never Get</span>
          <br />
          <span className="text-xblue">Suspended Again</span>
        </h1>

        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          Real-time X/Twitter rule analysis. Paste your tweet, get an instant risk score, and post with confidence.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={onAnalyzeClick}
            className="bg-xblue text-black font-bold text-lg px-10 py-4 rounded-full hover:bg-xblue/90 transition-all animate-pulse-glow"
          >
            🛡️ Analyze My Tweet — Free
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
            className="border border-border text-white font-semibold text-lg px-10 py-4 rounded-full hover:border-xblue/50 transition-all"
          >
            View Pricing
          </motion.button>
        </div>

        {/* Stats */}
        <div className="flex flex-col sm:flex-row gap-8 justify-center mt-16 text-center">
          {[
            { val: "6", label: "Rule Categories Checked" },
            { val: "Real-time", label: "Instant Analysis" },
            { val: "2026", label: "Rules Always Current" },
          ].map((s, i) => (
            <div key={i} className="flex flex-col">
              <span className="text-3xl font-black text-xblue">{s.val}</span>
              <span className="text-muted-foreground text-sm mt-1">{s.label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground"
      >
        <ArrowDown className="w-5 h-5" />
      </motion.div>
    </section>
  );
}