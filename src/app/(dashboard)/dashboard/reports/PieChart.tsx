"use client";

export default function PieChart({
  data,
}: {
  data: { label: string; value: number; color: string }[];
}) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  let angle = 0;
  const cx = 60;
  const cy = 60;
  const r = 54;

  function arcPath(startAngle: number, endAngle: number) {
    const rad = (a: number) => (a * Math.PI) / 180;
    const x1 = cx + r * Math.cos(rad(startAngle));
    const y1 = cy + r * Math.sin(rad(startAngle));
    const x2 = cx + r * Math.cos(rad(endAngle));
    const y2 = cy + r * Math.sin(rad(endAngle));
    const large = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
  }

  return (
    <svg width={120} height={120} viewBox="0 0 120 120">
      {data.map((d, i) => {
        const slice = (d.value / total) * 360;
        const pathD = arcPath(angle, angle + slice);
        const mid = angle + slice / 2;
        angle += slice;
        return (
          <path
            key={i}
            d={pathD}
            fill={d.color}
            stroke="hsl(var(--border-primary))"
            strokeWidth={0.5}
          />
        );
      })}
      <circle cx={cx} cy={cy} r={34} fill="hsl(var(--background-secondary))" />
    </svg>
  );
}


