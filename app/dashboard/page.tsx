"use client";

import React from "react";
import { MoveRight, Star, Gamepad2, Trophy, TrendingUp } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import XPDisplay from "@/components/XPDisplay";
import { motion } from "framer-motion";
import Link from "next/link";

const SCENARIOS = [
  {
    id: "5",
    name: "COVID Crash",
    difficulty: "Expert",
    brains: 3,
    glow: "rgba(220,38,38,0.15)",
    accent: "#dc2626", // Red
    context: "March 2020. The world had just learned a new word — lockdown. Within 40 days, the NIFTY 50 lost 40% of its value as global markets went into freefall. Panic selling reached levels not seen since the 2008 financial crisis. This is the scenario that separates disciplined traders from emotional ones.",
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
    accent: "#16a34a", // Green
    context: "November 2020. Pfizer announced a vaccine with 90% efficacy. Markets exploded upward overnight. The NIFTY 50 gained 30% in 45 days — but FOMO buying at the top destroyed many portfolios. Can you ride the wave without getting swept away?",
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
    accent: "#d97706", // Amber
    context: "April to June 2021. No clear direction. No narrative to cling to. Markets moved sideways in a 1500-point range for 65 days, triggering overtrading in thousands of retail accounts. The most psychologically demanding market type of all.",
    days: "65 Days",
    range: "1500 pt Range",
    sparkline: "M0 50 L10 30 L30 70 L50 40 L70 60 L90 35 L110 65 L130 45 L140 50"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } }
};

export default function DashboardPage() {
  return (
    <main className="flex flex-col min-h-[calc(100vh-56px)] p-6 lg:p-12 items-center">
      <div className="w-full max-w-[1200px]">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center md:text-left"
        >
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <TrendingUp className="text-[var(--accent-up)]" size={32} />
            Trading Dashboard
          </h1>
          <p className="text-[var(--text-secondary)]">Master market psychology through immersive scenarios and mini-games</p>
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
            <XPDisplay xp={2450} />
          </div>

          {/* Games Button */}
          <Link href="/dashboard/games" className="group">
            <div
              className="h-full bg-gradient-to-br from-[--bg-glass] to-transparent border border-[--border-glass] rounded-lg p-6 backdrop-blur-sm transition-all duration-300 hover:border-[--accent-primary] hover:shadow-lg hover:shadow-[--accent-primary]/20 cursor-pointer"
              style={{
                backgroundColor: 'var(--bg-glass)',
                borderColor: 'var(--border-glass)',
              }}
            >
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
                <p className="text-[--text-secondary] opacity-60">• Guess The Bottom (100 XP)</p>
                <p className="text-[--text-secondary] opacity-60">• Hold The Line (150 XP)</p>
                <p className="text-[--text-secondary] opacity-60">• News Flash (50 XP)</p>
              </div>
              <div className="text-xs text-[--accent-primary] font-semibold group-hover:translate-x-1 transition-transform">
                Play Games →
              </div>
            </div>
          </Link>

          {/* Leaderboard Button */}
          <Link href="/dashboard/leaderboard" className="group">
            <div
              className="h-full bg-gradient-to-br from-[--bg-glass] to-transparent border border-[--border-glass] rounded-lg p-6 backdrop-blur-sm transition-all duration-300 hover:border-[--accent-primary] hover:shadow-lg hover:shadow-[--accent-primary]/20 cursor-pointer"
              style={{
                backgroundColor: 'var(--bg-glass)',
                borderColor: 'var(--border-glass)',
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-bold text-[--text-primary] group-hover:text-[--accent-primary] transition-colors flex items-center gap-2">
                  <Trophy size={24} />
                  🏆 Leaderboard
                </h3>
              </div>
              <p className="text-sm text-[--text-secondary] opacity-70 mb-6">
                Compete with other traders and climb to the Master rank
              </p>
              <div className="space-y-2 text-xs mb-4">
                <p className="text-[--accent-primary] font-semibold">Your Rank: #42</p>
                <p className="text-[--accent-primary] font-semibold">Your XP: 2,450</p>
              </div>
              <div className="text-xs text-[--accent-primary] font-semibold group-hover:translate-x-1 transition-transform">
                View Rankings →
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
          <p className="text-[var(--text-secondary)]">Choose your psychological battleground.</p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="w-full flex flex-col xl:flex-row gap-6 md:gap-8 justify-center"
        >
        {SCENARIOS.map((scenario) => (
          <motion.div key={scenario.id} variants={itemVariants} className="flex-1 w-full min-w-[320px] max-w-lg xl:max-w-none mx-auto xl:mx-0">
            <GlassCard 
              glow={scenario.glow} 
              className="group h-full flex flex-col p-6 min-h-[420px] transition-transform duration-500 ease-spring hover:-translate-y-2 relative overflow-hidden"
              style={{
                "--hover-glow": scenario.glow,
              } as React.CSSProperties}
            >
              {/* Intensify glow on hover via pseudo element */}
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

                {/* Sparkline Space */}
                <div className="flex-1 min-h-[60px] flex items-center justify-center opacity-60 group-hover:opacity-100 transition-opacity">
                  <svg width="100%" height="60" viewBox="0 0 140 100" preserveAspectRatio="none" className="overflow-visible">
                    <path 
                      d={scenario.sparkline} 
                      fill="none" 
                      stroke={scenario.accent} 
                      strokeWidth="3" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      style={{ filter: `drop-shadow(0px 4px 6px ${scenario.glow})` }}
                    />
                  </svg>
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
                    <button 
                      className="w-full py-3.5 rounded-xl font-bold text-white shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 group/btn"
                      style={{ backgroundColor: scenario.accent }}
                    >
                      Simulate This Scenario
                      <MoveRight className="w-5 h-5 transition-transform group-hover/btn:translate-x-1" />
                    </button>
                  </Link>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>
    </main>
  );
}
