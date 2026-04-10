"use client";

import React, { useState, useMemo, useEffect } from "react";
import { MoveRight, Gamepad2, Trophy, TrendingUp, Zap } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import XPDisplay from "@/components/XPDisplay";
import { motion } from "framer-motion";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

const SCENARIOS = [
  {
    id: "5",
    name: "COVID Crash",
    difficulty: "Expert",
    brains: 3,
    glow: "rgba(220,38,38,0.15)",
    accent: "#dc2626",
    context: "March 2020. The world had just learned a new word — lockdown. Within 40 days, the NIFTY 50 lost 40% of its value as global markets went into freefall.",
    days: "40 Days",
    range: "-40% Drop",
    sparkline: "M0 20 L20 25 L40 15 L60 40 L80 80 L100 95 L120 85 L140 100"
  },
  {
    id: "6",
    name: "Bull Rally",
    difficulty: "Beginner",
    brains: 1,
    glow: "rgba(22,163,74,0.15)",
    accent: "#16a34a",
    context: "November 2020. Pfizer announced a vaccine with 90% efficacy. Markets exploded upward overnight. Can you ride the wave without getting swept away?",
    days: "45 Days",
    range: "+30% Surge",
    sparkline: "M0 90 L20 80 L40 60 L60 70 L80 40 L100 20 L120 30 L140 10"
  },
  {
    id: "7",
    name: "Choppy Market",
    difficulty: "Intermediate",
    brains: 2,
    glow: "rgba(217,119,6,0.15)",
    accent: "#d97706",
    context: "April to June 2021. No clear direction. Markets moved sideways in a 1500-point range for 65 days. The most psychologically demanding market type.",
    days: "65 Days",
    range: "1500 pt Range",
    sparkline: "M0 50 L10 30 L30 70 L50 40 L70 60 L90 35 L110 65 L130 45 L140 50"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } }
};

