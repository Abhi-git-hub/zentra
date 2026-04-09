"use client";

import React from "react";
import { ResponsiveContainer, ComposedChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";
import { useTheme } from "next-themes";
import { CandleData } from "./CandleChart3D";

// Recharts 2D Candle implementation using ComposedChart with generic Bars
// We create custom shapes for candles.
const Candle = (props: any) => {
  const { x, y, width, height, payload } = props;
  const { open, close, high, low } = payload;
  const isUp = close >= open;
  const color = isUp ? "#22c55e" : "#ef4444";
  
  if (x == null || y == null) return null;

  // Since we mapped data to [low, high], y = high and y+height = low
  const priceRange = high - low;
  const pixelsPerPrice = priceRange > 0 ? height / priceRange : 0;

  const yTop = y;
  const yBottom = y + height;

  // The actual body positions:
  const maxPrice = Math.max(open, close);
  const minPrice = Math.min(open, close);
  const bodyTop = y + (high - maxPrice) * pixelsPerPrice;
  const bodyHeight = (maxPrice - minPrice) * pixelsPerPrice;

  const offset = width / 2;

  return (
    <g>
      <line x1={x + offset} y1={yBottom} x2={x + offset} y2={yTop} stroke={color} strokeWidth={2} />
      <rect x={x} y={bodyTop} width={width} height={Math.max(bodyHeight, 2)} fill={color} rx={2} ry={2} />
    </g>
  );
};

export const CandleChart2D = ({ data }: { data: CandleData[] }) => {
  const { theme } = useTheme();
  const isLight = theme === "light";

  // Formatter for Candle chart needs an array of [low, high] for each bar to set the domain correctly
  const chartData = data.map(d => ({
    ...d,
    candleValues: [d.low, d.high],
  }));

  return (
    <div className="w-full h-full min-h-[500px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <XAxis dataKey="date" stroke={isLight ? "#a1a1aa" : "#52525b"} />
          <YAxis domain={["auto", "auto"]} stroke={isLight ? "#a1a1aa" : "#52525b"} />
          <Tooltip 
             contentStyle={{ 
              background: "var(--bg-glass)", 
              border: "1px solid var(--border-glass)", 
              borderRadius: "12px", 
              backdropFilter: "blur(20px)" 
            }} 
          />
          <Bar dataKey="candleValues" shape={<Candle />} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CandleChart2D;
