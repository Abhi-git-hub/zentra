'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useSession } from 'next-auth/react';

interface LeaderboardUser {
  id: string;
  full_name: string;
  avatar_url: string | null;
  xp: number;
  discipline_score: number;
  rank: number;
}

export default function LeaderboardPage() {
  const { data: session } = useSession();
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserRank, setCurrentUserRank] = useState<number | null>(null);

  useEffect(() => {
    fetchLeaderboard();
  }, [session?.user?.email]);

  const fetchLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from('user_leaderboard')
        .select('*')
        .limit(10);

      if (error) throw error;

      const users = (data || []) as LeaderboardUser[];
      setLeaderboard(users);

      // Find current user's rank
      if (session?.user?.email) {
        const currentUser = users.find((u) => u.id === session.user?.id);
        if (currentUser) {
          setCurrentUserRank(currentUser.rank);
        }
      }
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-[--text-primary] mb-2">🏆 Leaderboard</h1>
          <p className="text-[--text-secondary] opacity-70">
            Top traders ranked by XP and discipline score
          </p>
        </motion.div>

        {/* Loading state */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-[--text-secondary] opacity-70">Loading leaderboard...</div>
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[--text-secondary] opacity-70">No players yet. Be the first!</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="overflow-hidden rounded-lg border border-[--border-glass] backdrop-blur-sm"
            style={{
              backgroundColor: 'var(--bg-glass)',
              borderColor: 'var(--border-glass)',
            }}
          >
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-[--border-glass] bg-black bg-opacity-20">
              <div className="col-span-1 text-xs font-semibold text-[--text-secondary] opacity-60 uppercase tracking-wider">
                Rank
              </div>
              <div className="col-span-6 text-xs font-semibold text-[--text-secondary] opacity-60 uppercase tracking-wider">
                Player
              </div>
              <div className="col-span-3 text-xs font-semibold text-[--text-secondary] opacity-60 uppercase tracking-wider">
                XP
              </div>
              <div className="col-span-2 text-xs font-semibold text-[--text-secondary] opacity-60 uppercase tracking-wider">
                Score
              </div>
            </div>

            {/* Table Rows */}
            {leaderboard.map((user, idx) => {
              const isCurrentUser = session?.user?.id === user.id;
              const medalEmoji = user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : user.rank === 3 ? '🥉' : '';

              return (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`grid grid-cols-12 gap-4 px-6 py-4 border-b border-[--border-glass] transition-colors ${
                    isCurrentUser
                      ? 'bg-[--accent-primary] bg-opacity-10'
                      : idx % 2 === 0
                      ? 'hover:bg-white hover:bg-opacity-5'
                      : 'hover:bg-white hover:bg-opacity-3'
                  }`}
                  style={
                    isCurrentUser
                      ? {
                          backgroundColor: 'rgba(16, 185, 129, 0.08)',
                        }
                      : {}
                  }
                >
                  {/* Rank */}
                  <div className="col-span-1 flex items-center">
                    <span className="text-lg font-bold">
                      {medalEmoji || (
                        <span className="text-[--text-secondary] opacity-70">#{user.rank}</span>
                      )}
                    </span>
                  </div>

                  {/* Player */}
                  <div className="col-span-6 flex items-center gap-3">
                    {user.avatar_url && (
                      <img
                        src={user.avatar_url}
                        alt={user.full_name}
                        className="w-10 h-10 rounded-full object-cover border border-[--border-glass]"
                      />
                    )}
                    <div>
                      <p className="font-semibold text-[--text-primary]">
                        {user.full_name}
                        {isCurrentUser && (
                          <span className="ml-2 text-xs px-2 py-1 rounded-full bg-[--accent-primary] bg-opacity-20 text-[--accent-primary]">
                            You
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* XP */}
                  <div className="col-span-3 flex items-center">
                    <span className="text-lg font-bold text-[--accent-primary]">
                      {user.xp.toLocaleString()}
                    </span>
                  </div>

                  {/* Discipline Score */}
                  <div className="col-span-2 flex items-center">
                    <span
                      className="text-lg font-bold"
                      style={{
                        color:
                          user.discipline_score > 0
                            ? 'var(--accent-up)'
                            : user.discipline_score < 0
                            ? 'var(--accent-down)'
                            : 'var(--text-secondary)',
                      }}
                    >
                      {user.discipline_score > 0 ? '+' : ''}
                      {user.discipline_score}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 p-4 rounded-lg border border-[--border-glass] backdrop-blur-sm bg-gradient-to-br from-[--bg-glass] to-transparent"
          style={{
            backgroundColor: 'var(--bg-glass)',
            borderColor: 'var(--border-glass)',
          }}
        >
          <h3 className="font-semibold text-[--text-primary] mb-2">How It Works</h3>
          <ul className="space-y-2 text-sm text-[--text-secondary] opacity-70">
            <li>• <strong>XP:</strong> Earned by playing games and making disciplined trades</li>
            <li>• <strong>Discipline Score:</strong> Increases for smart decisions, decreases for emotional trading</li>
            <li>• <strong>Levels:</strong> 0-500 XP (Rookie), 500-1500 (Trader), 1500-3000 (Analyst), 3000+ (Master)</li>
            <li>• <strong>Leaderboard:</strong> Updated in real-time as players earn XP</li>
          </ul>
        </motion.div>
      </div>
    </main>
  );
}
