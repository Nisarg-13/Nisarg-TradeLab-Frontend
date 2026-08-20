const DEFAULT_POINTS = [42, 48, 45, 52, 58, 55, 63, 68, 64, 72, 78, 84, 88, 92];

export function EquitySparkline({
  className = "h-40 w-full",
  gradientId = "landing-equity-fill",
  points = DEFAULT_POINTS,
}: {
  className?: string;
  gradientId?: string;
  points?: number[];
}) {
  const width = 640;
  const height = 180;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const polyline = points
    .map((value, index) => {
      const x = (index / (points.length - 1)) * width;
      const y = height - ((value - min) / range) * (height - 28) - 14;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      role="img"
      aria-label="Sample equity curve"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="rgb(47 140 255 / 0.4)" />
          <stop offset="100%" stopColor="rgb(47 140 255 / 0)" />
        </linearGradient>
      </defs>
      <polygon
        fill={`url(#${gradientId})`}
        points={`0,${height} ${polyline} ${width},${height}`}
      />
      <polyline
        fill="none"
        stroke="rgb(47 140 255)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={polyline}
      />
    </svg>
  );
}
