'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { getUserLevel, getLevelProgress } from '@/lib/gamification';
import { Zap, Star, TrendingUp } from 'lucide-react';

interface XPDisplayProps {
  xp: number;
  className?: string;
}

export default function XPDisplay({ xp, className = '' }: XPDisplayProps) {
  const [displayXP, setDisplayXP] = useState(xp);
  const [showAnimation, setShowAnimation] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const prevXPRef = useRef(xp);
  const levelInfo = getUserLevel(displayXP);
  const progress = getLevelProgress(displayXP);

  useEffect(() => {
    if (xp !== prevXPRef.current) {
      const prevLevel = getUserLevel(prevXPRef.current);
      const newLevel = getUserLevel(xp);

      setShowAnimation(true);
      const delta = xp - prevXPRef.current;
      let current = prevXPRef.current;
      const increment = delta > 0 ? 1 : -1;
      const speed = Math.max(5, Math.min(20, Math.abs(delta) / 50));

      const interval = setInterval(() => {
        current += increment * Math.ceil(speed);
        if ((delta > 0 && current >= xp) || (delta < 0 && current <= xp)) {
          current = xp;
          clearInterval(interval);
          setTimeout(() => setShowAnimation(false), 500);
        }
        setDisplayXP(current);
      }, 16);

      // Level up notification
      if (newLevel.levelNumber > prevLevel.levelNumber) {
        setTimeout(() => {
          setShowLevelUp(true);
          setTimeout(() => setShowLevelUp(false), 3000);
        }, 300);
      }

      prevXPRef.current = xp;
      return () => clearInterval(interval);
    }
  }, [xp]);

  return (
    <div
      className={`relative bg-gradient-to-br from-[--bg-glass] to-transparent border border-[--border-glass] rounded-lg p-5 backdrop-blur-sm overflow-hidden ${className}`}
      style={{
        backgroundColor: 'var(--bg-glass)',
        borderColor: 'var(--border-glass)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[--text-secondary] flex items-center gap-1.5">
          <TrendingUp size={14} />
          Level · XP
        </h3>
        <motion.span
          key={levelInfo.level}
          initial={{ scale: 1.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-xs px-2.5 py-1 rounded-full bg-[--accent-primary] bg-opacity-20 text-[--accent-primary] font-bold"
        >
          {levelInfo.level}
        </motion.span>
      </div>

      {/* XP Number - Animated */}
      <div className="flex items-baseline gap-2 mb-4">
        <motion.div
          initial={{ scale: 1 }}
          animate={showAnimation ? { scale: [1, 1.1, 1] } : { scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-3xl font-bold text-[--text-primary] font-mono tracking-tight"
        >
          {displayXP.toLocaleString()}
        </motion.div>
        <span className="text-sm text-[--text-secondary] opacity-70 flex items-center gap-1">
          <Zap size={14} className="fill-current text-[--accent-warning]" />
          XP
        </span>
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
        <div className="relative w-full h-2.5 bg-black bg-opacity-40 rounded-full overflow-hidden border border-[--border-glass]">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-[--accent-primary] to-[--accent-up] rounded-full"
            style={{
              boxShadow: '0 0 12px rgba(16, 185, 129, 0.5)',
            }}
          />
          {/* Shimmer overlay */}
          <div className="absolute inset-0 shimmer-bar rounded-full" />
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
          <p className="text-[--accent-primary] font-semibold flex items-center gap-1">
            <Star size={12} className="fill-current" /> Master Level Reached!
          </p>
        )}
      </div>

      {/* Glow effect during animation */}
      {showAnimation && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.08 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 rounded-lg bg-[--accent-primary] pointer-events-none"
        />
      )}

      {/* Level Up Notification */}
      {showLevelUp && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -20 }}
          className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-lg z-20"
        >
          <div className="text-center">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 0.6 }}
              className="text-4xl mb-2"
            >
              🎉
            </motion.div>
            <p className="text-lg font-bold text-[--accent-primary]">Level Up!</p>
            <p className="text-sm text-[--text-secondary]">{levelInfo.level}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function getLevelName(levelNumber: number): string {
  const names = ['Rookie', 'Trader', 'Analyst', 'Master'];
  return names[Math.max(0, Math.min(3, levelNumber - 1))] || 'Master';
}
