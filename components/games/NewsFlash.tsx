'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NewsFlashState {
  showing: boolean;
  currentHeadline: number;
  userAnswer: 'UP' | 'DOWN' | null;
  revealed: boolean;
  xpEarned: number | null;
}

interface Headline {
  text: string;
  answer: 'UP' | 'DOWN';
}

const headlines: Headline[] = [
  {
    text: 'RBI Unexpectedly Cuts Repo Rate by 50 bps',
    answer: 'UP',
  },
  {
    text: 'Inflation Hits 12-Year High on Energy Prices',
    answer: 'DOWN',
  },
  {
    text: 'Foreign Investors Pull 5000 Crore From Indian Markets',
    answer: 'DOWN',
  },
  {
    text: 'IT Sector Reports Record Quarterly Earnings',
    answer: 'UP',
  },
  {
    text: 'Monsoon Rains Below Average, Warn Meteorologists',
    answer: 'DOWN',
  },
];

export default function NewsFlash() {
  const [gameState, setGameState] = useState<NewsFlashState>({
    showing: true,
    currentHeadline: Math.floor(Math.random() * headlines.length),
    userAnswer: null,
    revealed: false,
    xpEarned: null,
  });

  const [revealTimer, setRevealTimer] = useState<boolean>(false);

  // Auto-reveal after 3 seconds if user didn't answer
  useEffect(() => {
    if (gameState.showing && !gameState.userAnswer && !gameState.revealed) {
      const timer = setTimeout(() => {
        setRevealTimer(true);
        setTimeout(() => {
          handleReveal(null);
        }, 500);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [gameState.showing, gameState.userAnswer, gameState.revealed]);

  const headline = headlines[gameState.currentHeadline];

  const handleAnswer = (answer: 'UP' | 'DOWN') => {
    setGameState((prev) => ({
      ...prev,
      userAnswer: answer,
    }));

    setTimeout(() => {
      handleReveal(answer);
    }, 500);
  };

  const handleReveal = (userAnswer: 'UP' | 'DOWN' | null) => {
    const isCorrect = userAnswer === headline.answer;
    const xp = isCorrect ? 50 : 10;

    setGameState((prev) => ({
      ...prev,
      revealed: true,
      xpEarned: xp,
    }));
  };

  const handleNextHeadline = () => {
    setGameState({
      showing: true,
      currentHeadline: Math.floor(Math.random() * headlines.length),
      userAnswer: null,
      revealed: false,
      xpEarned: null,
    });
    setRevealTimer(false);
  };

  const isCorrect = gameState.userAnswer === headline.answer;

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Headline Display */}
      <motion.div
        className="flex-1 bg-gradient-to-br from-[--bg-glass] to-transparent border border-[--border-glass] rounded-lg p-6 backdrop-blur-sm flex flex-col justify-center items-center"
        style={{
          backgroundColor: 'var(--bg-glass)',
          borderColor: 'var(--border-glass)',
        }}
        layout
      >
        <p className="text-xs uppercase tracking-wider text-[--text-secondary] mb-4 opacity-70">Breaking News</p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-bold text-center text-[--text-primary] leading-relaxed"
        >
          {headline.text}
        </motion.h2>

        {/* Timer indicator */}
        {!gameState.revealed && !gameState.userAnswer && (
          <motion.div
            animate={{ opacity: [0.5, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="mt-6 text-xs text-[--text-secondary] opacity-70"
          >
            Decide in 3 seconds...
          </motion.div>
        )}
      </motion.div>

      {/* Buttons */}
      <div className="flex gap-3">
        <AnimatePresence mode="wait">
          {!gameState.revealed ? (
            <>
              <motion.button
                key="up-btn"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onClick={() => handleAnswer('UP')}
                disabled={gameState.userAnswer !== null}
                className="flex-1 py-4 bg-gradient-to-r from-[--accent-up] to-emerald-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-emerald-500/50 transition-all duration-300 disabled:opacity-50"
                style={{
                  background: 'linear-gradient(to right, var(--accent-up), rgb(5, 150, 105))',
                }}
              >
                <span className="text-xl mr-2">📈</span> Market UP
              </motion.button>
              <motion.button
                key="down-btn"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onClick={() => handleAnswer('DOWN')}
                disabled={gameState.userAnswer !== null}
                className="flex-1 py-4 bg-gradient-to-r from-[--accent-down] to-red-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-red-500/50 transition-all duration-300 disabled:opacity-50"
                style={{
                  background: 'linear-gradient(to right, var(--accent-down), rgb(220, 38, 38))',
                }}
              >
                <span className="text-xl mr-2">📉</span> Market DOWN
              </motion.button>
            </>
          ) : (
            <motion.button
              key="next-btn"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onClick={handleNextHeadline}
              className="flex-1 py-4 bg-gradient-to-r from-[--accent-primary] to-[--accent-up] text-[--bg-mesh-1] font-semibold rounded-lg hover:shadow-lg transition-all duration-300"
              style={{
                color: 'var(--bg-mesh-1)',
                background: 'linear-gradient(to right, var(--accent-primary), var(--accent-up))',
              }}
            >
              Next Headline
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Result */}
      {gameState.revealed && gameState.userAnswer !== null && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg border backdrop-blur-sm ${
            isCorrect
              ? 'bg-[--accent-up] bg-opacity-10 border-[--accent-up]'
              : 'bg-[--accent-down] bg-opacity-10 border-[--accent-down]'
          }`}
          style={
            isCorrect
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
          <p className="text-sm font-semibold text-[--text-primary] mb-2">
            {isCorrect ? '✅ Correct!' : '❌ Incorrect'}
          </p>
          <p className="text-xs text-[--text-secondary] mb-2">
            The market went {headline.answer === 'UP' ? '📈 UP' : '📉 DOWN'}
          </p>
          <p className="text-xs text-[--text-secondary]">
            XP Earned: <span className="font-bold text-[--accent-primary]">+{gameState.xpEarned}</span>
          </p>
        </motion.div>
      )}

      {/* Reveal without user answer */}
      {gameState.revealed && gameState.userAnswer === null && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg border backdrop-blur-sm bg-[--accent-warning] bg-opacity-10 border-[--accent-warning]"
          style={{
            backgroundColor: 'rgba(250, 204, 21, 0.1)',
            borderColor: 'var(--accent-warning)',
          }}
        >
          <p className="text-sm font-semibold text-[--text-primary] mb-2">⏱️ Time's Up!</p>
          <p className="text-xs text-[--text-secondary] mb-2">
            The market went {headline.answer === 'UP' ? '📈 UP' : '📉 DOWN'}
          </p>
          <p className="text-xs text-[--text-secondary]">
            XP Earned: <span className="font-bold text-[--accent-primary]">+{gameState.xpEarned}</span>
          </p>
        </motion.div>
      )}
    </div>
  );
}
