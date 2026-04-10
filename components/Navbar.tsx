"use client";

import React, { useEffect, useState } from "react";
import { TrendingUp, Zap, Sun, Moon, Terminal, Gamepad2, Trophy } from "lucide-react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import Link from "next/link";

export const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const [userXP, setUserXP] = useState(1240);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cycleTheme = () => {
    if (theme === "dark") setTheme("light");
    else if (theme === "light") setTheme("neon");
    else setTheme("dark");
  };

  const getThemeIcon = () => {
    if (theme === "dark") return <Moon size={14} />;
    if (theme === "light") return <Sun size={14} />;
    return <Terminal size={14} />;
  };

  const getThemeName = () => {
    if (theme === "dark") return "Dark Glass";
    if (theme === "light") return "Light Frost";
    return "Neon Terminal";
  };

  // Basic check if we are in a scenario
  const isInScenario = pathname?.includes("/scenario/");

  return (
    <nav className="sticky top-0 z-50 h-14 flex items-center justify-between px-6 glass-card-base border-x-0 border-t-0 rounded-none border-b border-b-[var(--nav-border)]">
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2 text-[var(--accent-up)] hover:opacity-80 transition-opacity">
          <TrendingUp size={20} className="stroke-[2.5px]" />
          <span className="font-bold tracking-wider text-lg">ZENTRA</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-1">
          <Link
            href="/dashboard/games"
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              pathname?.includes('/games')
                ? 'bg-[var(--accent-primary)] bg-opacity-20 text-[var(--accent-primary)]'
                : 'text-[var(--text-secondary)] hover:bg-white hover:bg-opacity-5'
            }`}
          >
            <Gamepad2 size={14} />
            Games
          </Link>
          <Link
            href="/dashboard/leaderboard"
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              pathname?.includes('/leaderboard')
                ? 'bg-[var(--accent-primary)] bg-opacity-20 text-[var(--accent-primary)]'
                : 'text-[var(--text-secondary)] hover:bg-white hover:bg-opacity-5'
            }`}
          >
            <Trophy size={14} />
            Leaderboard
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {isInScenario && (
          <span className="text-sm text-[var(--text-secondary)] hidden md:inline-block">
            Training Session
          </span>
        )}

        {mounted && (
          <button
            onClick={cycleTheme}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border border-[var(--border-glass)] bg-[var(--bg-glass)] hover:bg-[var(--text-secondary)]/10 transition-colors"
          >
            {getThemeIcon()}
            <span className="hidden sm:inline">{getThemeName()}</span>
          </button>
        )}

        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-[var(--accent-warning)] border border-[var(--accent-warning)]/20"
          style={{
            background: "rgba(217,119,6,0.06)",
            textShadow: "0 0 8px rgba(217,119,6,0.6)",
            animation: "xpPulse 3s ease-in-out infinite",
          }}
        >
          <Zap size={14} className="fill-current" />
          <span style={{ fontFamily: "ui-monospace, SFMono-Regular, monospace", letterSpacing: "0.05em" }}>{userXP.toLocaleString()} XP</span>
        </div>

        <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm bg-[var(--bg-glass)] border border-[var(--border-glass)]">
          U
        </div>
      </div>
    </nav>
  );
};
