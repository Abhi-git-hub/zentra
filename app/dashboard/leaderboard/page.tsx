'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser';
import { Trophy, Medal, TrendingUp, Zap, Crown, ChevronUp } from 'lucide-react';

interface LeaderboardUser {
  id: string;
  full_name: string;
  avatar_url: string | null;
  email?: string;
  xp: number;
  discipline_score: number;
  rank: number;
}

// Demo data — used as fallback when the leaderboard view doesn't exist yet
const DEMO_LEADERBOARD: LeaderboardUser[] = [
  { id: '1', full_name: 'Alex Chen', avatar_url: null, xp: 4820, discipline_score: 87, rank: 1 },
  { id: '2', full_name: 'Priya Sharma', avatar_url: null, xp: 3950, discipline_score: 72, rank: 2 },
  { id: '3', full_name: 'James Wilson', avatar_url: null, xp: 3410, discipline_score: 65, rank: 3 },
  { id: '4', full_name: 'Ananya Patel', avatar_url: null, xp: 2870, discipline_score: 58, rank: 4 },
  { id: '5', full_name: 'Marcus Lee', avatar_url: null, xp: 2450, discipline_score: 44, rank: 5 },
  { id: '6', full_name: 'Sara Kim', avatar_url: null, xp: 2100, discipline_score: 71, rank: 6 },
  { id: '7', full_name: 'Raj Gupta', avatar_url: null, xp: 1840, discipline_score: 39, rank: 7 },
  { id: '8', full_name: 'Emma Davis', avatar_url: null, xp: 1560, discipline_score: 55, rank: 8 },
  { id: '9', full_name: 'Carlos Rivera', avatar_url: null, xp: 1200, discipline_score: 48, rank: 9 },
  { id: '10', full_name: 'Yuki Tanaka', avatar_url: null, xp: 890, discipline_score: 62, rank: 10 },
];

