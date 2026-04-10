"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Zap } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const THEME_CYCLE = ["dark", "light", "neon"] as const;

const THEME_META: Record<string, { icon: React.ReactNode; label: string }> = {
  light: { icon: <Sun size={14} />, label: "Light" },
  dark: { icon: <Moon size={14} />, label: "Dark" },
  neon: { icon: <Zap size={14} />, label: "Neon" },
};

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="w-24 h-8" />;

  const current = theme || "dark";
  const meta = THEME_META[current] || THEME_META.dark;
  const nextIdx = (THEME_CYCLE.indexOf(current as any) + 1) % THEME_CYCLE.length;

  return (
    <button
      onClick={() => setTheme(THEME_CYCLE[nextIdx])}
      className="relative flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium
                 border border-[var(--border)] bg-[var(--bg-surface)] 
                 hover:bg-[var(--bg-card)] hover:border-[var(--accent-primary)]
                 transition-all duration-200 active:scale-95 select-none"
      aria-label={`Switch theme to ${THEME_CYCLE[nextIdx]}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={current}
          initial={{ opacity: 0, y: 8, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.8 }}
          transition={{ duration: 0.15 }}
          className="flex items-center gap-1.5 text-[var(--accent-primary)]"
        >
          {meta.icon}
          <span className="hidden sm:inline text-[var(--text-secondary)]">{meta.label}</span>
        </motion.span>
      </AnimatePresence>
    </button>
  );
};

export default ThemeToggle;
