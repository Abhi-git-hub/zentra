"use client";

import React, { useEffect, useState } from "react";
import { ResponsiveContainer, AreaChart as RechartsAreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import { useTheme } from "next-themes";
import { CandleData } from "./CandleChart3D";

// Recharts doesn't resolve CSS custom properties — use resolved hex colors
const ACCENT_COLORS: Record<string, { stroke: string; fill: string }> = {
  dark: { stroke: "#22c55e", fill: "#22c55e" },
  light: { stroke: "#10b981", fill: "#10b981" },
  neon: { stroke: "#00ff94", fill: "#00ff94" },
};

export const AreaChart = ({ data }: { data: CandleData[] }) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  
  const resolvedTheme = mounted ? (theme || "dark") : "dark";
  const colors = ACCENT_COLORS[resolvedTheme] || ACCENT_COLORS.dark;
  const axisStroke = resolvedTheme === "light" ? "#a1a1aa" : "#52525b";
  
  return (
    <div className="w-full h-full min-h-[500px]">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsAreaChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorClose" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colors.fill} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={colors.fill} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="date" stroke={axisStroke} tickFormatter={(val) => val.split(" ")[0] || val} />
          <YAxis domain={["auto", "auto"]} stroke={axisStroke} />
          <Tooltip 
            contentStyle={{ 
              background: "rgba(10, 25, 15, 0.9)", 
              border: "1px solid rgba(34, 197, 94, 0.2)", 
              borderRadius: "12px", 
              backdropFilter: "blur(20px)",
              color: "#ffffff",
            }} 
            itemStyle={{ color: "#a7f3d0" }}
          />
          <Area type="monotone" dataKey="close" stroke={colors.stroke} strokeWidth={2} fillOpacity={1} fill="url(#colorClose)" />
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AreaChart;
