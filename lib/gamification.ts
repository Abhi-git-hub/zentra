/**
 * Gamification System for Zentra
 * Handles XP calculations, virtual P&L, and game scoring
 */

export type BehaviorTag = 'DISCIPLINED' | 'PANIC_SELL' | 'FOMO_BUY' | 'OVERTRADE' | 'LOSS_HOLDING' | 'TRADE';

/**
 * Calculate XP based on trading behavior
 * - DISCIPLINED trades: +50 XP
 * - PANIC_SELL: -20 XP
 * - FOMO_BUY: -10 XP
 * - OVERTRADE: -5 XP
 * - LOSS_HOLDING: -5 XP
 * - Standard trade: +10 XP participation bonus
 */
export function calculateXP(behaviorTag: BehaviorTag): number {
  const xpMap: Record<BehaviorTag, number> = {
    DISCIPLINED: 50,
    PANIC_SELL: -20,
    FOMO_BUY: -10,
    OVERTRADE: -5,
    LOSS_HOLDING: -5,
    TRADE: 10,
  };
  return xpMap[behaviorTag] || 10;
}

/**
 * Calculate virtual P&L from a completed trade
 */
export function calculateVirtualPnL(
  entryPrice: number,
  exitPrice: number,
  quantity: number
): number {
  return (exitPrice - entryPrice) * quantity;
}

/**
 * Get user level from total XP
 */
export function getUserLevel(xp: number): {
  level: string;
  levelNumber: number;
  xpInLevel: number;
  xpToNextLevel: number;
  xpRangeMin: number;
  xpRangeMax: number;
} {
  const levels = [
    { name: 'Rookie', min: 0, max: 500 },
    { name: 'Trader', min: 500, max: 1500 },
    { name: 'Analyst', min: 1500, max: 3000 },
    { name: 'Master', min: 3000, max: Infinity },
  ];

  for (let i = 0; i < levels.length; i++) {
    const level = levels[i];
    if (xp >= level.min && xp < level.max) {
      const xpInLevel = xp - level.min;
      const xpToNextLevel = level.max === Infinity ? 0 : level.max - xp;
      return {
        level: level.name,
        levelNumber: i + 1,
        xpInLevel,
        xpToNextLevel,
        xpRangeMin: level.min,
        xpRangeMax: level.max,
      };
    }
  }

  return {
    level: 'Master',
    levelNumber: 4,
    xpInLevel: Math.max(0, xp - 3000),
    xpToNextLevel: 0,
    xpRangeMin: 3000,
    xpRangeMax: Infinity,
  };
}

/**
 * Get progress percentage to next level (0-100)
 */
export function getLevelProgress(xp: number): number {
  const levelInfo = getUserLevel(xp);
  if (levelInfo.xpToNextLevel === 0) return 100;
  const levelSize = levelInfo.xpRangeMax - levelInfo.xpRangeMin;
  const progress = (levelInfo.xpInLevel / levelSize) * 100;
  return Math.min(100, Math.max(0, progress));
}
