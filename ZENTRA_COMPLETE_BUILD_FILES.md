# ZENTRA — COMPLETE VIBE-CODING BUILD FILES
## "Where Trading Meets AI & Emotion"
### Everything you need to hand to Cursor / v0 / Copilot / Claude

---

## FILE 1: package.json

```json
{
  "name": "zentra",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "14.2.0",
    "react": "^18",
    "react-dom": "^18",
    "typescript": "^5",
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "tailwindcss": "^3",
    "autoprefixer": "^10",
    "postcss": "^8",

    "@supabase/supabase-js": "^2.43.0",
    "next-auth": "^4.24.0",

    "three": "^0.163.0",
    "@react-three/fiber": "^8.16.0",
    "@react-three/drei": "^9.105.0",
    "@types/three": "^0.163.0",

    "framer-motion": "^11.1.0",
    "recharts": "^2.12.0",

    "next-themes": "^0.3.0",
    "lucide-react": "^0.378.0",
    "clsx": "^2.1.1",
    "ai": "^3.1.0"
  }
}
```

---

## FILE 2: .env.local (fill in your values)

```bash
# Supabase — get from supabase.com → project settings → API
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Anthropic — get from console.anthropic.com
ANTHROPIC_API_KEY=sk-ant-...

# NextAuth — generate a random secret: openssl rand -base64 32
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000

# Google OAuth — get from console.cloud.google.com
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

---

## FILE 3: app/globals.css  (THE THEME SYSTEM — this is the magic)

```css
/* ====================================================
   ZENTRA GLOBAL CSS — THREE THEME SYSTEM
   All colors flow through these CSS variables.
   Changing the theme = changing these vars = DONE.
   ==================================================== */

:root {
  /* Light Theme (default) */
  --bg-primary: #FFFFFF;
  --bg-surface: #F4F4F0;
  --bg-card: #FFFFFF;
  --bg-overlay: rgba(0,0,0,0.04);

  --text-primary: #0A0A0A;
  --text-secondary: #6B6B6B;
  --text-muted: #9CA3AF;

  --accent-up: #16A34A;        /* green candle / profit */
  --accent-down: #DC2626;      /* red candle / loss */
  --accent-fomo: #D97706;      /* FOMO warning amber */
  --accent-ai: #7C3AED;        /* AI mentor purple */
  --accent-discipline: #0EA5E9; /* discipline score blue */

  --border: rgba(0,0,0,0.08);
  --border-strong: rgba(0,0,0,0.15);

  --shadow: 0 1px 3px rgba(0,0,0,0.08);

  /* 3D chart colors — used in Three.js via JS variables */
  --candle-up-hex: #16A34A;
  --candle-down-hex: #DC2626;
}

[data-theme="dark"] {
  --bg-primary: #0A0A0A;
  --bg-surface: #141414;
  --bg-card: #1C1C1C;
  --bg-overlay: rgba(255,255,255,0.04);

  --text-primary: #F5F5F0;
  --text-secondary: #A1A1AA;
  --text-muted: #52525B;

  --accent-up: #22C55E;
  --accent-down: #EF4444;
  --accent-fomo: #F59E0B;
  --accent-ai: #A78BFA;
  --accent-discipline: #38BDF8;

  --border: rgba(255,255,255,0.08);
  --border-strong: rgba(255,255,255,0.15);

  --shadow: 0 1px 3px rgba(0,0,0,0.4);
}

[data-theme="neon"] {
  /* THE TRADING TERMINAL AESTHETIC — judges will love this */
  --bg-primary: #050B1A;
  --bg-surface: #0D1929;
  --bg-card: #0D1929;
  --bg-overlay: rgba(0,255,148,0.03);

  --text-primary: #E8F4FF;
  --text-secondary: #7BAFD4;
  --text-muted: #3A6B8A;

  --accent-up: #00FF94;        /* electric green */
  --accent-down: #FF2D55;      /* hot pink/red */
  --accent-fomo: #FFD60A;      /* electric yellow */
  --accent-ai: #BF5AF2;        /* neon purple */
  --accent-discipline: #0A84FF; /* electric blue */

  --border: rgba(0,255,148,0.12);
  --border-strong: rgba(0,255,148,0.25);

  --shadow: 0 0 20px rgba(0,255,148,0.05);
}

