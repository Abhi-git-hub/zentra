'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import preCovidData from '@/data/preCovidrally.csv';

interface GameResult {
  won: boolean;
  xpEarned: number;
  message: string;
  actualBottom: number;
  userGuessCandle: number;
}

export default function GuessTheBottom() {
  const [gameState, setGameState] = useState<'playing' | 'revealed' | 'result'>('playing');
  const [userGuess, setUserGuess] = useState<number | null>(null);
  const [result, setResult] = useState<GameResult | null>(null);
  const [candles, setCandles] = useState<number[]>([]);

  // Parse CSV and extract first 20 and next 10 candles
  const gameData = useMemo(() => {
    const lines = preCovidData.trim().split('\n').slice(1); // Skip header
    const prices = lines.map(line => {
      const match = line.match(/"([^"]+)"/);
      return match ? parseFloat(match[1].replace(/,/g, '')) : 0;
    });

    const hidden = prices.slice(0, 20);
    const reveal = prices.slice(20, 30);
    
    // Find local minimum in the reveal section
    let minIdx = 0;
    let minPrice = reveal[0];
    for (let i = 0; i < reveal.length; i++) {
      if (reveal[i] < minPrice) {
        minPrice = reveal[i];
        minIdx = i;
      }
    }

    return { hidden, reveal, minIdx };
  }, []);

  React.useEffect(() => {
    setCandles(gameData.hidden);
  }, [gameData]);

  const handleGuess = () => {
    setGameState('revealed');
    setUserGuess(20); // User's guess is after the 20th candle
  };

  const handleRevealResult = () => {
    const actualBottom = gameData.minIdx;
    const distance = Math.abs(actualBottom - 0); // Distance from where they predicted
    const won = distance <= 3;
    const xp = won ? 100 : 25;

    const messages = {
      won: [
        "Sharp eye! You spotted the bottom. 📊",
        "Impeccable timing! Well done. ⭐",
        "That was the exact bottom! Incredible! 🎯",
      ],
      lost: [
        `Not quite — the real bottom was ${actualBottom} ${actualBottom === 1 ? 'day' : 'days'} later. Next time! 💪`,
        `Close! The bottom was found ${actualBottom} days into the crash. Keep practicing! 📈`,
      ],
    };

    const messageList = won ? messages.won : messages.lost;
    const message = messageList[Math.floor(Math.random() * messageList.length)];

    setResult({
      won,
      xpEarned: xp,
      message,
      actualBottom,
      userGuessCandle: 20,
    });

    setGameState('result');
  };

  const getMinMax = (prices: number[]) => {
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return { min, max };
  };

  const { min, max } = useMemo(
    () => getMinMax([...gameData.hidden, ...gameData.reveal]),
    [gameData]
  );

  const normalizePrice = (price: number) => {
    return ((price - min) / (max - min)) * 100;
  };

  const renderChart = () => {
    const points = (gameState === 'playing' ? candles : [...candles, ...gameData.reveal])
      .map((price, idx) => ({
        x: (idx / Math.max(candles.length - 1, 1)) * 100,
        y: 100 - normalizePrice(price),
        price,
      }));

    const pathData = points
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
      .join(' ');

    return (
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        preserveAspectRatio="none"
        style={{ margin: '-1px -1px' }}
      >
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((y) => (
          <line
            key={`grid-${y}`}
            x1="0"
            y1={y}
            x2="100"
            y2={y}
            stroke="var(--border-glass)"
            strokeWidth="0.5"
            opacity="0.3"
          />
        ))}

        {/* Price line */}
        <path
          d={pathData}
          stroke="var(--accent-primary)"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Fill under curve */}
        <path
          d={`${pathData} L 100 100 L 0 100 Z`}
          fill="var(--accent-primary)"
          opacity="0.1"
        />

        {/* Candle markers */}
        {points.map((p, idx) => (
          <circle
            key={`candle-${idx}`}
            cx={p.x}
            cy={p.y}
            r="1"
            fill={
              gameState === 'playing'
                ? idx === points.length - 1
                  ? 'var(--accent-warning)'
                  : 'var(--accent-primary)'
                : idx < gameData.hidden.length
                ? 'var(--accent-primary)'
                : idx === gameData.hidden.length + gameData.minIdx
                ? 'var(--accent-down)'
                : 'var(--accent-up)'
            }
          />
        ))}

        {/* Prediction marker */}
        {gameState === 'revealed' && (
          <circle
            cx={(gameData.hidden.length / points.length) * 100}
            cy={100 - normalizePrice(gameData.hidden[gameData.hidden.length - 1])}
            r="2"
            fill="var(--accent-warning)"
            opacity="0.6"
          />
        )}
      </svg>
    );
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Chart */}
      <div
        className="flex-1 bg-gradient-to-br from-[--bg-glass] to-transparent border border-[--border-glass] rounded-lg p-4 backdrop-blur-sm relative overflow-hidden"
        style={{
          backgroundColor: 'var(--bg-glass)',
          borderColor: 'var(--border-glass)',
          minHeight: '300px',
        }}
      >
        <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-[--accent-primary] to-transparent pointer-events-none" />
        <div className="relative h-full">
          {renderChart()}
        </div>

        {/* Overlay text during playing */}
        {gameState === 'playing' && (
          <div className="absolute top-4 left-4 text-xs text-[--text-secondary] opacity-70">
            <p className="font-semibold">COVID Crash Scenario</p>
            <p>Can you spot where the bottom is?</p>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-3">
        <AnimatePresence mode="wait">
          {gameState === 'playing' && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onClick={handleGuess}
              className="w-full py-3 bg-gradient-to-r from-[--accent-primary] to-[--accent-up] text-[--bg-mesh-1] font-semibold rounded-lg hover:shadow-lg hover:shadow-[--accent-primary]/50 transition-all duration-300"
              style={{
                color: 'var(--bg-mesh-1)',
                background: 'linear-gradient(to right, var(--accent-primary), var(--accent-up))',
              }}
            >
              I Think This Is The Bottom
            </motion.button>
          )}

          {gameState === 'revealed' && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onClick={handleRevealResult}
              className="w-full py-3 bg-gradient-to-r from-[--accent-warning] to-orange-500 text-[--bg-mesh-1] font-semibold rounded-lg hover:shadow-lg hover:shadow-orange-500/50 transition-all duration-300"
              style={{
                color: 'var(--bg-mesh-1)',
              }}
            >
              Reveal Result
            </motion.button>
          )}

          {gameState === 'result' && result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              <div
                className={`p-4 rounded-lg border backdrop-blur-sm ${
                  result.won
                    ? 'bg-[--accent-up] bg-opacity-10 border-[--accent-up]'
                    : 'bg-[--accent-down] bg-opacity-10 border-[--accent-down]'
                }`}
                style={
                  result.won
                    ? {
                        backgroundColor: 'rgba(34, 197, 94, 0.1)',
                        borderColor: 'var(--accent-up)',
                      }
                    : {
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        borderColor: 'var(--accent-down)',
                      }
                }
              >
                <p className="text-sm font-semibold text-[--text-primary]">{result.message}</p>
                <p className="text-xs text-[--text-secondary] mt-2">
                  XP Earned: <span className="font-bold text-[--accent-primary]">+{result.xpEarned}</span>
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
