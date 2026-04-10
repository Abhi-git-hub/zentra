"use client";

import * as React from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { LogIn, LogOut, User } from "lucide-react";

type Props = {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <div className="glass-card-base p-3 text-xs">
      {userEmail ? (
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <User size={12} className="text-[var(--accent-primary)] flex-shrink-0" />
            <span className="text-[var(--text-primary)] truncate text-[11px]">{userEmail}</span>
          </div>
          <button
            type="button"
            disabled={busy}
            onClick={() => signOut()}
            className="flex items-center gap-1 px-2 py-1 rounded-lg border border-[var(--border-glass)] bg-[var(--bg-glass)] text-[var(--text-secondary)] hover:text-white hover:bg-white/[0.05] transition-colors text-[11px] disabled:opacity-50"
          >
            <LogOut size={10} />
            Sign out
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <span className="text-[var(--text-secondary)] opacity-70 text-[11px]">
            Sign in to save trades
          </span>
          <button
            type="button"
            disabled={busy}
            onClick={() => signInWithGoogle()}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[var(--accent-primary)] text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 text-[11px]"
          >
            <LogIn size={12} />
            {busy ? "Connecting..." : "Sign in with Google"}
          </button>
        </div>
      )}
    </div>
  );
}
