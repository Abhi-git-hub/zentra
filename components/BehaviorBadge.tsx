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
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            style={{
              marginTop: 12,
              padding: 14,
              borderRadius: 12,
              border: "1px solid var(--border)",
              background: "var(--bg-surface)",
              color: "var(--text-primary)",
            }}
          >
            <div style={{ fontSize: 20, fontWeight: 800, color: tagColor(tag), letterSpacing: 0.02 }}>
              {tagLabel(tag)}
            </div>
            <p style={{ margin: "8px 0 0", fontSize: 14, lineHeight: 1.45, color: "var(--text-secondary)" }}>
              {explanation}
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
