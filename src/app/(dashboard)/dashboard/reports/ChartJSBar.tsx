"use client";

import {
  Chart as ChartJS,
  BarElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, LinearScale, CategoryScale, Tooltip, Legend);

export default function ChartJSBar({
  labels,
  series,
  stacked = false,
  labelMap,
}: {
  labels: string[];
  series: { label: string; data: number[]; color: string; hidden?: boolean }[];
  stacked?: boolean;
  labelMap?: Record<string, string>;
}) {
  function resolveColor(input: string): string {
    const match = input.match(/var\((--[^)]+)\)/);
    if (match) {
      const cssVal = getComputedStyle(document.documentElement).getPropertyValue(match[1]).trim();
      if (cssVal) return `hsl(${cssVal})`;
    }
    return input;
  }

  const data = {
    labels,
    datasets: series.map((s) => {
      const stroke = resolveColor(s.color);
      return {
        label: s.label,
        data: s.data,
        backgroundColor: stroke,
        borderColor: stroke,
        borderWidth: 1,
        borderRadius: 4,
        hidden: s.hidden,
        stack: stacked ? "status" : undefined,
      } as const;
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
            const finalLabel = labelMap?.[key] ?? key;
            return `${finalLabel}: ${numberFmt.format(value)}`;
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

  return <Bar data={data} options={options} />;
}




