'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getUserLevel, getLevelProgress } from '@/lib/gamification';

interface XPDisplayProps {
  xp: number;
  className?: string;
}

export default function XPDisplay({ xp, className = '' }: XPDisplayProps) {
  const [displayXP, setDisplayXP] = useState(xp);
  const [showAnimation, setShowAnimation] = useState(false);
  const [prevXP, setPrevXP] = useState(xp);
  const levelInfo = getUserLevel(displayXP);
  const progress = getLevelProgress(displayXP);

  useEffect(() => {
    if (xp !== prevXP) {
      setShowAnimation(true);
      const delta = xp - prevXP;
      const steps = Math.abs(delta);
      const increment = delta > 0 ? 1 : -1;
      let current = prevXP;

      const interval = setInterval(() => {
        current += increment;
        setDisplayXP(current);
        if ((delta > 0 && current >= xp) || (delta < 0 && current <= xp)) {
          setDisplayXP(xp);
          clearInterval(interval);
          setPrevXP(xp);
          setTimeout(() => setShowAnimation(false), 500);
        }
      }, 10);

      return () => clearInterval(interval);
    }
  }, [xp, prevXP]);

  return (
    <div
      className={`relative bg-gradient-to-br from-[--bg-glass] to-transparent border border-[--border-glass] rounded-lg p-4 backdrop-blur-sm ${className}`}
      style={{
        backgroundColor: 'var(--bg-glass)',
        borderColor: 'var(--border-glass)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[--text-secondary]">
          Level · XP
        </h3>
        <span className="text-xs px-2 py-1 rounded-full bg-[--accent-primary] bg-opacity-20 text-[--accent-primary]">
          {levelInfo.level}
        </span>
      </div>

      {/* XP Number - Animated */}
      <div className="flex items-baseline gap-2 mb-4">
        <motion.div
          initial={{ scale: 1 }}
          animate={showAnimation ? { scale: 1.1 } : { scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-3xl font-bold text-[--text-primary]"
        >
          {displayXP.toLocaleString()}
        </motion.div>
        <span className="text-sm text-[--text-secondary] opacity-70">XP</span>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[--text-secondary] opacity-70">
            {levelInfo.xpInLevel.toLocaleString()} / {levelInfo.xpRangeMax === Infinity ? '∞' : (levelInfo.xpRangeMax - levelInfo.xpRangeMin).toLocaleString()}
          </span>
          <span className="text-[--text-secondary] opacity-70">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="relative w-full h-2 bg-black bg-opacity-40 rounded-full overflow-hidden border border-[--border-glass]">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-[--accent-primary] to-[--accent-up] rounded-full shadow-lg"
            style={{
              boxShadow: '0 0 10px rgba(16, 185, 129, 0.5)',
            }}
          />
        </div>
      </div>

      {/* Level Info */}
      <div className="mt-3 text-xs text-[--text-secondary] opacity-60">
        {levelInfo.xpToNextLevel > 0 && (
          <p>
            {levelInfo.xpToNextLevel.toLocaleString()} XP until <span className="font-semibold">{getLevelName(levelInfo.levelNumber + 1)}</span>
          </p>
        )}
        {levelInfo.xpToNextLevel === 0 && (
          <p className="text-[--accent-primary] font-semibold">
            🌟 Master Level Reached!
          </p>
        )}
      </div>

      {/* Glow effect during animation */}
      {showAnimation && (
        <div className="absolute inset-0 rounded-lg bg-[--accent-primary] opacity-5 pointer-events-none" />
      )}
    </div>
  );
}

function getLevelName(levelNumber: number): string {
  const names = ['Rookie', 'Trader', 'Analyst', 'Master'];
  return names[Math.max(0, Math.min(3, levelNumber - 1))] || 'Master';
}