function getInitials(name: string): string {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

function getAvatarColor(rank: number): string {
  const colors = [
    'linear-gradient(135deg, #fbbf24, #f59e0b)',
    'linear-gradient(135deg, #94a3b8, #64748b)',
    'linear-gradient(135deg, #d97706, #b45309)',
    'linear-gradient(135deg, #10b981, #059669)',
    'linear-gradient(135deg, #3b82f6, #2563eb)',
    'linear-gradient(135deg, #8b5cf6, #7c3aed)',
    'linear-gradient(135deg, #6366f1, #4f46e5)',
    'linear-gradient(135deg, #14b8a6, #0d9488)',
    'linear-gradient(135deg, #f43f5e, #e11d48)',
    'linear-gradient(135deg, #a855f7, #9333ea)',
  ];
  return colors[(rank - 1) % colors.length];
}

export default function LeaderboardPage() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [usingDemo, setUsingDemo] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      setCurrentUserId(data.user?.id ?? null);
    })();
  }, [supabase]);

  useEffect(() => {
    fetchLeaderboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchLeaderboard = async () => {
    try {
      // Try the real leaderboard view first
      const { data, error } = await supabase
        .from('user_leaderboard')
        .select('*')
        .limit(10);

      if (error || !data || data.length === 0) {
        // Fallback to demo data
        setLeaderboard(DEMO_LEADERBOARD);
        setUsingDemo(true);
      } else {
        setLeaderboard(data as LeaderboardUser[]);
        setUsingDemo(false);
      }
    } catch {
      setLeaderboard(DEMO_LEADERBOARD);
      setUsingDemo(true);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.06 } },
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -30 },
    show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
  };

  return (
    <main className="min-h-screen pt-[120px] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500/20 to-transparent border border-amber-500/20">
              <Trophy size={28} className="text-amber-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-[--text-primary]">Leaderboard</h1>
              <p className="text-[--text-secondary] opacity-70 text-sm mt-0.5">
                Top traders ranked by XP and discipline score
              </p>
            </div>
          </div>
          {usingDemo && (
            <div className="mt-4 px-4 py-2 rounded-lg border border-amber-500/20 bg-amber-500/5 text-amber-300 text-xs">
              📊 Showing demo leaderboard — sign in and trade to appear on the real board
            </div>
          )}
        </motion.div>

        {/* Loading state */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
              className="w-8 h-8 border-2 border-[--accent-primary] border-t-transparent rounded-full"
            />
            <span className="text-[--text-secondary] opacity-70 text-sm">Loading rankings...</span>
          </div>
        ) : (
          <>
            {/* Top 3 Podium */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-3 gap-3 mb-8"
            >
              {[1, 0, 2].map((podiumIdx) => {
                const user = leaderboard[podiumIdx];
                if (!user) return <div key={podiumIdx} />;
                const isCenter = podiumIdx === 0;
                const medal = user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : '🥉';
                const isCurrentUser = currentUserId === user.id;

                return (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + podiumIdx * 0.1 }}
                    className={`glass-card-premium flex flex-col items-center p-5 text-center ${
                      isCenter ? 'md:-mt-4 animate-border-glow' : ''
                    }`}
                  >
                    <span className="text-2xl mb-2">{medal}</span>
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white mb-2 shadow-lg"
                      style={{ background: getAvatarColor(user.rank) }}
                    >
                      {getInitials(user.full_name)}
                    </div>
                    <p className="text-sm font-semibold text-[--text-primary] truncate max-w-full">
                      {user.full_name}
                      {isCurrentUser && (
                        <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded-full bg-[--accent-primary]/20 text-[--accent-primary]">
                          You
                        </span>
                      )}
                    </p>
                    <p className="text-lg font-bold text-[--accent-primary] mt-1 flex items-center gap-1">
                      <Zap size={14} className="fill-current" /> {user.xp.toLocaleString()} XP
                    </p>
                    <p className="text-xs text-[--text-secondary] opacity-60 mt-1">
                      Score: {user.discipline_score}
                    </p>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Remaining Rankings Table */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="glass-card-premium overflow-hidden"
            >
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-[--border-glass] bg-black/20">
                <div className="col-span-1 text-[10px] font-semibold text-[--text-secondary] opacity-60 uppercase tracking-wider">#</div>
                <div className="col-span-6 text-[10px] font-semibold text-[--text-secondary] opacity-60 uppercase tracking-wider">Player</div>
                <div className="col-span-3 text-[10px] font-semibold text-[--text-secondary] opacity-60 uppercase tracking-wider">XP</div>
                <div className="col-span-2 text-[10px] font-semibold text-[--text-secondary] opacity-60 uppercase tracking-wider">Score</div>
              </div>

              {/* Table Rows (rank 4+) */}
              {leaderboard.slice(3).map((user, idx) => {
                const isCurrentUser = currentUserId === user.id;

                return (
                  <motion.div
                    key={user.id}
                    variants={rowVariants}
                    className={`grid grid-cols-12 gap-4 px-6 py-3.5 border-b border-[--border-glass]/50 transition-colors hover:bg-white/[0.03] ${
                      isCurrentUser ? '' : ''
                    }`}
                    style={
                      isCurrentUser
                        ? { backgroundColor: 'rgba(16, 185, 129, 0.06)' }
                        : {}
                    }
                  >
                    <div className="col-span-1 flex items-center">
                      <span className="text-sm font-medium text-[--text-secondary] opacity-60">
                        {user.rank}
                      </span>
                    </div>

                    <div className="col-span-6 flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                        style={{ background: getAvatarColor(user.rank) }}
                      >
                        {getInitials(user.full_name)}
                      </div>
                      <p className="font-medium text-sm text-[--text-primary] truncate">
                        {user.full_name}
                        {isCurrentUser && (
                          <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded-full bg-[--accent-primary]/20 text-[--accent-primary]">
                            You
                          </span>
                        )}
                      </p>
                    </div>

                    <div className="col-span-3 flex items-center">
                      <span className="text-sm font-bold text-[--accent-primary]">
                        {user.xp.toLocaleString()}
                      </span>
                    </div>

                    <div className="col-span-2 flex items-center">
                      <span
                        className="text-sm font-bold flex items-center gap-1"
                        style={{
                          color:
                            user.discipline_score >= 60
                              ? 'var(--accent-up)'
                              : user.discipline_score >= 40
                              ? 'var(--accent-warning)'
                              : 'var(--accent-down)',
                        }}
                      >
                        {user.discipline_score >= 60 && <ChevronUp size={14} />}
                        {user.discipline_score}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Info Box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8 glass-card-premium p-5"
            >
              <h3 className="font-bold text-[--text-primary] mb-3 flex items-center gap-2 text-sm">
                <Crown size={16} className="text-amber-400" /> How Rankings Work
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-[--text-secondary] opacity-70">
                <div className="flex items-start gap-2">
                  <span className="text-[--accent-up] mt-0.5">●</span>
                  <span><strong>XP:</strong> Earned from games (+50–150) and disciplined trades (+50)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-amber-400 mt-0.5">●</span>
                  <span><strong>Score:</strong> Rises for smart decisions, falls for emotional trading</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[--accent-primary] mt-0.5">●</span>
                  <span><strong>Levels:</strong> Rookie (0–500) → Trader → Analyst → Master (3000+)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[--accent-ai] mt-0.5">●</span>
                  <span><strong>Updates:</strong> Rankings refresh in real-time as you trade</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </main>
  );
}
