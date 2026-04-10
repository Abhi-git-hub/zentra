'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Inline data — no CSV import needed
const PRE_COVID_PRICES = [
  12362.80, 12256.10, 12129.50, 11993.05, 11962.10,
  11842.35, 11767.75, 11661.85, 11633.30, 11555.05,
  11519.45, 11435.05, 11201.75, 10989.45, 10451.45,
  9955.20, 9590.15, 9293.50, 8468.80, 8263.45,
  // reveal section
  8083.80, 7997.15, 8317.85, 8641.45, 8598.25,
  8281.10, 8145.30, 8083.80, 7610.25, 7511.10,
];

interface GameResult {
  won: boolean;
  xpEarned: number;
  message: string;
  actualBottomIdx: number;
  userGuessIdx: number;
  accuracy: number;
}

export default function GuessTheBottom() {
  const [gameState, setGameState] = useState<'playing' | 'revealed' | 'result'>('playing');
  const [userGuessIdx, setUserGuessIdx] = useState<number | null>(null);
  const [result, setResult] = useState<GameResult | null>(null);
  const [selectedCandle, setSelectedCandle] = useState<number | null>(null);

  const gameData = useMemo(() => {
    const hidden = PRE_COVID_PRICES.slice(0, 20);
    const reveal = PRE_COVID_PRICES.slice(20, 30);
    
    let minIdx = 0;
    let minPrice = reveal[0];
    for (let i = 0; i < reveal.length; i++) {
      if (reveal[i] < minPrice) {
        minPrice = reveal[i];
        minIdx = i;
      }
    }

    return { hidden, reveal, minIdx, minPrice };
  }, []);

  const allPrices = useMemo(() => [...gameData.hidden, ...gameData.reveal], [gameData]);
  const min = Math.min(...allPrices);
  const max = Math.max(...allPrices);

  const normalizePrice = useCallback((price: number) => {
    return ((price - min) / (max - min)) * 100;
  }, [min, max]);

  const handleCandleClick = (idx: number) => {
    if (gameState !== 'playing') return;
    setSelectedCandle(idx);
  };

  const handleGuess = () => {
    const guessIdx = selectedCandle ?? gameData.hidden.length - 1;
    setUserGuessIdx(guessIdx);
    setGameState('revealed');
  };

  const handleRevealResult = () => {
    const actualBottomGlobal = 20 + gameData.minIdx;
    const guessIdx = userGuessIdx ?? 19;
    const distance = Math.abs(actualBottomGlobal - guessIdx);
    const maxDistance = allPrices.length;
    const accuracy = Math.max(0, Math.round((1 - distance / maxDistance) * 100));
    const won = distance <= 3;
    const xp = won ? 100 : 25;

    const messages = {
      won: [
        "🎯 Sharp eye! You spotted the bottom within 3 candles!",
        "⭐ Impeccable timing! That's trader instinct right there.",
        "🏆 Near-perfect! Your pattern recognition is elite.",
      ],
      lost: [
        `💪 The real bottom was ${distance} candles away. Keep practicing!`,
        `📈 Not quite — but ${accuracy}% accuracy shows promise!`,
        `🧠 The bottom was at candle ${actualBottomGlobal + 1}. Study the pattern!`,
      ],
    };

    const messageList = won ? messages.won : messages.lost;
    const message = messageList[Math.floor(Math.random() * messageList.length)];

    setResult({ won, xpEarned: xp, message, actualBottomIdx: actualBottomGlobal, userGuessIdx: guessIdx, accuracy });
    setGameState('result');
  };

  const handlePlayAgain = () => {
    setGameState('playing');
    setUserGuessIdx(null);
    setResult(null);
    setSelectedCandle(null);
  };

  const renderChart = () => {
    const prices = gameState === 'playing' ? gameData.hidden : allPrices;
    const points = prices.map((price, idx) => ({
      x: (idx / Math.max(prices.length - 1, 1)) * 100,
      y: 100 - normalizePrice(price),
      price,
      idx,
    }));

    const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

    return (
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((y) => (
          <line key={`grid-${y}`} x1="0" y1={y} x2="100" y2={y} stroke="rgba(34,197,94,0.08)" strokeWidth="0.3" />
        ))}

        {/* Fill under curve */}
        <path d={`${pathData} L 100 100 L 0 100 Z`} fill="url(#gtbGradient)" opacity="0.15" />

        {/* Price line */}
        <defs>
          <linearGradient id="gtbGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d={pathData}
          stroke="#10b981"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ filter: 'drop-shadow(0 0 3px rgba(16,185,129,0.4))' }}
        />

        {/* Candle markers */}
        {points.map((p, idx) => {
          const isSelected = selectedCandle === idx;
          const isBottom = gameState !== 'playing' && idx === 20 + gameData.minIdx;
          const isGuess = gameState !== 'playing' && idx === userGuessIdx;
          const isHiddenSection = idx < gameData.hidden.length;

          let fill = isHiddenSection ? '#10b981' : '#22c55e';
          let r = 0.8;

          if (isBottom) { fill = '#ef4444'; r = 2; }
          if (isGuess) { fill = '#facc15'; r = 1.8; }
          if (isSelected && gameState === 'playing') { fill = '#facc15'; r = 2; }

          return (
            <g key={`candle-${idx}`}>
              <circle
                cx={p.x}
                cy={p.y}
                r={r}
                fill={fill}
                style={isBottom || isGuess || isSelected ? { filter: `drop-shadow(0 0 4px ${fill})` } : {}}
                className={gameState === 'playing' ? 'cursor-pointer' : ''}
                onClick={() => handleCandleClick(idx)}
              />
              {/* Clickable area (larger hit zone) */}
              {gameState === 'playing' && (
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={3}
                  fill="transparent"
                  className="cursor-pointer"
                  onClick={() => handleCandleClick(idx)}
                />
              )}
            </g>
          );
        })}

        {/* Labels */}
        {gameState !== 'playing' && result && (
          <>
            <text x={points[20 + gameData.minIdx]?.x} y={(points[20 + gameData.minIdx]?.y ?? 0) + 6} fill="#ef4444" fontSize="3" textAnchor="middle" fontWeight="bold">
              BOTTOM
            </text>
          </>
        )}
      </svg>
    );
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Chart */}
      <div
        className="flex-1 glass-card-premium p-4 relative overflow-hidden"
        style={{ minHeight: '300px' }}
      >
        <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-[--accent-primary] to-transparent pointer-events-none" />
        <div className="relative h-full">
          {renderChart()}
        </div>

        {/* Info overlay */}
        <div className="absolute top-4 left-4 text-xs text-[--text-secondary]">
          <p className="font-bold text-sm mb-1">COVID Crash Scenario</p>
          {gameState === 'playing' ? (
            <p className="opacity-70">
              {selectedCandle !== null 
                ? `Selected: Candle ${selectedCandle + 1} ($${gameData.hidden[selectedCandle]?.toFixed(0) ?? '—'})`
                : 'Click a candle where you think the bottom is'}
            </p>
          ) : (
            <p className="opacity-70">Revealing next 10 candles...</p>
          )}
        </div>

        {/* Accuracy badge */}
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-bold"
            style={{
              background: result.won ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              color: result.won ? 'var(--accent-up)' : 'var(--accent-down)',
              border: `1px solid ${result.won ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
            }}
          >
            {result.accuracy}% Accuracy
          </motion.div>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-3">
        <AnimatePresence mode="wait">
          {gameState === 'playing' && (
            <motion.button
              key="guess"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onClick={handleGuess}
              className="w-full py-3.5 font-bold rounded-xl transition-all duration-300 text-black"
              style={{ background: 'linear-gradient(to right, #10b981, #22c55e)' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {selectedCandle !== null ? `Confirm — Candle ${selectedCandle + 1}` : 'I Think This Is The Bottom'}
            </motion.button>
          )}

          {gameState === 'revealed' && (
            <motion.button
              key="reveal"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onClick={handleRevealResult}
              className="w-full py-3.5 font-bold rounded-xl transition-all duration-300 text-black"
              style={{ background: 'linear-gradient(to right, #f59e0b, #f97316)' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              🎯 Reveal Result
            </motion.button>
          )}

          {gameState === 'result' && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              <div
                className="p-4 rounded-xl border backdrop-blur-sm"
                style={
                  result.won
                    ? { backgroundColor: 'rgba(34, 197, 94, 0.1)', borderColor: 'rgba(34, 197, 94, 0.3)' }
                    : { backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.3)' }
                }
              >
                <p className="text-sm font-bold text-[--text-primary] mb-1">{result.message}</p>
                <p className="text-xs text-[--text-secondary]">
                  XP Earned: <span className="font-bold text-[--accent-primary]">+{result.xpEarned}</span>
                </p>
              </div>
              <motion.button
                onClick={handlePlayAgain}
                className="w-full py-3 font-bold rounded-xl text-black"
                style={{ background: 'linear-gradient(to right, #10b981, #22c55e)' }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Play Again
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
