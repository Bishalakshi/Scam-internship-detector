export default function RiskGauge({ score, bucket }) {
  const center = { x: 100, y: 108 };
  const angle = (score / 100) * 180 - 90; // -90 (score 0) -> +90 (score 100)

  const bucketColor =
    bucket === "High Risk" ? "#D6483E" : bucket === "Medium Risk" ? "#E8A23D" : "#4F9D6E";

  const ticks = Array.from({ length: 11 }, (_, i) => i); // 0..10 -> 0..100 in steps of 10

  const tickColor = (i) => {
    const value = i * 10;
    if (value >= 60) return "#D6483E";
    if (value >= 30) return "#E8A23D";
    return "#4F9D6E";
  };

  const polarToCartesian = (cx, cy, r, angleDeg) => {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  return (
    <div className="flex flex-col items-center select-none">
      <svg viewBox="0 0 200 120" className="w-64 sm:w-80">
        {/* base arc track */}
        <path
          d="M 14 108 A 86 86 0 0 1 186 108"
          fill="none"
          stroke="#1E2A45"
          strokeWidth="10"
          strokeLinecap="round"
        />

        {/* tick marks */}
        {ticks.map((i) => {
          const tickAngle = (i / 10) * 180 - 90;
          const inner = polarToCartesian(center.x, center.y, 78, tickAngle);
          const outer = polarToCartesian(center.x, center.y, 92, tickAngle);
          return (
            <line
              key={i}
              x1={inner.x}
              y1={inner.y}
              x2={outer.x}
              y2={outer.y}
              stroke={tickColor(i)}
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.9"
            />
          );
        })}

        {/* needle */}
        <g
          style={{
            transform: `rotate(${angle}deg)`,
            transformOrigin: `${center.x}px ${center.y}px`,
            transition: "transform 900ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          <line
            x1={center.x}
            y1={center.y}
            x2={center.x}
            y2={center.y - 68}
            stroke="#F6F1E4"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </g>
        <circle cx={center.x} cy={center.y} r="6" fill="#F6F1E4" />
        <circle cx={center.x} cy={center.y} r="2.5" fill="#11182B" />
      </svg>

      <div className="font-mono text-5xl font-semibold mt-1" style={{ color: bucketColor }}>
        {score}
      </div>
      <div
        className="font-display text-sm tracking-[0.2em] uppercase mt-1"
        style={{ color: bucketColor }}
      >
        {bucket}
      </div>
    </div>
  );
}