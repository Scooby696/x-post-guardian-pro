const SIZE = 28;
const STROKE = 3;
const R = (SIZE - STROKE) / 2;
const CIRC = 2 * Math.PI * R;

export default function CharacterRing({ used, limit }) {
  const pct = Math.min(used / limit, 1);
  const dash = pct * CIRC;
  const isOver = used > limit;
  const isNear = !isOver && limit - used <= 20;

  const color = isOver ? "#f87171" : isNear ? "#facc15" : "#38bdf8";

  return (
    <svg width={SIZE} height={SIZE} style={{ transform: "rotate(-90deg)" }}>
      {/* Track */}
      <circle
        cx={SIZE / 2}
        cy={SIZE / 2}
        r={R}
        fill="none"
        stroke="#ffffff18"
        strokeWidth={STROKE}
      />
      {/* Progress */}
      <circle
        cx={SIZE / 2}
        cy={SIZE / 2}
        r={R}
        fill="none"
        stroke={color}
        strokeWidth={STROKE}
        strokeDasharray={`${Math.min(dash, CIRC)} ${CIRC}`}
        strokeLinecap="round"
        style={{ transition: "stroke-dasharray 0.15s, stroke 0.2s" }}
      />
    </svg>
  );
}