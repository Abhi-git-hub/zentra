"use client";

import * as React from "react";
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import type { BehaviorTag } from "@/lib/behaviorEngine";

type TradeRow = { behavior_tag: string | null };

type Props = {
  trades: TradeRow[];
};

const TAGS: BehaviorTag[] = [
  "DISCIPLINED",
  "PANIC_SELL",
  "FOMO_BUY",
  "OVERTRADE",
  "LOSS_HOLDING",
];

const AXIS_SHORT: Record<BehaviorTag, string> = {
  DISCIPLINED: "Disciplined",
  PANIC_SELL: "Panic",
  FOMO_BUY: "FOMO",
  OVERTRADE: "Overtrade",
  LOSS_HOLDING: "Loss hold",
};

function computePercentages(trades: TradeRow[]): { subject: string; value: number; fullMark: number }[] {
  const tagged = trades.filter((t) => t.behavior_tag && TAGS.includes(t.behavior_tag as BehaviorTag));
  const n = tagged.length;
  if (n === 0) {
    return TAGS.map((tag) => ({
      subject: `0% · ${AXIS_SHORT[tag]}`,
      value: 0,
      fullMark: 100,
    }));
  }
  const counts: Record<BehaviorTag, number> = {
    DISCIPLINED: 0,
    PANIC_SELL: 0,
    FOMO_BUY: 0,
    OVERTRADE: 0,
    LOSS_HOLDING: 0,
  };
  for (const t of tagged) {
    const tag = t.behavior_tag as BehaviorTag;
    if (TAGS.includes(tag)) counts[tag] += 1;
  }
  return TAGS.map((tag) => {
    const value = Math.round((counts[tag] / n) * 1000) / 10;
    return {
      subject: `${value}% · ${AXIS_SHORT[tag]}`,
      value,
      fullMark: 100,
    };
  });
}

export default function BehaviorRadar({ trades }: Props) {
  const data = React.useMemo(() => computePercentages(trades), [trades]);

  return (
    <div style={{ width: "100%", height: 280 }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="var(--border)" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: "var(--text-secondary)", fontSize: 11 }}
          />
          <Radar
            name="Psychology"
            dataKey="value"
            stroke="var(--accent-ai)"
            fill="var(--accent-ai)"
            fillOpacity={0.3}
          />
          <Tooltip
            contentStyle={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              color: "var(--text-primary)",
            }}
            formatter={(value) => [`${typeof value === "number" ? value : Number(value) || 0}%`, "Share"]}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
