'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Gamepad2, Trophy, Target, Timer, Newspaper } from 'lucide-react';
import GuessTheBottom from '@/components/games/GuessTheBottom';
import HoldTheLine from '@/components/games/HoldTheLine';
import NewsFlash from '@/components/games/NewsFlash';

type GameType = 'guess' | 'hold' | 'news';

interface GameInfo {
  id: GameType;
  title: string;
  description: string;
  xpReward: string;
  difficulty: string;
  difficultyColor: string;
  icon: React.ReactNode;
  component: React.ReactNode;
}

const games: GameInfo[] = [
  {
    id: 'guess',
    title: 'Guess The Bottom',
    description: 'Analyze the crash pattern and predict where it bottoms out. Click the candle you think is the lowest point.',
    xpReward: '100 XP (win) / 25 XP (play)',
    difficulty: 'Medium',
    difficultyColor: '#f59e0b',
    icon: <Target size={20} />,
    component: <GuessTheBottom />,
  },
  {
    id: 'hold',
    title: 'Hold The Line',
    description: 'Your position is dropping. Can you hold for 15 seconds without panic selling? Test your nerve.',
    xpReward: '150 XP (hold) / 30 XP (sell)',
    difficulty: 'Hard',
    difficultyColor: '#ef4444',
    icon: <Timer size={20} />,
    component: <HoldTheLine />,
  },
  {
    id: 'news',
    title: 'News Flash',
    description: 'Breaking headlines hit the wire. You have 3 seconds to predict the market direction. Build a streak for bonus XP!',
    xpReward: '50 XP (correct) / 10 XP (play)',
    difficulty: 'Easy',
    difficultyColor: '#22c55e',
    icon: <Newspaper size={20} />,
    component: <NewsFlash />,
  },
];

export default function GamesPage() {
  const [selectedGame, setSelectedGame] = useState<GameType | null>(null);

  return (
    <main className="min-h-screen pt-[120px] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <AnimatePresence mode="wait">
          {!selectedGame ? (
            <motion.div
              key="header"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-10"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-[var(--accent-primary)]/20 to-transparent border border-[var(--accent-primary)]/20">
                  <Gamepad2 size={28} className="text-[var(--accent-primary)]" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-[--text-primary]">Games Hub</h1>
                  <p className="text-[--text-secondary] opacity-70 text-sm mt-0.5">
                    Earn XP to unlock harder scenarios and climb the leaderboard
                  </p>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Game List or Game View */}
        <AnimatePresence mode="wait">
          {!selectedGame ? (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: 20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {games.map((game, idx) => (
                <motion.button
                  key={game.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  onClick={() => setSelectedGame(game.id)}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  className="text-left group"
                >
                  <div className="h-full glass-card-premium p-6 transition-all duration-300 hover:shadow-lg hover:shadow-[--accent-primary]/10">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-white/[0.05] text-[--accent-primary] group-hover:bg-[--accent-primary]/10 transition-colors">
                          {game.icon}
                        </div>
                        <h3 className="text-lg font-bold text-[--text-primary] group-hover:text-[--accent-primary] transition-colors">
                          {game.title}
                        </h3>
                      </div>
                      <span
                        className="text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider whitespace-nowrap flex-shrink-0"
                        style={{
                          background: `${game.difficultyColor}15`,
                          color: game.difficultyColor,
                          border: `1px solid ${game.difficultyColor}30`,
                        }}
                      >
                        {game.difficulty}
                      </span>
                    </div>

                    <p className="text-sm text-[--text-secondary] opacity-70 mb-5 leading-relaxed">
                      {game.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[--text-secondary] opacity-50">
                        Reward: <span className="font-semibold text-[--accent-primary] opacity-100">{game.xpReward}</span>
                      </span>
                      <div className="text-xs text-[--accent-primary] font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                        Play →
                      </div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="game"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Back button */}
              <motion.button
                onClick={() => setSelectedGame(null)}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-6 flex items-center gap-2 text-[--text-secondary] hover:text-[--accent-primary] transition-colors text-sm group"
              >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                Back to Games
              </motion.button>

              {/* Game Info */}
              <div className="mb-6">
                {games.map((game) => {
                  if (game.id !== selectedGame) return null;
                  return (
                    <div key={game.id}>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-[--accent-primary]/10 text-[--accent-primary]">
                          {game.icon}
                        </div>
                        <h1 className="text-3xl font-bold text-[--text-primary]">{game.title}</h1>
                      </div>
                      <p className="text-[--text-secondary] opacity-70 mb-4 text-sm">{game.description}</p>
                      <div className="flex gap-6 text-xs">
                        <div>
                          <span className="text-[--text-secondary] opacity-60">Difficulty: </span>
                          <span className="font-bold" style={{ color: game.difficultyColor }}>{game.difficulty}</span>
                        </div>
                        <div>
                          <span className="text-[--text-secondary] opacity-60">Reward: </span>
                          <span className="font-bold text-[--accent-primary]">{game.xpReward}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Game Container */}
              <div className="glass-card-premium p-6" style={{ minHeight: '600px' }}>
                {games.find((g) => g.id === selectedGame)?.component}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
