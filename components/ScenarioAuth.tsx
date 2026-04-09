"use client";

import * as React from "react";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type Props = {
  /** After OAuth, return here (e.g. current scenario path) */
  returnPath: string;
};

export default function ScenarioAuth({ returnPath }: Props) {
  const supabase = React.useMemo(() => createSupabaseBrowserClient(), []);
  const [userEmail, setUserEmail] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);

  async function ensureProfile(userId: string, email: string) {
    await supabase.from("user_profiles").upsert({ id: userId, email }, { onConflict: "id" });
  }

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (cancelled) return;
      const u = data.user;
      setUserEmail(u?.email ?? null);
      if (u?.id && u.email) await ensureProfile(u.id, u.email);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const u = session?.user;
      setUserEmail(u?.email ?? null);
      if (u?.id && u.email) await ensureProfile(u.id, u.email);
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, [supabase]);

  async function signInWithGoogle() {
    setBusy(true);
    const next = returnPath.startsWith("/") ? returnPath : `/${returnPath}`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    setBusy(false);
    if (error) alert(error.message);
  }

  async function signOut() {
    setBusy(true);
    await supabase.auth.signOut();
    setUserEmail(null);
    setBusy(false);
  }

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 10,
        padding: "10px 12px",
        borderRadius: 12,
        border: "1px solid var(--border)",
        background: "var(--bg-surface)",
        color: "var(--text-secondary)",
        fontSize: 13,
      }}
    >
      {userEmail ? (
        <>
          <span style={{ color: "var(--text-primary)" }}>Signed in as {userEmail}</span>
          <button
            type="button"
            disabled={busy}
            onClick={() => signOut()}
            style={{
              cursor: busy ? "not-allowed" : "pointer",
              padding: "6px 10px",
              borderRadius: 8,
              border: "1px solid var(--border)",
              background: "var(--bg-card)",
              color: "var(--text-primary)",
            }}
          >
            Sign out
          </button>
        </>
      ) : (
        <>
          <span>Sign in to save trades to your account.</span>
          <button
            type="button"
            disabled={busy}
            onClick={() => signInWithGoogle()}
            style={{
              cursor: busy ? "not-allowed" : "pointer",
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid var(--border)",
              background: "var(--accent-ai)",
              color: "white",
              fontWeight: 600,
            }}
          >
            Sign in with Google
          </button>
        </>
      )}
    </div>
  );
}
