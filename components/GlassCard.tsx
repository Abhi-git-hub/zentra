/* c:\Users\hp\Desktop\Zentra\components\GlassCard.tsx */
"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  wrapperClassName?: string;
  glowColor?: string;
  liftOnHover?: boolean;
}

export default function GlassCard({ 
  children, 
  wrapperClassName = "", 
  glowColor = "rgba(0, 200, 150, 0.08)", 
  liftOnHover = false,
  ...props 
}: GlassCardProps) {
  return (
    <motion.div
      className={`relative rounded-[20px] overflow-hidden ${wrapperClassName}`}
      whileHover={liftOnHover ? { y: -12 } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      style={
        {
          background: "rgba(255, 255, 255, 0.04)",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)", // Base glass shadow
          // Use CSS custom properties for hover dynamic value passing via styled motion
          "--hover-glow": glowColor
        } as React.CSSProperties
      }
      {...props}
    >
      {/* Invisible border overlay that brightens on hover */}
      <div 
        className="absolute inset-0 rounded-[20px] pointer-events-none transition-all duration-300 group-hover:border-[1px] group-hover:border-[rgba(255,255,255,0.18)]"
        style={{
          boxShadow: "none",
        }}
      />

      {/* Internal Shimmer element triggered via the group class on hover */}
      <div className="absolute inset-0 pointer-events-none z-[-1] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
         <div 
           className="w-full h-full"
           style={{
             background: `conic-gradient(from 180deg at 50% 50%, var(--hover-glow) 0deg, transparent 60deg, transparent 300deg, var(--hover-glow) 360deg)`,
             animation: "borderShimmer 4s linear infinite"
           }}
         />
      </div>

      <div className="relative z-10 h-full">
        {children}
      </div>
    </motion.div>
  );
}
