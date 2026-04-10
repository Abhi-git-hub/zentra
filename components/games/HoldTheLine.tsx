'use client';

import React, { useState, useEffect, useRef } from 'react';
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

  // Price update loop
  useEffect(() => {
    if (!gameState.isPlaying) return;

    gameLoopRef.current = setInterval(() => {
      setPrice((prev) => {
        const change = (Math.random() - 0.5) * 4; // ±2%
        const newPrice = Math.max(prev * (1 + change / 100), 1);
        priceHistoryRef.current.push(newPrice);
        setMinPrice((min) => Math.min(min, newPrice));
        return newPrice;
      });
    }, 500);

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
          // Game over - held until end
          if (gameLoopRef.current) clearInterval(gameLoopRef.current);
          return {
            ...prev,
            timeLeft: 0,
            isPlaying: false,
            heldUntil: 15,
            xpEarned: 150,
          };
        }
        return {
          ...prev,
          timeLeft: prev.timeLeft - 1,
        };
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
    setGameState({
      timeLeft: 15,
      isPlaying: true,
      heldUntil: null,
      xpEarned: null,
    });
    setPrice(100);
    setMinPrice(100);
    priceHistoryRef.current = [100];
  };

  // Calculate stress meter (0-100)
  const initialPrice = 100;
  const priceDropPercent = Math.max(0, ((initialPrice - price) / initialPrice) * 100);
  const stressMeter = Math.min(100, priceDropPercent * 2); // Amplify for visibility

  // Price change percentage
  const priceChange = ((price - initialPrice) / initialPrice) * 100;
  const priceColor = price >= initialPrice ? 'var(--accent-up)' : 'var(--accent-down)';

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Price Display */}
      <motion.div
        className="bg-gradient-to-br from-[--bg-glass] to-transparent border border-[--border-glass] rounded-lg p-6 backdrop-blur-sm text-center"
        style={{
          backgroundColor: 'var(--bg-glass)',
          borderColor: 'var(--border-glass)',
        }}
      >
        <p className="text-xs uppercase tracking-wider text-[--text-secondary] mb-2">Current Price</p>
        <motion.div
          animate={{ scale: gameState.isPlaying ? [1, 1.05, 1] : 1 }}
          transition={{ duration: 0.5, repeat: gameState.isPlaying ? Infinity : 0 }}
          className="text-4xl font-bold mb-2"
          style={{ color: priceColor }}
        >
          ${price.toFixed(2)}
        </motion.div>
        <div
          className="text-lg font-semibold"
          style={{ color: priceChange >= 0 ? 'var(--accent-up)' : 'var(--accent-down)' }}
        >
          {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
        </div>
      </motion.div>

      {/* Timer */}
      <div className="bg-gradient-to-br from-[--bg-glass] to-transparent border border-[--border-glass] rounded-lg p-4 backdrop-blur-sm">
        <p className="text-xs uppercase tracking-wider text-[--text-secondary] mb-3">Hold Time</p>
        <div className="flex items-center justify-between mb-3">
          <motion.div
            animate={{ scale: gameState.timeLeft <= 3 ? [1, 1.1, 1] : 1 }}
            transition={{ duration: 0.3, repeat: gameState.timeLeft <= 3 && gameState.isPlaying ? Infinity : 0 }}
            className="text-5xl font-bold text-[--text-primary]"
          >
            {gameState.timeLeft}
          </motion.div>
          <span className="text-lg text-[--text-secondary] opacity-70">seconds</span>
        </div>

        {/* Timer Bar */}
        <div className="w-full h-2 bg-black bg-opacity-40 rounded-full overflow-hidden border border-[--border-glass]">
          <motion.div
            initial={{ width: '100%' }}
            animate={{ width: `${(gameState.timeLeft / 15) * 100}%` }}
            transition={{ ease: 'linear' }}
            className="h-full bg-gradient-to-r from-[--accent-primary] to-[--accent-up]"
            style={{
              boxShadow: '0 0 10px rgba(16, 185, 129, 0.5)',
            }}
          />
        </div>
      </div>

      {/* Stress Meter */}
      <div className="bg-gradient-to-br from-[--bg-glass] to-transparent border border-[--border-glass] rounded-lg p-4 backdrop-blur-sm">
        <p className="text-xs uppercase tracking-wider text-[--text-secondary] mb-3">Stress Level</p>
        <div className="space-y-2">
          <div className="w-full h-3 bg-black bg-opacity-40 rounded-full overflow-hidden border border-[--border-glass]">
            <motion.div
              animate={{ width: `${stressMeter}%` }}
              transition={{ ease: 'linear' }}
              className="h-full bg-gradient-to-r from-orange-500 to-[--accent-down] rounded-full"
              style={{
                boxShadow: stressMeter > 30 ? '0 0 15px rgba(239, 68, 68, 0.6)' : 'none',
              }}
            />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-[--text-secondary] opacity-70">Calm</span>
            <span className="text-xs font-semibold" style={{ color: 'var(--accent-down)' }}>
              {Math.round(stressMeter)}%
            </span>
            <span className="text-xs text-[--text-secondary] opacity-70">Panic!</span>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <AnimatePresence mode="wait">
          {gameState.isPlaying ? (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onClick={handleSell}
              className="flex-1 py-3 bg-gradient-to-r from-[--accent-down] to-red-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300"
              style={{
                background: 'linear-gradient(to right, var(--accent-down), rgb(220, 38, 38))',
                boxShadow: 'hover:0 0 20px rgba(239, 68, 68, 0.5)',
              }}
            >
              SELL NOW
            </motion.button>
          ) : (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onClick={handlePlayAgain}
              className="flex-1 py-3 bg-gradient-to-r from-[--accent-primary] to-[--accent-up] text-[--bg-mesh-1] font-semibold rounded-lg hover:shadow-lg transition-all duration-300"
              style={{
                color: 'var(--bg-mesh-1)',
                background: 'linear-gradient(to right, var(--accent-primary), var(--accent-up))',
              }}
            >
              Play Again
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Result */}
      {!gameState.isPlaying && gameState.heldUntil !== null && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg border backdrop-blur-sm ${
            gameState.heldUntil === 15
              ? 'bg-[--accent-up] bg-opacity-10 border-[--accent-up]'
              : 'bg-[--accent-warning] bg-opacity-10 border-[--accent-warning]'
          }`}
          style={
            gameState.heldUntil === 15
              ? {
                  backgroundColor: 'rgba(34, 197, 94, 0.1)',
                  borderColor: 'var(--accent-up)',
                }
              : {
                  backgroundColor: 'rgba(250, 204, 21, 0.1)',
                  borderColor: 'var(--accent-warning)',
                }
          }
        >
          <p className="text-sm font-semibold text-[--text-primary] mb-2">
            {gameState.heldUntil === 15 ? '🎉 Perfect Hold!' : '📊 Nice Try!'}
          </p>
          <p className="text-xs text-[--text-secondary] mb-2">
            Held for {gameState.heldUntil} {gameState.heldUntil === 1 ? 'second' : 'seconds'}
          </p>
          <p className="text-xs text-[--text-secondary]">
            XP Earned: <span className="font-bold text-[--accent-primary]">+{gameState.xpEarned}</span>
          </p>
        </motion.div>
      )}
    </div>
  );
}