/* ====================================================
   BASE STYLES
   ==================================================== */

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background: var(--bg-primary);
  color: var(--text-primary);
  font-family: var(--font-geist-sans), -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  transition: background 200ms ease, color 200ms ease;
  -webkit-font-smoothing: antialiased;
}

/* ALL elements transition on theme change — this creates the smooth toggle feel */
*, *::before, *::after {
  transition: background-color 200ms ease, border-color 200ms ease, color 200ms ease;
}

/* Mono for numbers — trading apps should always use monospace for prices */
.mono, .price, .stat {
  font-family: var(--font-geist-mono), 'JetBrains Mono', 'Courier New', monospace;
}

/* ====================================================
   LANDING PAGE — ANIMATED MESH GRADIENT BACKGROUND
   ==================================================== */

.hero-bg {
  position: relative;
  overflow: hidden;
  background: var(--bg-primary);
}

.hero-bg::before {
  content: '';
  position: absolute;
  inset: 0;
  background: 
    radial-gradient(ellipse 80% 80% at 20% 20%, rgba(22, 163, 74, 0.15) 0%, transparent 60%),
    radial-gradient(ellipse 60% 60% at 80% 80%, rgba(220, 38, 38, 0.12) 0%, transparent 60%),
    radial-gradient(ellipse 50% 50% at 50% 50%, rgba(124, 58, 237, 0.08) 0%, transparent 70%);
  animation: meshShift 8s ease-in-out infinite alternate;
  pointer-events: none;
}

[data-theme="neon"] .hero-bg::before {
  background:
    radial-gradient(ellipse 80% 80% at 20% 20%, rgba(0, 255, 148, 0.1) 0%, transparent 60%),
    radial-gradient(ellipse 60% 60% at 80% 80%, rgba(255, 45, 85, 0.1) 0%, transparent 60%),
    radial-gradient(ellipse 50% 50% at 50% 50%, rgba(191, 90, 242, 0.06) 0%, transparent 70%);
}

@keyframes meshShift {
  0%   { transform: scale(1) rotate(0deg); opacity: 0.8; }
  50%  { transform: scale(1.1) rotate(2deg); opacity: 1; }
  100% { transform: scale(1.05) rotate(-1deg); opacity: 0.9; }
}

/* Ticker strip */
.ticker-strip {
  background: var(--bg-surface);
  border-bottom: 1px solid var(--border);
  padding: 6px 0;
  overflow: hidden;
  font-family: var(--font-geist-mono), monospace;
  font-size: 12px;
}

.ticker-inner {
  display: flex;
  gap: 48px;
  animation: ticker 30s linear infinite;
  white-space: nowrap;
}

@keyframes ticker {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

/* ====================================================
   DASHBOARD COMPONENTS
   ==================================================== */

.card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: var(--shadow);
}

.behavior-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.3px;
}

.badge-disciplined { background: rgba(22,163,74,0.15); color: var(--accent-up); }
.badge-panic       { background: rgba(220,38,38,0.15); color: var(--accent-down); }
.badge-fomo        { background: rgba(217,119,6,0.15); color: var(--accent-fomo); }
.badge-overtrade   { background: rgba(14,165,233,0.15); color: var(--accent-discipline); }

/* Discipline score gauge */
.score-gauge {
  position: relative;
  width: 120px;
  height: 60px;
  overflow: hidden;
}

/* Neon glow effect on cards in neon theme */
[data-theme="neon"] .card {
  border-color: var(--border);
  box-shadow: 0 0 0 1px var(--border), 0 0 30px rgba(0,255,148,0.03);
}

[data-theme="neon"] .card:hover {
  border-color: var(--border-strong);
  box-shadow: 0 0 0 1px var(--border-strong), 0 0 30px rgba(0,255,148,0.06);
}

/* Trade buttons */
.btn-buy {
  background: var(--accent-up);
  color: white;
  border: none;
  padding: 12px 32px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s, transform 0.1s;
}

.btn-buy:hover  { opacity: 0.9; }
.btn-buy:active { transform: scale(0.97); }

.btn-sell {
  background: var(--accent-down);
  color: white;
  border: none;
  padding: 12px 32px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s, transform 0.1s;
}

