"use client";

import React, { useRef, useState, useMemo, useEffect, useCallback } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Html, RoundedBox } from "@react-three/drei";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export const HolographicAuth = () => {
  const groupRef = useRef<THREE.Group>(null);

  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Check current user + listen for auth changes
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const { data } = await supabase.auth.getUser();
      if (cancelled) return;
      setUserEmail(data.user?.email ?? null);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email ?? null);
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, [supabase]);

  const signInWithGoogle = useCallback(async () => {
    setBusy(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent("/dashboard")}`,
      },
    });
    setBusy(false);
    if (error) alert(error.message);
  }, [supabase]);

  const signOut = useCallback(async () => {
    setBusy(true);
    await supabase.auth.signOut();
    setUserEmail(null);
    setBusy(false);
  }, [supabase]);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.position.y = 2.8 + Math.sin(Date.now() * 0.001) * 0.08;
  });

  return (
    <group ref={groupRef} position={[0, 2.8, 6]}>
      {/* Glass Panel body */}
      <RoundedBox args={[5.5, 4, 0.08]} radius={0.15} smoothness={6} castShadow>
        <meshPhysicalMaterial
          color="#0d1117"
          transmission={0.85}
          thickness={0.5}
          roughness={0.05}
          metalness={0.1}
          ior={1.5}
          transparent
          opacity={0.6}
          envMapIntensity={0.3}
          side={THREE.DoubleSide}
        />
      </RoundedBox>

      {/* Glowing edges */}
      <mesh position={[0, 2.0, 0.05]}>
        <boxGeometry args={[5.5, 0.02, 0.02]} />
        <meshStandardMaterial emissive="#3b82f6" emissiveIntensity={3} color="#3b82f6" />
      </mesh>
      <mesh position={[0, -2.0, 0.05]}>
        <boxGeometry args={[5.5, 0.02, 0.02]} />
        <meshStandardMaterial emissive="#22c55e" emissiveIntensity={3} color="#22c55e" />
      </mesh>
      <mesh position={[-2.75, 0, 0.05]}>
        <boxGeometry args={[0.02, 4, 0.02]} />
        <meshStandardMaterial emissive="#3b82f6" emissiveIntensity={2} color="#3b82f6" />
      </mesh>
      <mesh position={[2.75, 0, 0.05]}>
        <boxGeometry args={[0.02, 4, 0.02]} />
        <meshStandardMaterial emissive="#22c55e" emissiveIntensity={2} color="#22c55e" />
      </mesh>

      <pointLight position={[0, 0, -0.5]} color="#3b82f6" intensity={2} distance={8} decay={2} />

      {/* HTML overlay */}
      <Html
        transform
        occlude="blending"
        position={[0, 0, 0.06]}
        scale={0.45}
        style={{ width: "480px", pointerEvents: "auto" }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            padding: "48px 40px",
            fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif",
            color: "#ffffff",
          }}
        >
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "40px", color: "#22c55e" }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
              <polyline points="16 7 22 7 22 13" />
            </svg>
            <span style={{ fontWeight: 800, fontSize: "28px", letterSpacing: "0.12em" }}>ZENTRA</span>
          </div>

          {userEmail ? (
            <>
              <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", marginBottom: "16px" }}>
                Signed in as <span style={{ color: "#22c55e", fontWeight: 600 }}>{userEmail}</span>
              </div>
              <a
                href="/dashboard"
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "12px",
                  padding: "16px 24px",
                  borderRadius: "14px",
                  border: "none",
                  background: "#22c55e",
                  color: "#000",
                  fontWeight: 700,
                  fontSize: "16px",
                  cursor: "pointer",
                  textDecoration: "none",
                  boxShadow: "0 8px 32px rgba(34,197,94,0.3)",
                  transition: "transform 0.2s",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1.02)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
              >
                Enter Dashboard →
              </a>
              <button
                onClick={signOut}
                disabled={busy}
                style={{
                  marginTop: "12px",
                  padding: "8px 16px",
                  borderRadius: "10px",
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "transparent",
                  color: "rgba(255,255,255,0.4)",
                  fontSize: "13px",
                  cursor: busy ? "not-allowed" : "pointer",
                }}
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <button
                onClick={signInWithGoogle}
                disabled={busy}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "12px",
                  padding: "16px 24px",
                  borderRadius: "14px",
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.95)",
                  color: "#000",
                  fontWeight: 600,
                  fontSize: "16px",
                  cursor: busy ? "not-allowed" : "pointer",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                  opacity: busy ? 0.6 : 1,
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1.02)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
                {busy ? "Connecting..." : "Continue with Google"}
              </button>
              <p style={{ marginTop: "32px", fontSize: "13px", color: "rgba(255,255,255,0.4)", fontWeight: 500, lineHeight: 1.5 }}>
                Your trading psychology data is private and never shared.
              </p>
            </>
          )}
        </div>
      </Html>
    </group>
  );
};

export default HolographicAuth;