// Animated sparkline with drawing effect
const AnimatedSparkline = ({ path, color, glow }: { path: string; color: string; glow: string }) => {
  return (
    <svg width="100%" height="60" viewBox="0 0 140 100" preserveAspectRatio="none" className="overflow-visible">
      <defs>
        <linearGradient id={`grad-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Fill */}
      <path d={`${path} L 140 100 L 0 100 Z`} fill={`url(#grad-${color.replace('#','')})`} />
      {/* Line */}
      <motion.path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        style={{ filter: `drop-shadow(0px 2px 8px ${glow})` }}
      />
    </svg>
  );
};

export default function DashboardPage() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [userXP, setUserXP] = useState(0);
  const [isLoadingXP, setIsLoadingXP] = useState(true);

  // Load real XP from Supabase
  useEffect(() => {
    (async () => {
      try {
        const { data: authData } = await supabase.auth.getUser();
        const userId = authData.user?.id;
        if (userId) {
          const { data } = await supabase
            .from("user_profiles")
            .select("xp")
            .eq("id", userId)
            .maybeSingle();
          setUserXP(data?.xp ?? 0);
        }
      } catch {
        // Not signed in — show 0
      } finally {
        setIsLoadingXP(false);
      }
    })();
  }, [supabase]);

  return (
    <main className="flex flex-col min-h-screen pt-[120px] p-6 lg:p-12 items-center relative overflow-hidden">
      <div className="dashboard-bg pointer-events-none" />
      <motion.div 
        className="w-full max-w-[1200px] z-10"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center md:text-left"
        >
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3 justify-center md:justify-start">
            <div className="p-2 rounded-xl bg-[var(--accent-up)]/10 border border-[var(--accent-up)]/20">
              <TrendingUp className="text-[var(--accent-up)]" size={28} />
            </div>
            Trading Dashboard
          </h1>
          <p className="text-[var(--text-secondary)] opacity-70">Master market psychology through immersive scenarios and mini-games</p>
        </motion.div>

        {/* Gamification Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {/* XP Display */}
          <div className="md:col-span-1">
            <XPDisplay xp={isLoadingXP ? 0 : userXP} />
          </div>

          {/* Games Button */}
          <Link href="/dashboard/games" className="group">
            <div className="h-full glass-card-premium p-6 transition-all duration-300 hover:shadow-lg hover:shadow-[var(--accent-primary)]/10 cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-bold text-[--text-primary] group-hover:text-[--accent-primary] transition-colors flex items-center gap-2">
                  <Gamepad2 size={24} />
                  Mini-Games
                </h3>
              </div>
              <p className="text-sm text-[--text-secondary] opacity-70 mb-6">
                Quick games to earn bonus XP and practice trading psychology
              </p>
              <div className="space-y-2 text-xs mb-4">
                <p className="text-[--text-secondary] opacity-60 flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-[--accent-up]" /> Guess The Bottom (100 XP)
                </p>
                <p className="text-[--text-secondary] opacity-60 flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-[--accent-warning]" /> Hold The Line (150 XP)
                </p>
                <p className="text-[--text-secondary] opacity-60 flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-[--accent-primary]" /> News Flash (50 XP)
                </p>
              </div>
              <div className="text-xs text-[--accent-primary] font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                Play Games <MoveRight size={14} />
              </div>
            </div>
          </Link>

          {/* Leaderboard Button */}
          <Link href="/dashboard/leaderboard" className="group">
            <div className="h-full glass-card-premium p-6 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/10 cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-bold text-[--text-primary] group-hover:text-amber-400 transition-colors flex items-center gap-2">
                  <Trophy size={24} className="text-amber-400" />
                  Leaderboard
                </h3>
              </div>
              <p className="text-sm text-[--text-secondary] opacity-70 mb-6">
                Compete with other traders and climb to the Master rank
              </p>
              <div className="space-y-2 text-xs mb-4">
                <p className="text-[--accent-primary] font-semibold flex items-center gap-1.5">
                  <Zap size={12} className="fill-current" /> 
                  Your XP: {isLoadingXP ? '...' : userXP.toLocaleString()}
                </p>
              </div>
              <div className="text-xs text-amber-400 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                View Rankings <MoveRight size={14} />
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Scenarios Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold mb-2">Trading Scenarios</h2>
          <p className="text-[var(--text-secondary)] opacity-70">Choose your psychological battleground.</p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="w-full flex flex-col xl:flex-row gap-6 md:gap-8 justify-center"
        >
        {isLoadingXP ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex-1 w-full min-w-[320px] max-w-lg xl:max-w-none mx-auto xl:mx-0">
              <div className="glass-card-base h-full flex flex-col p-6 min-h-[400px] relative overflow-hidden">
                <div className="skeleton-shimmer" />
                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-16 h-6 rounded-full bg-[var(--border)] mb-4" />
                  <div className="w-3/4 h-8 rounded bg-[var(--border)] mb-4" />
                  <div className="w-full h-16 rounded bg-[var(--border)] mb-6" />
                  <div className="w-full h-24 rounded bg-[var(--border)] mt-auto mb-6" />
                  <div className="flex gap-2">
                    <div className="w-16 h-8 rounded-full bg-[var(--border)]" />
                    <div className="w-16 h-8 rounded-full bg-[var(--border)]" />
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          SCENARIOS.map((scenario) => (
          <motion.div key={scenario.id} variants={itemVariants} className="flex-1 w-full min-w-[320px] max-w-lg xl:max-w-none mx-auto xl:mx-0">
            <GlassCard 
              glow={scenario.glow} 
              className="group h-full flex flex-col p-6 min-h-[400px] relative overflow-hidden"
              style={{
                "--hover-glow": scenario.glow,
              } as React.CSSProperties}
            >
              {/* Hover glow overlay */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(circle at 50% -20%, ${scenario.glow}, transparent 60%)` }}
              />

              <div className="relative z-10 flex flex-col h-full">
                {/* Header */}
                <div className="mb-4 text-center xl:text-left">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3 bg-[var(--bg-glass)] border border-[var(--border-glass)] text-[var(--text-secondary)]">
                    {scenario.difficulty}
                  </span>
                  <h2 className="text-2xl xl:text-3xl font-bold tracking-tight">{scenario.name}</h2>
                </div>

                {/* Context */}
                <p className="text-[var(--text-secondary)] leading-relaxed text-sm xl:text-base font-medium mb-6">
                  {scenario.context}
                </p>

                {/* Animated Sparkline */}
                <div className="flex-1 min-h-[60px] flex items-center justify-center opacity-60 group-hover:opacity-100 transition-opacity duration-500">
                  <AnimatedSparkline path={scenario.sparkline} color={scenario.accent} glow={scenario.glow} />
                </div>

                {/* Stat pills */}
                <div className="flex justify-center xl:justify-start gap-2 mb-6 mt-4 flex-wrap">
                  <span className="px-3 py-1.5 rounded-full bg-[var(--bg-glass)] border border-[var(--border-glass)] text-xs font-medium">
                    {scenario.days}
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-[var(--bg-glass)] border border-[var(--border-glass)] text-xs font-medium">
                    {scenario.range}
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-[var(--bg-glass)] border border-[var(--border-glass)] flex gap-1">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <span key={i} className={i < scenario.brains ? "opacity-100" : "opacity-20 grayscale"}>
                        🧠
                      </span>
                    ))}
                  </span>
                </div>

                {/* Button */}
                <div className="mt-auto pt-4">
                  <Link href={`/dashboard/scenario/${scenario.id}`}>
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      className="w-full py-3.5 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2"
                      style={{ backgroundColor: scenario.accent }}
                    >
                      Simulate This Scenario
                      <MoveRight className="w-5 h-5" />
                    </motion.button>
                  </Link>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )))}
      </motion.div>
      </motion.div>
    </main>
  );
}