.btn-sell:hover  { opacity: 0.9; }
.btn-sell:active { transform: scale(0.97); }

/* AI mentor panel typing effect */
.typewriter {
  overflow: hidden;
  border-right: 2px solid var(--accent-ai);
  white-space: nowrap;
  animation: typing 2s steps(40, end), blink 0.75s step-end infinite;
}

@keyframes typing  { from { width: 0; } to { width: 100%; } }
@keyframes blink   { from { border-color: transparent; } to { border-color: var(--accent-ai); } }
```

---

## FILE 4: lib/behaviorEngine.ts  (THE CORE ALGORITHM)

```typescript
// ============================================================
//  ZENTRA BEHAVIOR ENGINE
//  Analyzes a user's trades and tags behavioral patterns.
//  This is the core IP of Zentra — simple rules, high signal.
// ============================================================

export type BehaviorTag =
  | 'DISCIPLINED'    // Good trade — entered/exited at the right time
  | 'PANIC_SELL'     // Sold near the bottom due to fear
  | 'FOMO_BUY'       // Bought near the top chasing gains
  | 'OVERTRADE'      // Too many trades in a short window
  | 'LOSS_HOLDING';  // Held a losing position too long

export interface Trade {
  action: 'BUY' | 'SELL';
  price: number;
  candleIndex: number;       // Which candle in the scenario (0-indexed)
  timestamp: number;         // Unix ms
  scenarioPrices: number[];  // Full array of close prices in scenario
}

export interface BehaviorResult {
  tag: BehaviorTag;
  confidence: number;   // 0–1
  explanation: string;  // Human-readable, used by AI Mentor as context
  scoreDelta: number;   // How much to change the discipline score
}

export function analyzeTrade(
  trade: Trade,
  recentTrades: Trade[]
): BehaviorResult {

  const { action, candleIndex, price, scenarioPrices } = trade;
  const windowSize = 5; // candles around the trade to analyze
  const overtradThreshold = 5; // trades in 10 candles = overtrading

  // --- 1. PANIC SELL DETECTION ---
  // Panic sell = selling within N candles of a local bottom
  if (action === 'SELL') {
    const lookAhead = scenarioPrices.slice(
      candleIndex,
      Math.min(candleIndex + windowSize, scenarioPrices.length)
    );
    const localMin = Math.min(...lookAhead);
    const priceDrop = (localMin - price) / price; // negative = dropped after sell

    // If price dropped more than 2% AFTER the sell → they got lucky, not disciplined
    // If price ROSE more than 3% after the sell → panic sell (sold too early)
    const priceAfter = scenarioPrices[Math.min(candleIndex + 3, scenarioPrices.length - 1)];
    const priceRise = (priceAfter - price) / price;

    if (priceRise > 0.03) {
      return {
        tag: 'PANIC_SELL',
        confidence: Math.min(priceRise * 10, 1),
        explanation: `Sold at ₹${price.toFixed(2)}, but price rose ${(priceRise * 100).toFixed(1)}% within 3 candles. Classic panic exit.`,
        scoreDelta: -8,
      };
    }
  }

  // --- 2. FOMO BUY DETECTION ---
  // FOMO buy = buying near a local top (price falls significantly after)
  if (action === 'BUY') {
    const lookAhead = scenarioPrices.slice(
      candleIndex,
      Math.min(candleIndex + windowSize, scenarioPrices.length)
    );
    const priceAfter = scenarioPrices[Math.min(candleIndex + 3, scenarioPrices.length - 1)];
    const priceDrop = (price - priceAfter) / price; // positive = dropped after buy

    if (priceDrop > 0.025) {
      return {
        tag: 'FOMO_BUY',
        confidence: Math.min(priceDrop * 15, 1),
        explanation: `Bought at ₹${price.toFixed(2)} near a local peak. Price dropped ${(priceDrop * 100).toFixed(1)}% after. Bought the top.`,
        scoreDelta: -6,
      };
    }
  }

  // --- 3. OVERTRADE DETECTION ---
  // More than N trades in a short window = emotional overtrading
  const recentWindow = recentTrades.filter(
    t => Math.abs(t.candleIndex - candleIndex) <= 10
  );
  if (recentWindow.length >= overtradThreshold) {
    return {
      tag: 'OVERTRADE',
      confidence: Math.min(recentWindow.length / 10, 1),
      explanation: `${recentWindow.length} trades in 10 candles. Overtrading signals emotional decision-making, not strategy.`,
      scoreDelta: -4,
    };
  }

  // --- 4. LOSS HOLDING DETECTION ---
  // Held a position while it was down > 5%, never cut losses
  if (action === 'SELL') {
    const buyTrades = recentTrades
      .filter(t => t.action === 'BUY')
      .sort((a, b) => b.candleIndex - a.candleIndex);
    const lastBuy = buyTrades[0];
    if (lastBuy) {
      const lossPercent = (lastBuy.price - price) / lastBuy.price;
      if (lossPercent > 0.07) {
        return {
          tag: 'LOSS_HOLDING',
          confidence: Math.min(lossPercent * 5, 1),
          explanation: `Exited at ${(lossPercent * 100).toFixed(1)}% loss from entry. Held too long hoping for recovery.`,
          scoreDelta: -5,
        };
      }
    }
  }

  // --- 5. DISCIPLINED (default) ---
  return {
    tag: 'DISCIPLINED',
    confidence: 0.7,
    explanation: `${action} at ₹${price.toFixed(2)} — timing was within a reasonable range. Consistent with a planned approach.`,
    scoreDelta: +10,
  };
}

