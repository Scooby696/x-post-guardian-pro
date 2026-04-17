// Prime Posting Times logic from Growth Guide
// Weekdays 8–10am, 12–1pm, 6–9pm. Wed/Thu best. Sunday 7–9pm bonus.

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const WEEKDAY_SLOTS = [
  { label: "Morning Peak", time: "08:00", desc: "8–10am — highest reach window" },
  { label: "Lunch Peak",   time: "12:00", desc: "12–1pm — midday engagement spike" },
  { label: "Evening Peak", time: "18:00", desc: "6–9pm — post-work scroll time" },
];

const SUNDAY_SLOTS = [
  { label: "Sunday Evening", time: "19:00", desc: "7–9pm — low competition, high leisure scrolling" },
];

export function getPrimeSlots(fromDate = new Date()) {
  const slots = [];
  const base = new Date(fromDate);
  base.setSeconds(0, 0);

  // Generate slots for the next 7 days
  for (let d = 0; d < 7; d++) {
    const day = new Date(base);
    day.setDate(base.getDate() + d);
    const dayOfWeek = day.getDay(); // 0=Sun, 6=Sat
    const dayName = DAYS[dayOfWeek];
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isSunday = dayOfWeek === 0;
    const isSaturday = dayOfWeek === 6;
    const isPrime = dayOfWeek === 3 || dayOfWeek === 4; // Wed/Thu

    if (isSaturday) continue; // skip Saturdays (worst day)

    const timeSlots = isSunday ? SUNDAY_SLOTS : WEEKDAY_SLOTS;

    timeSlots.forEach(slot => {
      const [h, m] = slot.time.split(":").map(Number);
      const dt = new Date(day);
      dt.setHours(h, m, 0, 0);

      // Skip times already passed
      if (dt <= new Date()) return;

      slots.push({
        id: `${dt.toISOString()}-${slot.label}`,
        datetime: dt.toISOString(),
        dayName,
        label: slot.label,
        desc: slot.desc,
        isPrime,
        isSunday,
        displayDate: dt.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
        displayTime: dt.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }),
      });
    });
  }

  return slots.slice(0, 12); // max 12 upcoming slots
}

const STORAGE_KEY = "xrg_scheduled_tweets";

export function getScheduledTweets() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveScheduledTweet(tweet) {
  const existing = getScheduledTweets();
  const updated = [tweet, ...existing];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function deleteScheduledTweet(id) {
  const existing = getScheduledTweets();
  const updated = existing.filter(t => t.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function updateScheduledTweetStatus(id, status) {
  const existing = getScheduledTweets();
  const updated = existing.map(t => t.id === id ? { ...t, status } : t);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}