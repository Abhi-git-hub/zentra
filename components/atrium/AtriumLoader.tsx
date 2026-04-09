"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AtriumLoaderProps {
  onComplete: () => void;
}

export const AtriumLoader = ({ onComplete }: AtriumLoaderProps) => {
  const [phase, setPhase] = useState(0); // 0 = building, 1 = revealing, 2 = done

  useEffect(() => {
    // Phase 0: particles assemble (1.5s)
    const t1 = setTimeout(() => setPhase(1), 1500);
    // Phase 1: light cue + fade (1.2s)
    const t2 = setTimeout(() => {
      setPhase(2);
      onComplete();
    }, 2700);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase < 2 && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "#050510",
            pointerEvents: "all",
          }}
        >
          {/* Central particle burst */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: phase >= 1 ? 1.5 : 1,
              opacity: phase >= 1 ? 0 : 1,
            }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(34,197,94,0.6) 0%, transparent 70%)",
              boxShadow: "0 0 60px rgba(34,197,94,0.3)",
            }}
          />

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: phase === 0 ? 1 : 0, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            style={{
              marginTop: 32,
              fontFamily: "ui-sans-serif, system-ui, sans-serif",
              fontWeight: 700,
              fontSize: 18,
              letterSpacing: "0.2em",
              color: "rgba(255,255,255,0.5)",
            }}
          >
            INITIALIZING ATRIUM
          </motion.div>

          {/* Progress bar */}
          <motion.div
            style={{
              marginTop: 24,
              width: 200,
              height: 2,
              background: "rgba(255,255,255,0.08)",
              borderRadius: 1,
              overflow: "hidden",
            }}
          >
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: phase >= 1 ? "100%" : "60%" }}
              transition={{ duration: phase >= 1 ? 0.5 : 1.5, ease: "easeOut" }}
              style={{
                height: "100%",
                background: "#22c55e",
                borderRadius: 1,
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AtriumLoader;
