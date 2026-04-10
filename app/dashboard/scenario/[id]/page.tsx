"use client";

import * as React from "react";
import { useParams, usePathname } from "next/navigation";
import { motion, useMotionValue, useTransform, animate, AnimatePresence } from "framer-motion";

import BehaviorBadge from "@/components/BehaviorBadge";
import BehaviorRadar from "@/components/BehaviorRadar";
import { ChartSwitcher, ChartType, CHART_TYPES } from "@/components/ChartSwitcher";
import type { CandleData } from "@/components/CandleChart3D";
import ScenarioAuth from "@/components/ScenarioAuth";
import { analyzeTrade, type BehaviorTag, type Trade as EngineTrade } from "@/lib/behaviorEngine";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { GlassCard } from "@/components/ui/GlassCard";
import { Cpu, ShieldAlert, ArrowUp, ArrowDown, Activity, Zap } from "lucide-react";

type ScenarioRow = {
  id: string;
  name: string;
  description: string;
  difficulty: string;
  ohlcv_data: CandleData[];
};

type DbTrade = {
  id: string;
  action: string;
  price: number;
  candle_index: number;
  behavior_tag: string | null;
  score_delta: number | null;
};

// AI Mentor component with Typewriter effect
const AIMentor = ({ text }: { text: string }) => {
  const [displayedText, setDisplayedText] = React.useState("");

  React.useEffect(() => {
    setDisplayedText("");
    let i = 0;
    const words = text.split(" ");
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + (i === 0 ? "" : " ") + words[i]);
      i++;
      if (i >= words.length) clearInterval(interval);
    }, 120);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <div className="text-[var(--text-secondary)] font-medium leading-relaxed min-h-[80px] text-sm">
      {displayedText}
      <motion.span
        animate={{ opacity: [0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 0.8 }}
        className="inline-block w-2 h-4 ml-1 bg-[var(--accent-primary)] align-middle rounded-sm"
      />
    </div>
  );
};

// XP Pop animation
const XPPopup = ({ delta, visible }: { delta: number; visible: boolean }) => (
  <AnimatePresence>
    {visible && (
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.8 }}
        animate={{ opacity: 1, y: -20, scale: 1 }}
        exit={{ opacity: 0, y: -40, scale: 0.6 }}
        transition={{ duration: 0.8 }}
        className="absolute top-0 left-1/2 -translate-x-1/2 z-30 pointer-events-none"
      >
        <span className={`text-lg font-bold ${delta >= 0 ? 'text-[var(--accent-up)]' : 'text-[var(--accent-down)]'}`}>
          {delta >= 0 ? '+' : ''}{delta} XP
        </span>
      </motion.div>
    )}
  </AnimatePresence>
);

