'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GameState {
  timeLeft: number;
  isPlaying: boolean;
  heldUntil: number | null;
  xpEarned: number | null;
}

export default function HoldTheLine() {
  const [gameState, setGameState] = useState<GameState>({
    timeLeft: 15,
    isPlaying: true,
    heldUntil: null,
    xpEarned: null,
  });

  const [price, setPrice] = useState(100);
  const [minPrice, setMinPrice] = useState(100);
  const priceHistoryRef = useRef<number[]>([100]);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const [shaking, setShaking] = useState(false);

  // Price update loop
  useEffect(() => {
    if (!gameState.isPlaying) return;

    gameLoopRef.current = setInterval(() => {
      setPrice((prev) => {
        // Biased toward drops for drama
        const bias = -0.3;
        const change = (Math.random() - 0.5 + bias) * 5;
        const newPrice = Math.max(prev * (1 + change / 100), 50);
        priceHistoryRef.current.push(newPrice);
        
        // Shake on big drops
        if (change < -3) {
          setShaking(true);
          setTimeout(() => setShaking(false), 400);
        }
        
        setMinPrice((min) => Math.min(min, newPrice));
        return newPrice;
      });
    }, 400);

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [gameState.isPlaying]);

  // Countdown timer
  useEffect(() => {
    if (!gameState.isPlaying || gameState.heldUntil !== null) return;

    countdownRef.current = setInterval(() => {
      setGameState((prev) => {
        if (prev.timeLeft <= 1) {
          if (gameLoopRef.current) clearInterval(gameLoopRef.current);
          return {
            ...prev,
            timeLeft: 0,
            isPlaying: false,
            heldUntil: 15,
            xpEarned: 150,
          };
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);

    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [gameState.isPlaying, gameState.heldUntil]);

  const handleSell = () => {
    if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);

    setGameState((prev) => ({
      ...prev,
      isPlaying: false,
      heldUntil: 15 - prev.timeLeft,
      xpEarned: 30,
    }));
  };

  const handlePlayAgain = () => {
    setGameState({ timeLeft: 15, isPlaying: true, heldUntil: null, xpEarned: null });
    setPrice(100);
    setMinPrice(100);
    priceHistoryRef.current = [100];
  };

  // Stress calculations
  const initialPrice = 100;
  const priceDropPercent = Math.max(0, ((initialPrice - price) / initialPrice) * 100);
  const stressMeter = Math.min(100, priceDropPercent * 2.5);
  const priceChange = ((price - initialPrice) / initialPrice) * 100;
  const priceColor = price >= initialPrice ? 'var(--accent-up)' : 'var(--accent-down)';

  // Heartbeat speed based on stress
  const heartbeatDuration = Math.max(0.3, 1.2 - stressMeter / 100);

  // Mini price chart
  const chartPath = useMemo(() => {
    const history = priceHistoryRef.current;
    if (history.length < 2) return '';
    const min = Math.min(...history);
    const max = Math.max(...history);
    const range = max - min || 1;
    
    return history.map((p, i) => {
      const x = (i / (history.length - 1)) * 100;
      const y = 100 - ((p - min) / range) * 80 - 10;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  }, [price]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`flex flex-col gap-4 h-full ${shaking ? 'shake' : ''}`}>
      {/* Price Display with Chart */}
      <motion.div
        className="glass-card-premium p-6 text-center relative overflow-hidden"
        animate={shaking ? { x: [-2, 2, -2, 0] } : {}}
        transition={{ duration: 0.2 }}
      >
        {/* Background mini chart */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
            <path d={chartPath} stroke={price >= initialPrice ? '#22c55e' : '#ef4444'} strokeWidth="1" fill="none" />
            <path d={`${chartPath} L 100 100 L 0 100 Z`} fill={price >= initialPrice ? '#22c55e' : '#ef4444'} opacity="0.1" />
          </svg>
        </div>

        <p className="text-xs uppercase tracking-wider text-[--text-secondary] mb-2 relative z-10">Current Price</p>
        <motion.div
          animate={gameState.isPlaying ? { 
            scale: [1, 1 + stressMeter / 500, 1],
          } : {}}
          transition={{ duration: heartbeatDuration, repeat: gameState.isPlaying ? Infinity : 0 }}
          className="text-5xl font-bold mb-2 font-mono relative z-10"
          style={{ color: priceColor }}
        >
          ${price.toFixed(2)}
        </motion.div>
        <motion.div
          className="text-lg font-semibold relative z-10"
          style={{ color: priceChange >= 0 ? 'var(--accent-up)' : 'var(--accent-down)' }}
        >
          {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
        </motion.div>
      </motion.div>

      {/* Timer with circular progress */}
      <div className="glass-card-premium p-5">
        <p className="text-xs uppercase tracking-wider text-[--text-secondary] mb-3">Hold Time</p>
        <div className="flex items-center gap-6">
          {/* Circular timer */}
          <div className="relative w-20 h-20 flex-shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
              <motion.circle
                cx="50" cy="50" r="42"
                fill="none"
                stroke={gameState.timeLeft <= 3 ? 'var(--accent-down)' : 'var(--accent-primary)'}
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray="264"
                animate={{ strokeDashoffset: 264 - (gameState.timeLeft / 15) * 264 }}
                transition={{ duration: 0.5 }}
                style={{ filter: `drop-shadow(0 0 6px ${gameState.timeLeft <= 3 ? 'rgba(239,68,68,0.5)' : 'rgba(16,185,129,0.5)'})` }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.span
                animate={gameState.timeLeft <= 3 && gameState.isPlaying ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.3, repeat: Infinity }}
                className="text-2xl font-bold font-mono text-[--text-primary]"
              >
                {gameState.timeLeft}
              </motion.span>
            </div>
          </div>

          <div className="flex-1">
            <div className="text-sm text-[--text-secondary] opacity-70 mb-2">
              {gameState.isPlaying 
                ? gameState.timeLeft <= 3 
                  ? '🔥 Almost there! Hold on!' 
                  : '💎 Diamond hands required...'
                : gameState.heldUntil === 15 
                  ? '🏆 You held the line!' 
                  : '📊 You sold early.'}
            </div>
            {/* Linear bar */}
            <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
              <motion.div
                animate={{ width: `${(gameState.timeLeft / 15) * 100}%` }}
                transition={{ ease: 'linear', duration: 0.5 }}
                className="h-full rounded-full"
                style={{
                  background: gameState.timeLeft <= 3 
                    ? 'linear-gradient(to right, var(--accent-warning), var(--accent-down))' 
                    : 'linear-gradient(to right, var(--accent-primary), var(--accent-up))',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stress Meter */}
      <div className="glass-card-premium p-4">
        <p className="text-xs uppercase tracking-wider text-[--text-secondary] mb-3">Stress Level</p>
        <div className="space-y-2">
          <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden border border-[--border-glass]">
            <motion.div
              animate={{ width: `${stressMeter}%` }}
              transition={{ duration: 0.3 }}
              className="h-full bg-gradient-to-r from-amber-500 to-[--accent-down] rounded-full"
              style={{
                boxShadow: stressMeter > 30 ? `0 0 ${stressMeter / 5}px rgba(239, 68, 68, 0.6)` : 'none',
              }}
            />
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-[--text-secondary] opacity-70">😌 Calm</span>
            <motion.span
              animate={stressMeter > 50 ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="font-bold"
              style={{ color: stressMeter > 60 ? 'var(--accent-down)' : 'var(--accent-warning)' }}
            >
              {Math.round(stressMeter)}%
            </motion.span>
            <span className="text-[--text-secondary] opacity-70">😱 Panic!</span>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <AnimatePresence mode="wait">
          {gameState.isPlaying ? (
            <motion.button
              key="sell"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onClick={handleSell}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 py-3.5 font-bold rounded-xl text-white"
              style={{ background: 'linear-gradient(to right, var(--accent-down), rgb(220, 38, 38))' }}
            >
              💰 SELL NOW — Take Profit/Loss
            </motion.button>
          ) : (
            <motion.button
              key="again"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onClick={handlePlayAgain}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 py-3.5 font-bold rounded-xl text-black"
              style={{ background: 'linear-gradient(to right, var(--accent-primary), var(--accent-up))' }}
            >
              🔁 Play Again
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Result */}
      {!gameState.isPlaying && gameState.heldUntil !== null && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="p-4 rounded-xl border backdrop-blur-sm"
          style={
            gameState.heldUntil === 15
              ? { backgroundColor: 'rgba(34, 197, 94, 0.1)', borderColor: 'rgba(34, 197, 94, 0.3)' }
              : { backgroundColor: 'rgba(250, 204, 21, 0.1)', borderColor: 'rgba(250, 204, 21, 0.3)' }
          }
        >
          <p className="text-sm font-bold text-[--text-primary] mb-1">
            {gameState.heldUntil === 15 ? '🎉 Perfect Hold! Diamond Hands!' : '📊 You sold — decent timing.'}
          </p>
          <p className="text-xs text-[--text-secondary] mb-1">
            Held for {gameState.heldUntil} {gameState.heldUntil === 1 ? 'second' : 'seconds'}
            {gameState.heldUntil === 15 && ' — Full duration!'}
          </p>
          <p className="text-xs text-[--text-secondary]">
            XP Earned: <span className="font-bold text-[--accent-primary]">+{gameState.xpEarned}</span>
          </p>
        </motion.div>
      )}
    </div>
  );
}
