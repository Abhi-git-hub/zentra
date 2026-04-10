/* c:\Users\hp\Desktop\Zentra\components\ScenarioCard.tsx */
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import GlassCard from "./GlassCard";

interface Stat {
  label: string;
  value: string;
}

interface ScenarioCardProps {
  id: string;
  name: string;
  difficulty: "Beginner" | "Intermediate" | "Expert";
  context: string;
  accentColor: string; // e.g. #FF3B5C
  glowShadowColor: string; // e.g. rgba(255, 59, 92, 0.15)
  hoverGlowShadowColor: string; // e.g. rgba(255, 59, 92, 0.3)
  sparklinePath: string;
  stats: Stat[];
}

export default function ScenarioCard({
  id,
  name,
  difficulty,
  context,
  accentColor,
  glowShadowColor,
  hoverGlowShadowColor,
  sparklinePath,
  stats
}: ScenarioCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="flex-1 flex flex-col min-w-[320px] min-h-[480px]"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -12 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <GlassCard 
        className="group flex-1 flex flex-col p-8 transition-shadow duration-300"
        wrapperClassName="h-full flex flex-col"
        glowColor={accentColor}
        style={{
          boxShadow: isHovered 
            ? `0 4px 30px rgba(0,0,0,0.1), 0 -2px 60px ${hoverGlowShadowColor}`
            : `0 4px 30px rgba(0,0,0,0.1), 0 -2px 60px ${glowShadowColor}`
        }}
      >
        <div className="flex flex-col h-full relative z-10 w-full group">
          {/* Difficulty Pill */}
          <div 
            className="self-start rounded-full px-3 py-1 text-[12px] font-bold uppercase tracking-wider mb-5"
            style={{ 
              backgroundColor: `color-mix(in srgb, ${accentColor} 12%, transparent)`,
              color: accentColor,
              border: `1px solid color-mix(in srgb, ${accentColor} 20%, transparent)`
            }}
          >
            {difficulty}
          </div>

          {/* Scenario Name */}
          <h3 className="text-[28px] font-bold text-white mb-3 tracking-tight">
            {name}
          </h3>

          {/* Context Paragraph */}
          <p className="text-[15px] leading-[1.7] text-[rgba(255,255,255,0.6)] mb-6">
            {context}
          </p>

          <div className="w-full h-[1px] bg-[rgba(255,255,255,0.06)] mb-6" />

          {/* Sparkline SVG */}
          <div className="w-full flex justify-center mb-6 h-[60px]">
            <svg width="200" height="60" viewBox="0 0 200 60" className="opacity-80 group-hover:opacity-100 transition-opacity">
              <path 
                d={sparklinePath} 
                stroke={accentColor} 
                strokeWidth="2" 
                fill="none" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
            </svg>
          </div>

          {/* Stats Pills */}
          <div className="flex row gap-2 mb-8 mt-auto justify-center">
            {stats.map((stat, i) => (
              <div 
                key={i} 
                className="flex flex-col items-center justify-center bg-[rgba(0,0,0,0.3)] rounded-lg py-2 px-3 border border-[rgba(255,255,255,0.04)]"
              >
                <div className="text-[10px] uppercase text-[rgba(255,255,255,0.4)] tracking-wider mb-1">{stat.label}</div>
                <div className="font-mono-num text-[13px] text-white font-bold">{stat.value}</div>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <Link href={`/dashboard/scenario/${id}`} className="w-full mt-auto block">
            <button 
              className="w-full rounded-[12px] py-4 text-black font-bold text-[15px] transition-transform active:scale-95 shadow-[0_0_20px_rgba(0,0,0,0)] hover:shadow-[0_0_30px_var(--hover-btn-glow)]"
              style={{ 
                background: `linear-gradient(135deg, ${accentColor}, color-mix(in srgb, ${accentColor} 80%, black))`,
                "--hover-btn-glow": `color-mix(in srgb, ${accentColor} 40%, transparent)`
              } as React.CSSProperties}
            >
              Enter Scenario
            </button>
          </Link>
        </div>
      </GlassCard>
    </motion.div>
  );
}
