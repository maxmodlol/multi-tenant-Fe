"use client";

import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, Filler);

export default function ChartJSLine({
  labels,
  series,
  stacked = false,
}: {
  labels: string[];
  series: { label: string; data: number[]; color: string; hidden?: boolean }[];
  stacked?: boolean;
}) {
  function resolveColor(input: string): string {
    // Accept direct colors (e.g., "#fff", "rgb(...)"), and hsl(var(--token))
    const match = input.match(/var\((--[^)]+)\)/);
    if (match) {
      const cssVal = getComputedStyle(document.documentElement).getPropertyValue(match[1]).trim();
      if (cssVal) return `hsl(${cssVal})`;
    }
    return input;
  }
  function withAlpha(hslColor: string, alpha = 0.18): string {
    // Expect either hsl(…) or hsla(…); convert hsl(H S% L%) to hsla(H S% L% / alpha)
    const m = hslColor.match(/hsl\(([^)]+)\)/);
    if (m) return `hsla(${m[1]} / ${alpha})`;
    const n = hslColor.match(/hsla\(([^)]+)\)/);
    if (n) return hslColor;
    return hslColor;
  }
  const data = {
    labels,
    datasets: series.map((s) => {
      const stroke = resolveColor(s.color);
      const fill = withAlpha(stroke, 0.18);
      return {
        label: s.label,
        data: s.data,
        borderColor: stroke,
        backgroundColor: fill,
        tension: 0.35,
        fill: true,
        pointRadius: 2,
        pointHoverRadius: 4,
        borderWidth: 2,
        hidden: s.hidden,
        stack: stacked ? "status" : undefined,
      };
    }),
  };
  const numberFmt = new Intl.NumberFormat(undefined);
  function formatDay(d: string): string {
    try {
      const date = new Date(d + "T00:00:00Z");
      return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(date);
    } catch {
      return d;
    }
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" as const, labels: { boxWidth: 10 } },
      tooltip: {
        mode: "index" as const,
        intersect: false,
        callbacks: {
          title: (items: any) => {
            const l = items?.[0]?.label ?? "";
            return formatDay(l);
          },
          label: (context: any) => {
            const key = context.dataset?.label ?? "";
            const value = context.parsed?.y ?? context.raw ?? 0;
            return `${key}: ${numberFmt.format(value)}`;
          },
        },
      },
    },
    interaction: { mode: "index" as const, intersect: false },
    scales: {
      x: { grid: { color: "hsla(var(--border-primary))" } },
      y: { grid: { color: "hsla(var(--border-primary))" }, beginAtZero: true, stacked },
    },
  } as const;
  return <Line data={data} options={options} />;
}