export default function ScenarioPage() {
  const params = useParams<{ id: string | string[] }>();
  const pathname = usePathname();
  const scenarioId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const supabase = React.useMemo(() => createSupabaseBrowserClient(), []);

  const [scenario, setScenario] = React.useState<ScenarioRow | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [sessionTrades, setSessionTrades] = React.useState<DbTrade[]>([]);
  const [disciplineScore, setDisciplineScore] = React.useState<number>(50);

  const [visibleUpTo, setVisibleUpTo] = React.useState(1);
  const [saving, setSaving] = React.useState(false);
  const [saveError, setSaveError] = React.useState<string | null>(null);

  const [badgeTag, setBadgeTag] = React.useState<BehaviorTag | null>(null);
  const [badgeExplanation, setBadgeExplanation] = React.useState("");
  const [badgeVisible, setBadgeVisible] = React.useState(false);
  
  const [chartType, setChartType] = React.useState<ChartType>("3D Candles");

  const [mentorText, setMentorText] = React.useState("I am analyzing your trades. Keep an eye on market structure, and do not let fear override your discipline.");

  // XP popup state
  const [xpDelta, setXpDelta] = React.useState(0);
  const [xpPopVisible, setXpPopVisible] = React.useState(false);

  const loadTradesAndProfile = React.useCallback(async () => {
    const userRes = await supabase.auth.getUser();
    const userId = userRes.data.user?.id;
    if (!userId || !scenarioId) {
      setSessionTrades([]);
      return;
    }

    const [tradesRes, profileRes] = await Promise.all([
      supabase
        .from("trades")
        .select("id,action,price,candle_index,behavior_tag,score_delta")
        .eq("scenario_id", scenarioId)
        .eq("user_id", userId)
        .order("created_at", { ascending: true }),
      supabase.from("user_profiles").select("discipline_score").eq("id", userId).maybeSingle(),
    ]);

    if (!tradesRes.error && tradesRes.data) {
      setSessionTrades(tradesRes.data as DbTrade[]);
    }
    if (!profileRes.error && profileRes.data) {
      setDisciplineScore(profileRes.data.discipline_score ?? 50);
    }
  }, [supabase, scenarioId]);

  React.useEffect(() => {
    let active = true;
    (async () => {
      if (!scenarioId) return;
      
      // Prevent passing non-numeric old slugs like "bull-rally" to Postgres bigint
      if (isNaN(Number(scenarioId))) {
        setError("Invalid scenario URL. Please return to the dashboard and select a scenario again.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      const res = await supabase
        .from("scenarios")
        .select("id,name,description,difficulty,ohlcv_data")
        .eq("id", scenarioId)
        .single();
      if (!active) return;
      if (res.error) {
        setError(res.error.message);
        setScenario(null);
      } else {
        setScenario(res.data as ScenarioRow);
        setVisibleUpTo(1);
      }
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [scenarioId, supabase]);

  React.useEffect(() => {
    void loadTradesAndProfile();
  }, [loadTradesAndProfile]);

  const data = React.useMemo(() => scenario?.ohlcv_data ?? [], [scenario]);
  const scenarioPrices = React.useMemo(() => data.map((c) => c.close), [data]);

  const currentIndex = Math.max(0, Math.min(visibleUpTo - 1, Math.max(0, data.length - 1)));
  const currentCandle = data[currentIndex];
  const currentPrice = currentCandle?.close ?? 0;

  // Animated price
  const priceCount = useMotionValue(currentPrice);
  const roundedPrice = useTransform(priceCount, value => value.toFixed(2));

  React.useEffect(() => {
    const animation = animate(priceCount, currentPrice, { duration: 0.8, ease: "easeOut" });
    return animation.stop;
  }, [currentPrice, priceCount]);

  const engineRecentTrades: EngineTrade[] = React.useMemo(() => {
    return sessionTrades.map((t) => ({
      action: t.action as "BUY" | "SELL",
      price: Number(t.price),
      candleIndex: t.candle_index,
      scenarioPrices,
    }));
  }, [sessionTrades, scenarioPrices]);

  // Price change indicator
  const prevCandle = currentIndex > 0 ? data[currentIndex - 1] : null;
  const priceChange = prevCandle ? ((currentPrice - prevCandle.close) / prevCandle.close) * 100 : 0;
  const isUp = priceChange >= 0;

  async function saveTrade(action: "BUY" | "SELL") {
    if (!scenario) return;
    setSaving(true);
    setSaveError(null);
    try {
      const userRes = await supabase.auth.getUser();
      const userId = userRes.data.user?.id;
      if (!userId) throw new Error("You must be signed in (Supabase auth) to place trades.");

      const current: EngineTrade = {
        action,
        price: currentPrice,
        candleIndex: currentIndex,
        scenarioPrices,
      };

      const result = analyzeTrade(current, engineRecentTrades);

      const insert = await supabase.from("trades").insert({
        user_id: userId,
        scenario_id: scenario.id,
        action,
        price: currentPrice,
        candle_index: currentIndex,
        behavior_tag: result.tag,
        score_delta: result.scoreDelta,
      });
      if (insert.error) throw insert.error;

      const { data: profile } = await supabase
        .from("user_profiles")
        .select("discipline_score")
        .eq("id", userId)
        .single();

      const prev = profile?.discipline_score ?? 50;
      const next = Math.min(100, Math.max(0, prev + result.scoreDelta));
      const { error: profErr } = await supabase
        .from("user_profiles")
        .update({ discipline_score: next })
        .eq("id", userId);
      if (profErr) throw profErr;

      setDisciplineScore(next);
      setBadgeTag(result.tag);
      setBadgeExplanation(result.explanation);
      setBadgeVisible(true);
      
      // XP popup
      setXpDelta(result.scoreDelta);
      setXpPopVisible(true);
      setTimeout(() => setXpPopVisible(false), 1200);
      
      setMentorText(result.explanation ? result.explanation : `You placed a ${action} order. Let's see how it plays out.`);

      await loadTradesAndProfile();
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : "Failed to save trade.");
      setMentorText("There was an error communicating with the exchange network.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
          <Activity size={32} className="text-[var(--accent-primary)]" />
        </motion.div>
        <span className="text-sm text-[var(--text-secondary)] opacity-70">Loading scenario...</span>
      </div>
    );
  }

  if (error || !scenario) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <ShieldAlert size={48} className="mx-auto text-[var(--accent-down)] mb-4" />
          <h2 className="text-xl font-bold">{error || "Scenario not found"}</h2>
          <a href="/dashboard" className="mt-4 inline-block text-sm text-[var(--accent-primary)] hover:underline">
            ← Back to Dashboard
          </a>
        </div>
      </div>
    );
  }

  // Slice data for ChartSwitcher based on visibleUpTo
  const visibleData = data.slice(0, visibleUpTo);

  return (
    <main className="flex flex-col min-h-[calc(100vh-56px)] overflow-hidden">
      <div className="w-full flex-1 flex flex-col lg:flex-row p-4 gap-4 xl:px-8 xl:py-6 max-h-[calc(100vh-56px)]">
        
        {/* LEFT COLUMN (22%) */}
        <div className="lg:w-[22%] flex flex-col gap-4">
          <GlassCard className="p-5 flex-shrink-0 flex flex-col gap-4">
            <div>
              <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-[var(--bg-glass)] border border-[var(--border-glass)] text-[var(--accent-primary)] mb-2">
                {scenario.difficulty}
              </span>
              <h1 className="text-xl font-bold tracking-tight mb-1">{scenario.name}</h1>
              <p className="text-xs text-[var(--text-secondary)] line-clamp-3">
                {scenario.description}
              </p>
            </div>
            
            <div className="mt-4 p-4 rounded-xl bg-black/20 border border-[var(--border-glass)] relative overflow-hidden">
              <div className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-1">
                Current Price
              </div>
              <div className="text-3xl font-bold text-white flex items-center gap-1 font-mono tracking-tighter">
                $ <motion.span>{roundedPrice}</motion.span>
              </div>
              {/* Price change indicator */}
              <div className={`mt-1 text-xs font-semibold flex items-center gap-1 ${isUp ? 'text-[var(--accent-up)]' : 'text-[var(--accent-down)]'}`}>
                {isUp ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                {isUp ? '+' : ''}{priceChange.toFixed(2)}%
              </div>
              {/* Subtle glow */}
              <div className={`absolute inset-0 rounded-xl pointer-events-none ${isUp ? 'bg-[var(--accent-up)]' : 'bg-[var(--accent-down)]'} opacity-[0.03]`} />
            </div>
          </GlassCard>

          <GlassCard className="p-5 flex-1 flex flex-col">
            <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-4 flex items-center gap-2">
              <Activity size={16} /> Chart Display
            </h3>
            <div className="flex flex-col gap-2">
              {CHART_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => setChartType(type)}
                  className={`relative w-full text-left px-4 py-3 rounded-xl border transition-all duration-200 ${
                    chartType === type 
                      ? "bg-[var(--accent-primary)]/10 border-[var(--accent-primary)]/50 text-white font-medium" 
                      : "bg-[var(--bg-glass)] border-transparent text-[var(--text-secondary)] hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {chartType === type && (
                    <motion.div
                      layoutId="chartTypeIndicator"
                      className="absolute inset-0 rounded-xl border border-[var(--accent-primary)]/30 bg-[var(--accent-primary)]/5"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{type}</span>
                </button>
              ))}
            </div>

            <div className="mt-auto pt-6">
              <ScenarioAuth returnPath={pathname || "/dashboard"} />
            </div>
          </GlassCard>
        </div>

        {/* CENTER COLUMN (56%) */}
        <div className="lg:w-[56%] flex flex-col gap-4">
          <GlassCard className="flex-1 flex flex-col relative overflow-hidden p-2">
            <ChartSwitcher data={visibleData} externalType={chartType} />
            
            {/* Timeline Scrubber */}
            <div className="absolute top-4 left-6 right-6 z-10 glass-card-base px-4 py-3 flex items-center gap-4">
               <span className="text-xs font-bold whitespace-nowrap text-[var(--text-secondary)]">Day {visibleUpTo}</span>
               <input
                  type="range"
                  min={1}
                  max={Math.max(1, data.length)}
                  value={visibleUpTo}
                  onChange={(e) => setVisibleUpTo(Number(e.target.value))}
                  className="w-full"
                />
               <span className="text-xs font-bold whitespace-nowrap text-[var(--text-secondary)]">{data.length}</span>
            </div>
          </GlassCard>

          {/* Action Area */}
          <div className="flex gap-4 h-24 flex-shrink-0">
            <motion.button
              onClick={() => saveTrade("BUY")}
              disabled={saving || !currentCandle}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="group relative flex-1 rounded-2xl border border-[var(--nav-border)] overflow-hidden disabled:opacity-50 disabled:pointer-events-none"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--accent-up)]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 bg-[var(--bg-glass)]" />
              <div className="relative z-10 h-full flex flex-col items-center justify-center text-[var(--accent-up)]">
                <ArrowUp size={24} className="mb-1 group-hover:-translate-y-1 transition-transform" />
                <span className="font-bold tracking-widest text-lg">BUY LONG</span>
              </div>
            </motion.button>
            <motion.button
               onClick={() => saveTrade("SELL")}
               disabled={saving || !currentCandle}
               whileHover={{ scale: 1.02 }}
               whileTap={{ scale: 0.97 }}
              className="group relative flex-1 rounded-2xl border border-[var(--nav-border)] overflow-hidden disabled:opacity-50 disabled:pointer-events-none"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--accent-down)]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 bg-[var(--bg-glass)]" />
              <div className="relative z-10 h-full flex flex-col items-center justify-center text-[var(--accent-down)]">
                <ArrowDown size={24} className="mb-1 group-hover:translate-y-1 transition-transform" />
                <span className="font-bold tracking-widest text-lg">SELL SHORT</span>
              </div>
            </motion.button>
          </div>
        </div>

        {/* RIGHT COLUMN (22%) */}
        <div className="lg:w-[22%] flex flex-col gap-4">
          
          <GlassCard className="p-5 flex flex-col">
             <div className="flex items-center justify-between mb-4">
               <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--text-secondary)] flex items-center gap-2">
                 <ShieldAlert size={16} className={disciplineScore < 40 ? "text-[var(--accent-down)]" : disciplineScore < 70 ? "text-[var(--accent-warning)]" : "text-[var(--accent-up)]"} /> 
                 Discipline
               </h3>
               <motion.span
                 key={disciplineScore}
                 initial={{ scale: 1.3 }}
                 animate={{ scale: 1 }}
                 className="text-xl font-mono font-bold"
               >
                 {Math.round(disciplineScore)}
               </motion.span>
             </div>
             
             {/* Gauge spring width */}
             <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden relative">
               <motion.div 
                 className={`h-full rounded-full ${disciplineScore < 40 ? "bg-[var(--accent-down)]" : disciplineScore < 70 ? "bg-[var(--accent-warning)]" : "bg-[var(--accent-up)]"}`}
                 initial={{ width: 0 }}
                 animate={{ width: `${disciplineScore}%` }}
                 transition={{ type: "spring", stiffness: 50, damping: 15 }}
               />
               <div className="absolute inset-0 shimmer-bar rounded-full" />
             </div>

             {/* Trade count */}
             <div className="mt-3 flex items-center justify-between text-xs text-[var(--text-secondary)]">
               <span className="opacity-60">{sessionTrades.length} trades this session</span>
               <span className="flex items-center gap-1 text-[var(--accent-primary)]">
                 <Zap size={12} className="fill-current" />
                 Active
               </span>
             </div>
          </GlassCard>

          <GlassCard className="p-5 flex-1 flex flex-col">
            <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-4 flex items-center gap-2">
              <Cpu size={16} /> AI Mentor
            </h3>
            
            <AIMentor text={mentorText} />
            
            <div className="mt-8 flex-1 relative flex flex-col items-center justify-end">
               {/* Behavior Badge stack drops in */}
               <div className="w-full relative z-20 translate-y-4">
                 <BehaviorBadge
                    tag={badgeTag}
                    explanation={badgeExplanation}
                    visible={badgeVisible}
                    onAutoHide={() => setBadgeVisible(false)}
                 />
                 {/* XP Popup */}
                 <XPPopup delta={xpDelta} visible={xpPopVisible} />
               </div>
               
               {saveError && <div className="text-center text-xs text-[var(--accent-down)] mt-2 font-medium">{saveError}</div>}
               
               {/* Radar chart taking bottom space */}
               <div className="w-full opacity-60 scale-90 -mt-10 pointer-events-none">
                 <BehaviorRadar trades={sessionTrades} />
               </div>
            </div>
          </GlassCard>

        </div>
      </div>
    </main>
  );
}
