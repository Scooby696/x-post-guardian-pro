import { motion } from "framer-motion";
import { Check, Zap } from "lucide-react";

const STRIPE_LINKS = {
  monthly: "https://buy.stripe.com/your_monthly_link_here",
  yearly: "https://buy.stripe.com/your_yearly_link_here",
  lifetime: "https://buy.stripe.com/your_lifetime_link_here",
};

const plans = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    highlight: false,
    popular: false,
    cta: "Get Started Free",
    ctaStyle: "border border-border text-white hover:border-xblue/50",
    features: [
      "15 analyses per day",
      "Risk score + issue detection",
      "Fix suggestions",
      "All 6 rule categories",
    ],
  },
  {
    id: "monthly",
    name: "Pro Monthly",
    price: "$4.99",
    period: "/month",
    highlight: false,
    popular: false,
    cta: "Upgrade — $4.99/mo",
    ctaStyle: "bg-white/10 text-white hover:bg-white/20 border border-white/20",
    features: [
      "Unlimited analyses",
      "Risk score + issue detection",
      "Fix suggestions",
      "All 6 rule categories",
      "Priority rule updates",
    ],
  },
  {
    id: "yearly",
    name: "Pro Yearly",
    price: "$39.99",
    period: "/year",
    highlight: true,
    popular: true,
    cta: "Upgrade — $39.99/yr",
    ctaStyle: "bg-xblue text-black font-black hover:bg-xblue/90",
    badge: "MOST POPULAR",
    savingsBadge: "Save 33%",
    features: [
      "Unlimited analyses",
      "Risk score + issue detection",
      "Fix suggestions",
      "All 6 rule categories",
      "Priority rule updates",
      "Early access to new features",
    ],
  },
  {
    id: "lifetime",
    name: "Lifetime",
    price: "$79",
    period: "one-time",
    highlight: false,
    popular: false,
    cta: "Unlock Forever",
    ctaStyle: "bg-amber-500 text-black font-black hover:bg-amber-400",
    badge: "BEST DEAL",
    features: [
      "Everything in Pro",
      "Lifetime updates",
      "Never pay again",
      "Priority support",
    ],
  },
];

export default function Pricing({ onUpgradeClick }) {
  return (
    <section id="pricing" className="py-24 px-6 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-black text-white mb-4">Simple, Transparent Pricing</h2>
          <p className="text-muted-foreground text-lg">
            Start free. Upgrade when you need unlimited power.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`relative rounded-2xl p-6 flex flex-col h-full transition-all ${
                plan.highlight
                  ? "bg-xblue/5 border-2 border-xblue glow-xblue"
                  : "bg-card border border-border"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-xblue text-black text-xs font-black px-4 py-1 rounded-full whitespace-nowrap">
                  MOST POPULAR
                </div>
              )}
              {plan.badge && !plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-black text-xs font-black px-4 py-1 rounded-full whitespace-nowrap">
                  {plan.badge}
                </div>
              )}

              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-white text-lg">{plan.name}</h3>
                  {plan.savingsBadge && (
                    <span className="text-xs font-bold text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">
                      {plan.savingsBadge}
                    </span>
                  )}
                </div>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-black text-white">{plan.price}</span>
                  <span className="text-muted-foreground text-sm pb-1">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-3 flex-1 mb-6">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-xblue flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => {
                  if (plan.id === "free") {
                    document.getElementById("analyzer")?.scrollIntoView({ behavior: "smooth" });
                  } else {
                    window.open(STRIPE_LINKS[plan.id], "_blank");
                  }
                }}
                className={`w-full py-3 rounded-full text-sm font-bold transition-all ${plan.ctaStyle}`}
              >
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-muted-foreground text-sm mt-8"
        >
          Already purchased?{" "}
          <button
            onClick={onUpgradeClick}
            className="text-xblue hover:underline font-semibold"
          >
            Enter your license key here
          </button>
        </motion.p>
      </div>
    </section>
  );
}