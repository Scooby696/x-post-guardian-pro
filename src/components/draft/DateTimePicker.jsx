import { Calendar, Clock } from "lucide-react";

export default function DateTimePicker({ value, onChange }) {
  // value is a string like "2026-04-22T09:00" (local datetime)
  const now = new Date();
  // min = now + 5 minutes, formatted for datetime-local input
  const min = new Date(now.getTime() + 5 * 60 * 1000);
  const pad = n => String(n).padStart(2, "0");
  const minStr = `${min.getFullYear()}-${pad(min.getMonth() + 1)}-${pad(min.getDate())}T${pad(min.getHours())}:${pad(min.getMinutes())}`;

  return (
    <div className="space-y-3">
      <label className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
        <Calendar className="w-4 h-4 text-xblue" />
        Pick a date and time
      </label>
      <input
        type="datetime-local"
        value={value || ""}
        min={minStr}
        onChange={e => onChange(e.target.value || null)}
        className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-xblue/60 transition-colors [color-scheme:dark]"
      />
      {value && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="w-3.5 h-3.5 text-xblue" />
          Scheduled for{" "}
          <span className="text-white font-semibold">
            {new Date(value).toLocaleString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}
          </span>
        </div>
      )}
    </div>
  );
}