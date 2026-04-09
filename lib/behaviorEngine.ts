export type BehaviorTag =
  | "DISCIPLINED"
  | "PANIC_SELL"
  | "FOMO_BUY"
  | "OVERTRADE"
  | "LOSS_HOLDING";

export interface Trade {
  action: "BUY" | "SELL";
  price: number;
  candleIndex: number;
  scenarioPrices: number[];
}

export interface BehaviorResult {
  tag: BehaviorTag;
  confidence: number;
  explanation: string;
  scoreDelta: number;
}

function priceAt(scenarioPrices: number[], index: number): number | null {
  if (index < 0 || index >= scenarioPrices.length) return null;
  return scenarioPrices[index];
}

/**
 * Detection order: PANIC_SELL → FOMO_BUY → OVERTRADE → LOSS_HOLDING → DISCIPLINED
 * (first match wins.)
 */
export function analyzeTrade(trade: Trade, recentTrades: Trade[]): BehaviorResult {
  const { action, price, candleIndex, scenarioPrices } = trade;
  const allForCount = [...recentTrades, trade];

  const futureIdx = candleIndex + 3;
  const futurePrice = priceAt(scenarioPrices, futureIdx);

  // 1) PANIC_SELL
  if (action === "SELL" && futurePrice !== null) {
    if (futurePrice > price * 1.03) {
      const pct = ((futurePrice - price) / price) * 100;
      return {
        tag: "PANIC_SELL",
        confidence: Math.min(0.98, 0.75 + Math.min(0.2, (pct - 3) / 50)),
        explanation: `Price was ${pct.toFixed(1)}% higher only 3 candles later — selling into a quick recovery.`,
        scoreDelta: -8,
      };
    }
  }

  // 2) FOMO_BUY
  if (action === "BUY" && futurePrice !== null) {
    if (futurePrice < price * (1 - 0.025)) {
      const dropPct = ((price - futurePrice) / price) * 100;
      return {
        tag: "FOMO_BUY",
        confidence: Math.min(0.98, 0.75 + Math.min(0.2, (dropPct - 2.5) / 40)),
        explanation: `Price dropped ${dropPct.toFixed(1)}% within 3 candles after your buy — chasing strength near a local top.`,
        scoreDelta: -6,
      };
    }
  }

  // 3) OVERTRADE — 5+ trades in the window of the last 10 candles (inclusive)
  const windowLow = candleIndex - 9;
  const windowHigh = candleIndex;
  const tradesInWindow = allForCount.filter(
    (t) => t.candleIndex >= windowLow && t.candleIndex <= windowHigh
  );
  if (tradesInWindow.length >= 5) {
    return {
      tag: "OVERTRADE",
      confidence: 0.88,
      explanation: `${tradesInWindow.length} trades in the last 10 candles — high activity often erodes edge.`,
      scoreDelta: -4,
    };
  }

  // 4) LOSS_HOLDING — most recent prior BUY was >7% above this sell price
  if (action === "SELL") {
    let lastBuy: Trade | null = null;
    for (const t of recentTrades) {
      if (t.action === "BUY" && t.candleIndex < candleIndex) {
        if (!lastBuy || t.candleIndex > lastBuy.candleIndex) lastBuy = t;
      }
    }
    if (lastBuy && lastBuy.price > price * 1.07) {
      const lossPct = ((lastBuy.price - price) / lastBuy.price) * 100;
      return {
        tag: "LOSS_HOLDING",
        confidence: Math.min(0.97, 0.78 + Math.min(0.18, (lossPct - 7) / 30)),
        explanation: `Sold ~${lossPct.toFixed(1)}% below your last buy — holding a losing position until a deep exit.`,
        scoreDelta: -5,
      };
    }
  }

  return {
    tag: "DISCIPLINED",
    confidence: 0.9,
    explanation: "No panic, FOMO, overtrading, or loss-stall pattern detected on this trade.",
    scoreDelta: 10,
  };
}
