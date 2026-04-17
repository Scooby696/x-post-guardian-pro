const HOOKS = [
  "Start with a bold statement or question to stop the scroll.",
  "Open with a surprising statistic (e.g. '95% of people don't know this...').",
  "Use 'Hot take:' or 'Unpopular opinion:' to invite engagement.",
  "Lead with the payoff — put your most interesting line first.",
];

const FORMAT_TIPS = [
  "Break into a thread (1/n) — threads get 3–5x more impressions in 2026.",
  "Use line breaks between every 1–2 sentences for mobile readability.",
  "Add a numbered list (1. 2. 3.) — lists are highly shareable.",
  "Bold your key phrase using *asterisks* (rendered on some clients).",
];

const ENGAGEMENT_TIPS = [
  "End with a direct question to drive replies (e.g. 'What do you think?').",
  "Add a clear CTA at the end: 'Repost if this helped someone you know.'",
  "Tag 1 relevant person (not more) to pull them into the conversation.",
  "Use 1–2 relevant hashtags max — more than 2 hurts reach in 2026.",
];

const CONTENT_TIPS = [
  "Add a personal angle — 'I learned this the hard way...' performs best.",
  "Include a specific number: '3 years ago' beats 'a few years ago'.",
  "Add an image or short video — visual posts get 2x impressions.",
  "Avoid all-lowercase or all-caps — mixed case reads best on X.",
];

function pickRandom(arr, n = 1) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

export function getGrowthTips(text) {
  const tips = [];
  const lower = text.toLowerCase();

  // Hook check
  const hasHook = /^(hot take|unpopular|breaking|just learned|thread|🧵|\d+\s*(ways|tips|reasons|things))/i.test(text.trim());
  if (!hasHook) {
    tips.push({ category: "Hook", tip: pickRandom(HOOKS)[0] });
  }

  // Thread format check
  const isThread = /\d\/\d|\d\/n|🧵/i.test(text);
  if (!isThread && text.length > 180) {
    tips.push({ category: "Format", tip: "Your post is long — consider splitting into a thread (1/n) for higher reach." });
  } else {
    tips.push({ category: "Format", tip: pickRandom(FORMAT_TIPS)[0] });
  }

  // CTA / engagement check
  const hasCTA = /\?|reply|repost|share|follow|think|comment/i.test(text);
  if (!hasCTA) {
    tips.push({ category: "Engagement", tip: pickRandom(ENGAGEMENT_TIPS)[0] });
  }

  // Hashtag check
  const hashtagCount = (text.match(/#\w+/g) || []).length;
  if (hashtagCount === 0) {
    tips.push({ category: "Discovery", tip: "Add 1–2 relevant hashtags to boost discovery without hurting reach." });
  } else if (hashtagCount > 3) {
    tips.push({ category: "Discovery", tip: "You have 4+ hashtags — trim to 1–2. Over-tagging hurts reach in 2026." });
  }

  // Always add one content tip
  tips.push({ category: "Content", tip: pickRandom(CONTENT_TIPS)[0] });

  return tips.slice(0, 4); // max 4 tips
}