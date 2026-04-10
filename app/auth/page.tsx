"use client";

import React, { useMemo } from "react";
import { TrendingUp, LogIn } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { motion } from "framer-motion";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export default function AuthPage() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent("/dashboard")}`,
      },
    });
    if (error) alert(error.message);
  };

  return (
    <main className="flex flex-col min-h-[calc(100vh-56px)] items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <GlassCard className="p-10 flex flex-col items-center text-center">
          <div className="flex items-center gap-2 text-[var(--accent-up)] mb-10">
            <TrendingUp size={32} className="stroke-[2.5px]" />
            <span className="font-bold tracking-wider text-2xl">ZENTRA</span>
          </div>

          <button
            onClick={signInWithGoogle}
            className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl bg-white text-black font-semibold text-base transition-all hover:scale-[1.02] hover:shadow-[0_8px_32px_rgba(34,197,94,0.2)] shadow-[0_4px_12px_rgba(0,0,0,0.1)] active:scale-[0.98]"
          >
            <LogIn className="w-5 h-5" />
            Continue with Google
          </button>

          <p className="mt-8 text-sm text-[var(--text-secondary)] font-medium">
            Your trading psychology data is private and never shared.
          </p>
        </GlassCard>
      </motion.div>
    </main>
  );
}