// Compute aggregate behavior stats from all trades (for RadarChart)
export function computeBehaviorStats(trades: Trade[]): {
  disciplined: number;
  panic: number;
  fomo: number;
  overtrade: number;
  lossHolding: number;
} {
  const tags = trades.map((t, i) =>
    analyzeTrade(t, trades.slice(0, i)).tag
  );

  const total = Math.max(tags.length, 1);
  return {
    disciplined: tags.filter(t => t === 'DISCIPLINED').length / total * 100,
    panic:       tags.filter(t => t === 'PANIC_SELL').length / total * 100,
    fomo:        tags.filter(t => t === 'FOMO_BUY').length / total * 100,
    overtrade:   tags.filter(t => t === 'OVERTRADE').length / total * 100,
    lossHolding: tags.filter(t => t === 'LOSS_HOLDING').length / total * 100,
  };
}
```

---

## FILE 5: app/api/mentor/route.ts  (AI MENTOR BACKEND)

```typescript
import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

// This endpoint takes a trade + behavior tag and streams
// a personalized coaching response from Claude.

export const runtime = 'edge'; // Fastest cold start

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(req: NextRequest) {
  const {
    behaviorTag,
    price,
    action,
    scenarioName,
    explanation,
    disciplineScore,
  } = await req.json();

  const systemPrompt = `You are a brutally honest but supportive trading psychology coach named "Zen" for the Zentra platform.

Your job: after each trade, give the user exactly 2-3 sentences of tough-love coaching based on their behavioral tag.

Rules:
- Be SPECIFIC — reference the actual price and scenario name, not generic advice
- Be DIRECT — don't sugar-coat, but don't crush them either
- End with ONE concrete action they can take next trade
- Never start with "Great job" or "Well done" for bad trades
- Keep it under 60 words total
- Speak like a respected mentor, not a chatbot`;

  const userMessage = `
Scenario: ${scenarioName}
Trade action: ${action} at ₹${price}
Behavior detected: ${behaviorTag}
Detection context: ${explanation}
Current discipline score: ${disciplineScore}/100

Give me my coaching feedback.`;

  // Stream the response for perceived speed
  const stream = await client.messages.stream({
    model: 'claude-haiku-4-5-20251001',  // Fast and cheap — perfect for real-time feedback
    max_tokens: 150,
    system: systemPrompt,
    messages: [{ role: 'user', content: userMessage }],
  });

  // Return as a ReadableStream so the frontend can display it word-by-word
  return new Response(
    new ReadableStream({
      async start(controller) {
        for await (const event of stream) {
          if (
            event.type === 'content_block_delta' &&
            event.delta.type === 'text_delta'
          ) {
            controller.enqueue(new TextEncoder().encode(event.delta.text));
          }
        }
        controller.close();
      },
    }),
    {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Content-Type-Options': 'nosniff',
      },
    }
  );
}
```

---

## FILE 6: lib/supabase.ts  (DATABASE CLIENT)

```typescript
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ============================================================
// SUPABASE SQL — run this in the Supabase SQL editor
// ============================================================
/*

-- Users table (supplements NextAuth users)
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT,
  xp INTEGER DEFAULT 0,
  virtual_balance DECIMAL(10,2) DEFAULT 10000.00,
  discipline_score INTEGER DEFAULT 50,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Scenarios (pre-seeded with historical data)
CREATE TABLE scenarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,          -- e.g. "COVID Crash — March 2020"
  description TEXT,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'expert')),
  ohlcv_data JSONB NOT NULL,   -- Array of {date, open, high, low, close, volume}
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trades (each buy/sell action)
CREATE TABLE trades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id),
  scenario_id UUID REFERENCES scenarios(id),
  action TEXT CHECK (action IN ('BUY', 'SELL')),
  price DECIMAL(10,2),
  quantity INTEGER DEFAULT 1,
  candle_index INTEGER,
  behavior_tag TEXT,
  ai_feedback TEXT,
  score_delta INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Behavior logs (one per trade)
CREATE TABLE behavior_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id),
  trade_id UUID REFERENCES trades(id),
  tag TEXT,
  confidence DECIMAL(3,2),
  explanation TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security — users can only see their own data
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE behavior_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own profile" ON user_profiles
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users see own trades" ON trades
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users see own logs" ON behavior_logs
  FOR ALL USING (auth.uid() = user_id);

-- Scenarios are public (anyone can read)
ALTER TABLE scenarios ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public scenarios" ON scenarios
  FOR SELECT USING (true);

*/

