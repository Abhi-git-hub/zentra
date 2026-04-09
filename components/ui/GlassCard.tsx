"use client";

import React from "react";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  glow?: string;
  className?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, glow, className = "", style, ...props }) => {
  return (
    <div
      className={`glass-card-base ${className}`}
      style={{
        ...(glow ? { boxShadow: `0 0 40px ${glow}` } : {}),
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};
