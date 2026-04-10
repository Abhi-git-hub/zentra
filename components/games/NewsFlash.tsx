'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  explanation: string;
}

const headlines: Headline[] = [
  {
    text: 'RBI Unexpectedly Cuts Repo Rate by 50 bps',
    answer: 'UP',
    explanation: 'Rate cuts make borrowing cheaper, boosting corporate earnings and market sentiment.',
  },
  {
    text: 'Inflation Hits 12-Year High on Energy Prices',
    answer: 'DOWN',
    explanation: 'High inflation erodes purchasing power and may trigger rate hikes, pressuring equities.',
  },
  {
    text: 'Foreign Investors Pull ₹5000 Crore From Indian Markets',
    answer: 'DOWN',
    explanation: 'FII outflows create selling pressure and signal weakening confidence in the market.',
  },
  {
    text: 'IT Sector Reports Record Quarterly Earnings',
    answer: 'UP',
    explanation: 'Strong earnings beat expectations, attracting buyers and boosting sector sentiment.',
  },
  {
    text: 'Monsoon Rains Below Average, Warn Meteorologists',
    answer: 'DOWN',
    explanation: 'Poor monsoons hurt agriculture output, rural spending, and FMCG stocks.',
  },
  {
    text: 'Government Announces Surprise Tax Cuts for Corporates',
    answer: 'UP',
    explanation: 'Lower taxes boost net profits directly, making equities more attractive.',
  },
  {
    text: 'Major Bank Reports Rising NPAs in Q3 Results',
    answer: 'DOWN',
    explanation: 'Rising bad loans signal credit stress and weigh on banking sector stocks.',
  },
  {
    text: 'India Signs $50B Trade Deal with EU',
    answer: 'UP',
    explanation: 'Trade deals expand market access, boosting export-oriented sectors.',
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

  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [countdown, setCountdown] = useState(10);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Countdown timer with visual ring
  useEffect(() => {
    if (gameState.showing && !gameState.userAnswer && !gameState.revealed) {
      setCountdown(10);
      
      timerRef.current = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleReveal(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [gameState.showing, gameState.currentHeadline]); // eslint-disable-line react-hooks/exhaustive-deps

  const headline = headlines[gameState.currentHeadline];

  const handleAnswer = (answer: 'UP' | 'DOWN') => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    setGameState((prev) => ({ ...prev, userAnswer: answer }));

    setTimeout(() => {
      handleReveal(answer);
    }, 400);
  };

  const handleReveal = (userAnswer: 'UP' | 'DOWN' | null) => {
    const isCorrect = userAnswer === headline.answer;
    const streakBonus = streak >= 3 ? 10 : 0;
    const xp = userAnswer === null ? 5 : (isCorrect ? 50 + streakBonus : 10);

    if (isCorrect) {
      setStreak(s => {
        const newStreak = s + 1;
        setBestStreak(b => Math.max(b, newStreak));
        return newStreak;
      });
    } else {
      setStreak(0);
    }

    setGameState((prev) => ({
      ...prev,
      revealed: true,
      xpEarned: xp,
    }));
  };

  const handleNextHeadline = () => {
    let nextIdx = Math.floor(Math.random() * headlines.length);
    // Avoid repeating the same headline
    while (nextIdx === gameState.currentHeadline && headlines.length > 1) {
      nextIdx = Math.floor(Math.random() * headlines.length);
    }
    
    setGameState({
      showing: true,
      currentHeadline: nextIdx,
      userAnswer: null,
      revealed: false,
      xpEarned: null,
    });
  };

  const isCorrect = gameState.userAnswer === headline.answer;

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Streak & Stats Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {streak > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border"
              style={{
                background: streak >= 3 ? 'rgba(250, 204, 21, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                borderColor: streak >= 3 ? 'rgba(250, 204, 21, 0.3)' : 'rgba(16, 185, 129, 0.3)',
                color: streak >= 3 ? 'var(--accent-warning)' : 'var(--accent-up)',
              }}
            >
              🔥 {streak} Streak {streak >= 3 && '(+10 bonus!)'}
            </motion.div>
          )}
        </div>
        {bestStreak > 0 && (
          <span className="text-xs text-[--text-secondary] opacity-60">
            Best: {bestStreak}🔥
          </span>
        )}
      </div>

      {/* Headline Display */}
      <motion.div
        className="flex-1 glass-card-premium p-6 flex flex-col justify-center items-center relative overflow-hidden"
        layout
      >
        {/* Countdown Ring */}
        {!gameState.revealed && !gameState.userAnswer && (
          <div className="absolute top-4 right-4">
            <div className="relative w-12 h-12">
              <svg viewBox="0 0 50 50" className="w-full h-full -rotate-90">
                <circle cx="25" cy="25" r="20" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                <motion.circle
                  cx="25" cy="25" r="20"
                  fill="none"
                  stroke={countdown <= 1 ? '#ef4444' : '#10b981'}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="126"
                  initial={{ strokeDashoffset: 0 }}
                  animate={{ strokeDashoffset: 126 - (countdown / 10) * 126 }}
                  transition={{ duration: 0.5 }}
                />
              </svg>
              <motion.span
                animate={countdown <= 1 ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 0.3, repeat: Infinity }}
                className="absolute inset-0 flex items-center justify-center text-sm font-bold"
              >
                {countdown}
              </motion.span>
            </div>
          </div>
        )}

        <p className="text-[10px] uppercase tracking-[0.2em] text-[--accent-down] mb-5 font-bold opacity-70">⚡ Breaking News</p>
        
        <AnimatePresence mode="wait">
          <motion.h2
            key={gameState.currentHeadline}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="text-2xl font-bold text-center text-[--text-primary] leading-relaxed max-w-lg"
          >
            {headline.text}
          </motion.h2>
        </AnimatePresence>

        {/* Explanation after reveal */}
        {gameState.revealed && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-4 text-sm text-[--text-secondary] text-center max-w-md opacity-80"
          >
            💡 {headline.explanation}
          </motion.p>
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
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 py-4 font-bold rounded-xl text-white transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none"
                style={{ background: 'linear-gradient(135deg, var(--accent-up), rgb(5, 150, 105))' }}
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
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 py-4 font-bold rounded-xl text-white transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none"
                style={{ background: 'linear-gradient(135deg, var(--accent-down), rgb(220, 38, 38))' }}
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
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 py-4 font-bold rounded-xl text-black"
              style={{ background: 'linear-gradient(to right, var(--accent-primary), var(--accent-up))' }}
            >
              Next Headline →
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Result */}
      {gameState.revealed && gameState.userAnswer !== null && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="p-4 rounded-xl border backdrop-blur-sm"
          style={
            isCorrect
              ? { backgroundColor: 'rgba(34, 197, 94, 0.1)', borderColor: 'rgba(34, 197, 94, 0.3)' }
              : { backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.3)' }
          }
        >
          <p className="text-sm font-bold text-[--text-primary] mb-1">
            {isCorrect ? '✅ Correct!' : '❌ Incorrect'}
          </p>
          <p className="text-xs text-[--text-secondary] mb-1">
            The market went {headline.answer === 'UP' ? '📈 UP' : '📉 DOWN'}
          </p>
          <p className="text-xs text-[--text-secondary]">
            XP Earned: <span className="font-bold text-[--accent-primary]">+{gameState.xpEarned}</span>
            {streak >= 3 && isCorrect && <span className="text-[--accent-warning] ml-1">(includes streak bonus!)</span>}
          </p>
        </motion.div>
      )}

      {/* Timeout result */}
      {gameState.revealed && gameState.userAnswer === null && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl border backdrop-blur-sm"
          style={{ backgroundColor: 'rgba(250, 204, 21, 0.1)', borderColor: 'rgba(250, 204, 21, 0.3)' }}
        >
          <p className="text-sm font-bold text-[--text-primary] mb-1">⏱️ Time&apos;s Up!</p>
          <p className="text-xs text-[--text-secondary] mb-1">
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
