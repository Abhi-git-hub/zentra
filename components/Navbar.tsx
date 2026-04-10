/* c:\Users\hp\Desktop\Zentra\components\Navbar.tsx */
"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Zap, User } from "lucide-react";
import { motion } from "framer-motion";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import ThemeToggle from "./ThemeToggle";

export const Navbar = () => {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userXP, setUserXP] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase.auth.getUser();
        const u = data.user;
        setUserEmail(u?.email ?? null);
        if (u?.id) {
          const { data: profile } = await supabase
            .from("user_profiles")
            .select("xp")
            .eq("id", u.id)
            .maybeSingle();
          setUserXP(profile?.xp ?? 0);
        }
      } catch {
        // Not signed in
      }
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email ?? null);
    });
    return () => { sub.subscription.unsubscribe(); };
  }, [supabase]);

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.8 }}
      style={{
        height: "64px",
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        position: "fixed",
        top: 0,
        width: "100%",
        zIndex: 100,
      }}
      className="flex items-center justify-between px-6 lg:px-[8%]"
    >
      {/* Left: Logo */}
      <div className="flex items-center">
        <a href="/" className="font-bold text-[20px] tracking-wide relative z-10 font-sans" style={{fontFamily: "'Space Grotesk', sans-serif"}}>
          <span style={{ color: "#00C896" }}>Z</span>
          <span className="text-white">ENTRA</span>
        </a>
      </div>

      {/* Right: Controls & User */}
      <div className="flex items-center gap-4 relative z-10">
        <ThemeToggle />

        {userXP > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)]">
            <Zap size={14} color="#7B6EF6" className="fill-[#7B6EF6]" />
            <span className="font-mono-num text-[13px] text-white">
              {userXP.toLocaleString()}
            </span>
          </div>
        )}

        {/* User avatar */}
        {userEmail ? (
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shadow-[0_0_15px_rgba(123,110,246,0.3)]"
            style={{
              background: "linear-gradient(135deg, rgba(0,200,150,0.2), rgba(123,110,246,0.2))",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#fff",
            }}
          >
            {userEmail[0].toUpperCase()}
          </div>
        ) : (
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)]"
          >
            <User size={16} color="rgba(255,255,255,0.5)" />
          </div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
