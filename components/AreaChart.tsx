"use client";

import React from "react";
import { ResponsiveContainer, AreaChart as RechartsAreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import { useTheme } from "next-themes";
import { CandleData } from "./CandleChart3D";

// Recharts Area Chart
export const AreaChart = ({ data }: { data: CandleData[] }) => {
  const { theme } = useTheme();
  
  const isLight = theme === "light";
  const strokeColor = "var(--accent-up)"; // Assuming it is green by default or dynamic if we want to pass accent Color
  
  return (
    <div className="w-full h-full min-h-[500px]">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsAreaChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorClose" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={strokeColor} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={strokeColor} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="date" stroke={isLight ? "#a1a1aa" : "#52525b"} tickFormatter={(val) => val.split(" ")[0] || val} />
          <YAxis domain={["auto", "auto"]} stroke={isLight ? "#a1a1aa" : "#52525b"} />
          <Tooltip 
            contentStyle={{ 
              background: "var(--bg-glass)", 
              border: "1px solid var(--border-glass)", 
              borderRadius: "12px", 
              backdropFilter: "blur(20px)" 
            }} 
            itemStyle={{ color: "var(--text-primary)" }}
          />
          <Area type="monotone" dataKey="close" stroke={strokeColor} fillOpacity={1} fill="url(#colorClose)" />
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AreaChart;
