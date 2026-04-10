"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";

import type { BehaviorTag } from "@/lib/behaviorEngine";

type Props = {
  tag: BehaviorTag | null;
  explanation: string;
  visible: boolean;
  onAutoHide?: () => void;
};

function tagColor(tag: BehaviorTag): string {
  switch (tag) {
    case "DISCIPLINED":
      return "var(--accent-up)";
    case "PANIC_SELL":
      return "var(--accent-down)";
    case "FOMO_BUY":
      return "var(--accent-fomo)";
    case "OVERTRADE":
      return "var(--accent-overtrade)";
    case "LOSS_HOLDING":
      return "var(--accent-fomo)";
    default:
      return "var(--text-primary)";
  }
}

function tagEmoji(tag: BehaviorTag): string {
  switch (tag) {
    case "DISCIPLINED": return "🎯";
    case "PANIC_SELL": return "😰";
    case "FOMO_BUY": return "🚀";
    case "OVERTRADE": return "⚡";
    case "LOSS_HOLDING": return "📉";
    default: return "📊";
  }
}

function tagLabel(tag: BehaviorTag): string {
  return tag.replace(/_/g, " ");
}

export default function BehaviorBadge({ tag, explanation, visible, onAutoHide }: Props) {
  React.useEffect(() => {
    if (!visible || !tag) return;
    const t = window.setTimeout(() => {
      onAutoHide?.();
    }, 5000);
    return () => window.clearTimeout(t);
  }, [visible, tag, onAutoHide]);

  return (
    <div style={{ position: "relative", minHeight: 0 }}>
      <AnimatePresence>
        {visible && tag ? (
          <motion.div
            key={`${tag}-${explanation.slice(0, 24)}`}
            initial={{ opacity: 0, y: 24, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="glass-card-base"
            style={{
              marginTop: 12,
              padding: 14,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 20 }}>{tagEmoji(tag)}</span>
              <div style={{ fontSize: 16, fontWeight: 800, color: tagColor(tag), letterSpacing: "0.02em" }}>
                {tagLabel(tag)}
              </div>
            </div>
            {explanation && (
              <p style={{ margin: "8px 0 0", fontSize: 13, lineHeight: 1.5, color: "var(--text-secondary)" }}>
                {explanation}
              </p>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
