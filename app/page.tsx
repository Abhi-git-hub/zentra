/* c:\Users\hp\Desktop\Zentra\app\page.tsx */
"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import HeroCandleScene from "@/components/HeroCandleScene";
import GlassCard from "@/components/GlassCard";

const PageEntrance = () => (
  <motion.div
    className="fixed inset-0 z-50 bg-black pointer-events-none"
    initial={{ opacity: 1 }}
    animate={{ opacity: 0 }}
    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
  />
);

export default function LandingPage() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      setUserEmail(data.user?.email ?? null);
    })();
  }, [supabase]);

  const signIn = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent("/dashboard")}` },
    });
    if (error) alert(error.message);
  }, [supabase]);

  const titleWords = ["TRADE", "WITHOUT", "FEAR"];

  return (
    <>
      <PageEntrance />
      
      {/* ─── Hero Section (Exactly 100vh) ────────────────────────────── */}
      <section 
        className="relative w-full h-[100vh] overflow-hidden"
        style={{
          backgroundImage: "url('/heroImage.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center 60%",
          backgroundColor: "#000000" // Fallback if image misses
        }}
      >
        {/* Gradient Overlay mapping directly to pure black */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.7) 80%, rgba(0,0,0,1) 100%)"
          }}
        />

        {/* 3D Candlestick Scene */}
        {mounted && <HeroCandleScene />}

        {/* Hero Text Logic */}
        <div 
          className="absolute left-[6%] top-1/2 -translate-y-1/2 w-[44%] z-20 flex flex-col items-start"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="rounded-full px-4 py-1.5 mb-6"
            style={{
              background: "rgba(0, 200, 150, 0.12)",
              border: "1px solid rgba(0, 200, 150, 0.3)",
              color: "#00C896",
              fontSize: "13px",
              fontFamily: "'Space Grotesk', sans-serif"
            }}
          >
            AI-Powered Trading Psychology
          </motion.div>

          <h1 
            className="font-bold text-[42px] lg:text-[76px] leading-[1.05] tracking-[-2px] text-white flex flex-wrap gap-x-4 gap-y-2 mb-6"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {titleWords.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.6 + i * 0.08,
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1] // Apple ease
                }}
                style={{ color: word === "FEAR" ? "#FF3B5C" : "#ffffff" }}
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="text-[18px] leading-[1.6] max-w-[480px] mb-10"
            style={{ color: "rgba(255,255,255,0.65)" }}
          >
            90% of traders lose because of emotion, not knowledge. Zentra trains your mind, not just your strategy.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.5 }}
            className="flex gap-4"
          >
            {userEmail ? (
              <Link href="/dashboard">
                <button
                  className="animate-pulse-shadow rounded-[12px] px-9 py-4 font-bold text-[16px] text-black transition-transform hover:scale-105 active:scale-95"
                  style={{ background: "linear-gradient(135deg, #00C896, #00A87E)" }}
                >
                  Enter Dashboard
                </button>
              </Link>
            ) : (
              <button
                onClick={signIn}
                className="animate-pulse-shadow rounded-[12px] px-9 py-4 font-bold text-[16px] text-black transition-transform hover:scale-105 active:scale-95"
                style={{ background: "linear-gradient(135deg, #00C896, #00A87E)" }}
              >
                Begin Training
              </button>
            )}
            
            <button
              className="rounded-[12px] px-9 py-4 font-bold text-[16px] text-white transition-all hover:bg-[rgba(255,255,255,0.05)] active:scale-95"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.2)",
                backdropFilter: "blur(12px)"
              }}
            >
              Watch Demo
            </button>
          </motion.div>
        </div>
      </section>

      {/* ─── Next Section (Pure Black Background) ─────────────────── */}
      <section className="w-full bg-[#000000] py-[80px] lg:py-[120px] px-[5%] lg:px-[8%]">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-[1400px] mx-auto text-center mb-[80px]"
        >
          <div className="uppercase font-bold tracking-[0.2em] text-[12px] text-[#00C896] mb-4">
            The Zentra Method
          </div>
          <h2 className="text-white text-[52px] font-bold tracking-tight mb-4">
            Master the Mental Game
          </h2>
          <p className="text-[#ffffff80] text-[18px] max-w-[600px] mx-auto">
            Our AI-driven behavioral engine detects emotional leakage before it costs you money.
          </p>
        </motion.div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[1400px] mx-auto">
          {[
            { tag: "01", title: "Pattern Detection", desc: "AI maps your cursor hesitations, click speed, and holding patterns." },
            { tag: "02", title: "Real-time Feedback", desc: "Instant cognitive disruption when FOMO or Revenge Trading is detected." },
            { tag: "03", title: "Neuro-plasticity", desc: "Rewire your dopamine responses through repetitive scenario exposure." }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <GlassCard className="p-8 group cursor-default">
                <div className="font-mono-num text-[#7B6EF6] text-[24px] mb-4">{feature.tag}</div>
                <h3 className="text-[24px] font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-[rgba(255,255,255,0.65)] text-[16px] leading-[1.6]">
                  {feature.desc}
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

    </>
  );
}