// Helper functions
export async function getScenarios() {
  const { data, error } = await supabase.from('scenarios').select('*');
  if (error) throw error;
  return data;
}

export async function saveTrade(trade: {
  userId: string;
  scenarioId: string;
  action: 'BUY' | 'SELL';
  price: number;
  candleIndex: number;
  behaviorTag: string;
  scoreDelta: number;
}) {
  const { data, error } = await supabase
    .from('trades')
    .insert([{
      user_id: trade.userId,
      scenario_id: trade.scenarioId,
      action: trade.action,
      price: trade.price,
      candle_index: trade.candleIndex,
      behavior_tag: trade.behaviorTag,
      score_delta: trade.scoreDelta,
    }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateUserScore(userId: string, scoreDelta: number, xpDelta: number) {
  // Use Supabase RPC (stored function) for atomic increment
  const { error } = await supabase.rpc('increment_user_stats', {
    p_user_id: userId,
    p_score_delta: scoreDelta,
    p_xp_delta: xpDelta,
  });
  if (error) throw error;
}
```

---

## FILE 7: components/CandleChart3D.tsx  (THE VISUAL CENTERPIECE)

```tsx
'use client';

// ============================================================
//  3D CANDLESTICK CHART — The most impressive visual in Zentra
//  Built with React Three Fiber + Drei
// ============================================================

import { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber';
import { OrbitControls, Text, Grid, Environment } from '@react-three/drei';
import * as THREE from 'three';

interface OHLCV {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface CandleChartProps {
  data: OHLCV[];
  visibleUpTo: number;        // Timeline scrubber controls this (0 to data.length)
  onCandleClick?: (candle: OHLCV, index: number) => void;
  theme?: 'light' | 'dark' | 'neon';
}

// Individual candle mesh
function Candle({
  ohlcv,
  index,
  minPrice,
  priceRange,
  isVisible,
  onClick,
  theme,
}: {
  ohlcv: OHLCV;
  index: number;
  minPrice: number;
  priceRange: number;
  isVisible: boolean;
  onClick: () => void;
  theme: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);

  const isBull = ohlcv.close >= ohlcv.open;

  // Colors per theme
  const upColor   = theme === 'neon' ? '#00FF94' : '#16A34A';
  const downColor = theme === 'neon' ? '#FF2D55' : '#DC2626';
  const color = isBull ? upColor : downColor;

  // Normalize prices to 0-1 range for positioning
  const bodyBottom = (Math.min(ohlcv.open, ohlcv.close) - minPrice) / priceRange;
  const bodyTop    = (Math.max(ohlcv.open, ohlcv.close) - minPrice) / priceRange;
  const bodyHeight = Math.max(bodyTop - bodyBottom, 0.005); // Minimum height
  const bodyCenter = bodyBottom + bodyHeight / 2;

  const wickBottom = (ohlcv.low  - minPrice) / priceRange;
  const wickTop    = (ohlcv.high - minPrice) / priceRange;
  const wickHeight = wickTop - wickBottom;
  const wickCenter = wickBottom + wickHeight / 2;

  const scale = 5; // Vertical scale factor for visual drama

  useFrame(() => {
    if (meshRef.current && hovered) {
      // Gentle pulse on hover
      meshRef.current.scale.y = 1 + Math.sin(Date.now() * 0.005) * 0.02;
    }
  });

  if (!isVisible) return null;

  return (
    <group position={[index * 0.6 - 9, 0, 0]}>
      {/* Candle body */}
      <mesh
        ref={meshRef}
        position={[0, bodyCenter * scale, 0]}
        onClick={onClick}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        scale={hovered ? [1.1, 1.1, 1.1] : [1, 1, 1]}
      >
        <boxGeometry args={[0.4, bodyHeight * scale, 0.4]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 0.6 : theme === 'neon' ? 0.3 : 0.1}
          roughness={0.3}
          metalness={theme === 'neon' ? 0.8 : 0.2}
        />
      </mesh>

      {/* Wick */}
      <mesh position={[0, wickCenter * scale, 0]}>
        <cylinderGeometry args={[0.04, 0.04, wickHeight * scale, 8]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.2}
        />
      </mesh>
    </group>
  );
}

// Main chart component
export default function CandleChart3D({
  data,
  visibleUpTo,
  onCandleClick,
  theme = 'dark',
}: CandleChartProps) {

  const prices = data.flatMap(d => [d.high, d.low]);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice;

  const bgColor = theme === 'neon' ? '#050B1A' : theme === 'dark' ? '#0A0A0A' : '#F4F4F0';
  const gridColor = theme === 'neon' ? '#003322' : theme === 'dark' ? '#1C1C1C' : '#E5E7EB';

  return (
    <div style={{ width: '100%', height: '400px', borderRadius: '12px', overflow: 'hidden', background: bgColor }}>
      <Canvas
        camera={{ position: [0, 8, 18], fov: 50 }}
        gl={{ antialias: true, alpha: false }}
      >
        {/* Lighting */}
        <ambientLight intensity={theme === 'neon' ? 0.2 : 0.4} />
        <pointLight position={[10, 20, 10]} intensity={1.5} color={theme === 'neon' ? '#00FF94' : 'white'} />
        <pointLight position={[-10, 20, -10]} intensity={0.5} color={theme === 'neon' ? '#FF2D55' : '#FF6B6B'} />

        {/* Environment for reflections */}
        <Environment preset={theme === 'neon' ? 'night' : theme === 'dark' ? 'city' : 'apartment'} />

        {/* Grid floor */}
        <Grid
          args={[20, 20]}
          cellSize={0.6}
          cellThickness={0.3}
          cellColor={gridColor}
          sectionSize={3}
          sectionThickness={0.5}
          sectionColor={gridColor}
          fadeDistance={25}
          position={[0, -0.1, 0]}
        />

        {/* Candles */}
        {data.slice(0, visibleUpTo).map((ohlcv, i) => (
          <Candle
            key={i}
            ohlcv={ohlcv}
            index={i}
            minPrice={minPrice}
            priceRange={priceRange}
            isVisible={true}
            onClick={() => onCandleClick?.(ohlcv, i)}
            theme={theme}
          />
        ))}

        {/* Camera controls */}
        <OrbitControls
          enablePan={false}
          minDistance={8}
          maxDistance={30}
          maxPolarAngle={Math.PI / 2.1}
          autoRotate={false}
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}
```

---

## FILE 8: components/ThemeToggle.tsx  (THE SIGNATURE FEATURE)

```tsx
'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const themes = ['light', 'dark', 'neon'] as const;

const ThemeIcons = {
  light: <Sun size={14} />,
  dark:  <Moon size={14} />,
  neon:  <Zap size={14} />,
};

const ThemeLabels = {
  light: 'Light',
  dark:  'Dark',
  neon:  'Neon',
};

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const currentIndex = themes.indexOf(theme as typeof themes[number]) ?? 0;
  const nextTheme = themes[(currentIndex + 1) % themes.length];

  return (
    <motion.button
      onClick={() => setTheme(nextTheme)}
      whileTap={{ scale: 0.95 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 12px',
        borderRadius: '8px',
        border: '1px solid var(--border)',
        background: 'var(--bg-surface)',
        color: 'var(--text-primary)',
        cursor: 'pointer',
        fontSize: '13px',
        fontFamily: 'inherit',
      }}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={theme}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.15 }}
          style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
        >
          {ThemeIcons[theme as keyof typeof ThemeIcons]}
          {ThemeLabels[theme as keyof typeof ThemeLabels]}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
```

---

## FILE 9: components/MentorPanel.tsx  (AI COACHING UI)

```tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, TrendingDown, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

interface MentorPanelProps {
  behaviorTag: string | null;
  disciplineScore: number;
  isLoading: boolean;
  feedback: string;
}

const TagConfig = {
  DISCIPLINED:  { icon: <CheckCircle size={16} />, color: 'var(--accent-up)',          label: 'Disciplined' },
  PANIC_SELL:   { icon: <TrendingDown size={16} />, color: 'var(--accent-down)',         label: 'Panic Sell' },
  FOMO_BUY:     { icon: <TrendingUp size={16} />, color: 'var(--accent-fomo)',          label: 'FOMO Buy' },
  OVERTRADE:    { icon: <AlertTriangle size={16} />, color: 'var(--accent-discipline)', label: 'Overtrading' },
  LOSS_HOLDING: { icon: <TrendingDown size={16} />, color: 'var(--accent-fomo)',        label: 'Loss Holding' },
};

export default function MentorPanel({ behaviorTag, disciplineScore, isLoading, feedback }: MentorPanelProps) {
  const config = behaviorTag
    ? TagConfig[behaviorTag as keyof typeof TagConfig] ?? TagConfig.DISCIPLINED
    : null;

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: 'rgba(124, 58, 237, 0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Brain size={16} color="var(--accent-ai)" />
        </div>
        <div>
          <p style={{ fontSize: '14px', fontWeight: 600 }}>AI Mentor — Zen</p>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Real-time coaching</p>
        </div>
      </div>

      {/* Behavior Badge */}
      <AnimatePresence>
        {config && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '999px',
              background: `${config.color}18`,
              color: config.color,
              fontSize: '13px',
              fontWeight: 600,
              width: 'fit-content',
            }}
          >
            {config.icon}
            {config.label}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feedback text */}
      <div style={{
        fontSize: '14px',
        lineHeight: '1.6',
        color: 'var(--text-secondary)',
        minHeight: '60px',
      }}>
        {isLoading ? (
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Analyzing your trade...
          </motion.div>
        ) : feedback ? (
          <motion.p
            key={feedback}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {feedback}
          </motion.p>
        ) : (
          <p style={{ color: 'var(--text-muted)' }}>
            Start trading and I'll analyze your decisions in real-time.
          </p>
        )}
      </div>

      {/* Discipline Score */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Trader Discipline Score</span>
          <motion.span
            key={disciplineScore}
            initial={{ scale: 1.3 }}
            animate={{ scale: 1 }}
            style={{ fontSize: '14px', fontWeight: 700, fontFamily: 'monospace' }}
          >
            {disciplineScore}/100
          </motion.span>
        </div>
        <div style={{
          height: '6px',
          background: 'var(--bg-overlay)',
          borderRadius: '999px',
          overflow: 'hidden',
        }}>
          <motion.div
            style={{
              height: '100%',
              borderRadius: '999px',
              background: disciplineScore >= 70 ? 'var(--accent-up)' :
                          disciplineScore >= 40 ? 'var(--accent-fomo)' : 'var(--accent-down)',
            }}
            initial={{ width: 0 }}
            animate={{ width: `${disciplineScore}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
          {disciplineScore >= 70 ? 'Good progress, stay focused.' :
           disciplineScore >= 40 ? 'Room for improvement — control your emotions.' :
           'You are trading emotionally. Slow down.'}
        </p>
      </div>
    </div>
  );
}
```

---

## FILE 10: data/seedScenarios.ts  (HISTORICAL DATA SEED SCRIPT)

```typescript
// Run this script once to seed your Supabase scenarios table
// Usage: npx ts-node data/seedScenarios.ts

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role for seed script
);

// COVID Crash — simplified NIFTY 50 data (normalized prices)
// In production, replace with real data from Yahoo Finance / Kaggle
const covidCrashData = Array.from({ length: 30 }, (_, i) => {
  const basePrice = 12000 - (i < 15 ? i * 450 : (30 - i) * 200); // Crash then partial recovery
  const volatility = i < 15 ? 300 : 150;
  const open  = basePrice + (Math.random() - 0.5) * volatility;
  const close = basePrice + (Math.random() - 0.5) * volatility;
  const high  = Math.max(open, close) + Math.random() * 100;
  const low   = Math.min(open, close) - Math.random() * 100;
  return {
    date: new Date(2020, 1, 14 + i).toISOString().split('T')[0],
    open: Math.round(open),
    high: Math.round(high),
    low:  Math.round(low),
    close: Math.round(close),
    volume: Math.round(1000000 + Math.random() * 2000000),
  };
});

async function seed() {
  const { error } = await supabase.from('scenarios').insert([
    {
      name: 'COVID Crash — March 2020',
      description: 'Navigate NIFTY 50\'s historic 40% crash. Can you avoid panic selling at the bottom?',
      difficulty: 'intermediate',
      ohlcv_data: covidCrashData,
    },
    {
      name: 'Bull Market Rally — November 2020',
      description: 'Post-election vaccine rally. Can you hold your positions through the volatility?',
      difficulty: 'beginner',
      ohlcv_data: covidCrashData.map(d => ({ ...d, close: d.close * 1.4, high: d.high * 1.4 })),
    },
    {
      name: 'Choppy Sideways — June 2021',
      description: 'No clear trend. The hardest market for emotional traders.',
      difficulty: 'expert',
      ohlcv_data: covidCrashData.map(d => ({ ...d, close: 15000 + (Math.random() - 0.5) * 400 })),
    },
  ]);

  if (error) console.error('Seed failed:', error);
  else console.log('Scenarios seeded successfully!');
}

seed();
```

---

## FILE 11: app/layout.tsx  (ROOT LAYOUT WITH THEME)

```tsx
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { ThemeProvider } from 'next-themes';
import './globals.css';

export const metadata: Metadata = {
  title: 'Zentra — Trade Without Fear',
  description: 'AI-powered trading psychology trainer. Simulate real market crashes, detect your behavioral patterns, get personalized coaching.',
  openGraph: {
    title: 'Zentra — Where Trading Meets AI & Emotion',
    description: 'Train your trading psychology with real market scenarios and AI coaching.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning // Required for next-themes
    >
      <body>
        <ThemeProvider
          attribute="data-theme"   // Uses data-theme attribute (matches our CSS)
          defaultTheme="dark"
          themes={['light', 'dark', 'neon']}
          enableSystem={false}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

---

## FINAL CHECKLIST: Ship It

```
HOUR 0-1:   [ ] Scaffold created    [ ] Supabase connected   [ ] Auth working
HOUR 1-3:   [ ] 3D chart renders    [ ] Scenarios seeded     [ ] BUY/SELL saves
HOUR 3-5:   [ ] Behavior tags fire  [ ] Badge animates       [ ] Radar chart shows
HOUR 5-7:   [ ] AI Mentor calls API [ ] Streams response     [ ] Score updates
HOUR 7-8.5: [ ] Mini-games work     [ ] XP system counts     [ ] Leaderboard shows
HOUR 8.5-10:[ ] Theme toggle works  [ ] 3 themes look good   [ ] All transitions smooth
HOUR 10-12: [ ] Landing page done   [ ] Ticker strip running [ ] Vercel deployed
             [ ] Demo URL works      [ ] Judges can log in
```

---

*Give each file to your vibe-coding AI (Cursor, Claude, v0) one at a time.
The build order matters. Don't skip ahead to gamification before the behavior engine works.*
