"use client";

import React from "react";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  glow?: string;
  className?: string;
  premium?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, glow, className = "", style, premium, ...props }) => {
  return (
    <div
      className={`${premium ? 'glass-card-premium' : 'glass-card-base'} ${className}`}
      style={{
        ...(glow ? { boxShadow: `0 0 40px ${glow}, 0 0 80px ${glow.replace(/[\d.]+\)$/, '0.05)')}` } : {}),
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};
