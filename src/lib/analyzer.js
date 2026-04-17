const rulesDB = [
  { id: "violent", regex: /\b(kill|die|threat|rape|bomb|terror|execute)\b/i, penalty: 45, msg: "Violent language detected" },
  { id: "harassment", regex: /@\w+/gi, count: 4, penalty: 35, msg: "Heavy @ targeting / harassment risk" },
  { id: "spam", regex: /https?:\/\//gi, count: 4, penalty: 30, msg: "Too many links → spam flag" },
  { id: "paid", regex: /(paid|sponsor|ad|promo|affiliate)/i, penalty: 40, msg: "Missing #PaidPromotion label" },
  { id: "automation", regex: /\b(follow|like|rt|retweet|mass|auto|bot|1000)\b/i, penalty: 50, msg: "Automation / bot language" },
  { id: "impersonation", regex: /(impersonat|fake account|pretend to be)/i, penalty: 30, msg: "Impersonation risk" }
];

export function analyzeDraft(text) {
  let score = 100;
  const issues = [];
  const lower = text.toLowerCase();

  rulesDB.forEach(rule => {
    const matches = text.match(rule.regex) || [];
    if ((rule.count && matches.length >= rule.count) || (!rule.count && matches.length > 0)) {
      issues.push(rule.msg);
      score -= rule.penalty;
    }
  });

  if (lower.includes("paid") && !/#(paid|ad|promo)/i.test(lower)) {
    if (!issues.includes("Missing #PaidPromotion label")) {
      issues.push("Add #PaidPromotion label (2026 enforcement)");
      score -= 25;
    }
  }

  const finalScore = Math.max(5, score);
  let level = "safe";
  if (finalScore <= 60) level = "danger";
  else if (finalScore <= 80) level = "warning";

  return {
    score: finalScore,
    level,
    issues: [...new Set(issues)],
    timestamp: Date.now()
  };
}

export function getRewriteSuggestions(issues) {
  const suggestions = {
    "Violent language detected": "Replace aggressive words with neutral alternatives (e.g., 'concerned about' instead of 'threatening').",
    "Heavy @ targeting / harassment risk": "Reduce direct @mentions. Consider discussing topics without tagging multiple users.",
    "Too many links → spam flag": "Limit to 1–2 links per post. Use link shorteners or thread follow-ups instead.",
    "Missing #PaidPromotion label": "Add #PaidPromotion, #Ad, or #Sponsored clearly at the start of your post.",
    "Add #PaidPromotion label (2026 enforcement)": "Add #PaidPromotion, #Ad, or #Sponsored clearly at the start of your post.",
    "Automation / bot language": "Avoid words like 'follow back', 'RT for RT', 'auto'. Phrase organically.",
    "Impersonation risk": "Clearly identify yourself. Parody accounts must state 'parody' in the name/bio."
  };

  return issues.map(issue => ({
    issue,
    fix: suggestions[issue] || "Review X's community guidelines for this type of content."
  }));
}