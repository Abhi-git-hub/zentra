'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
  component: React.ReactNode;
}

const games: GameInfo[] = [
  {
    id: 'guess',
    title: 'Guess The Bottom',
    description: 'Spot where the crash hits rock bottom. Reveals 10 more candles after your guess.',
    xpReward: '100 XP (win) / 25 XP (participate)',
    difficulty: 'Medium',
    component: <GuessTheBottom />,
  },
  {
    id: 'hold',
    title: 'Hold The Line',
    description: 'Hold your position for 15 seconds. Watch the price drop and resist panic selling.',
    xpReward: '150 XP (hold full) / 30 XP (sell early)',
    difficulty: 'Hard',
    component: <HoldTheLine />,
  },
  {
    id: 'news',
    title: 'News Flash',
    description: 'React to market headlines. Predict if the market will go up or down in 3 seconds.',
    xpReward: '50 XP (correct) / 10 XP (participate)',
    difficulty: 'Easy',
    component: <NewsFlash />,
  },
];

export default function GamesPage() {
  const [selectedGame, setSelectedGame] = useState<GameType | null>(null);

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        {!selectedGame && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-[--text-primary] mb-2">Games Hub</h1>
            <p className="text-[--text-secondary] opacity-70">
              Earn XP to unlock harder scenarios and climb the leaderboard
            </p>
          </motion.div>
        )}

        {/* Game List or Game View */}
        {!selectedGame ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {games.map((game, idx) => (
              <motion.button
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => setSelectedGame(game.id)}
                className="text-left group"
              >
                <div
                  className="h-full bg-gradient-to-br from-[--bg-glass] to-transparent border border-[--border-glass] rounded-lg p-6 backdrop-blur-sm transition-all duration-300 hover:border-[--accent-primary] hover:shadow-lg hover:shadow-[--accent-primary]/20"
                  style={{
                    backgroundColor: 'var(--bg-glass)',
                    borderColor: 'var(--border-glass)',
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-bold text-[--text-primary] group-hover:text-[--accent-primary] transition-colors">
                      {game.title}
                    </h3>
                    <span className="text-xs px-2 py-1 rounded-full bg-[--accent-primary] bg-opacity-20 text-[--accent-primary] whitespace-nowrap flex-shrink-0">
                      {game.difficulty}
                    </span>
                  </div>

                  <p className="text-sm text-[--text-secondary] opacity-70 mb-4 line-clamp-2">
                    {game.description}
                  </p>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[--text-secondary] opacity-60">Reward:</span>
                      <span className="font-semibold text-[--accent-primary]">{game.xpReward}</span>
                    </div>
                  </div>

                  <div className="mt-4 text-xs text-[--accent-primary] group-hover:translate-x-1 transition-transform">
                    Play Now →
                  </div>
                </div>
              </motion.button>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Back button */}
            <motion.button
              onClick={() => setSelectedGame(null)}
              className="mb-6 flex items-center gap-2 text-[--text-secondary] hover:text-[--accent-primary] transition-colors"
            >
              <span>←</span> Back to Games
            </motion.button>

            {/* Game Info */}
            <div className="mb-6">
              {games.map((game) => {
                if (game.id !== selectedGame) return null;
                return (
                  <div key={game.id}>
                    <h1 className="text-4xl font-bold text-[--text-primary] mb-2">{game.title}</h1>
                    <p className="text-[--text-secondary] opacity-70 mb-4">{game.description}</p>
                    <div className="flex gap-6 text-sm">
                      <div>
                        <span className="text-[--text-secondary] opacity-60">Difficulty: </span>
                        <span className="font-semibold text-[--accent-primary]">{game.difficulty}</span>
                      </div>
                      <div>
                        <span className="text-[--text-secondary] opacity-60">Reward: </span>
                        <span className="font-semibold text-[--accent-primary]">{game.xpReward}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Game Container */}
            <div
              className="bg-gradient-to-br from-[--bg-glass] to-transparent border border-[--border-glass] rounded-lg p-6 backdrop-blur-sm"
              style={{
                backgroundColor: 'var(--bg-glass)',
                borderColor: 'var(--border-glass)',
                minHeight: '600px',
              }}
            >
              {games.find((g) => g.id === selectedGame)?.component}
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}
