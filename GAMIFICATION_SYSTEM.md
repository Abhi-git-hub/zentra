# Zentra Gamification System

A complete XP, virtual currency, mini-game, and leaderboard system added to Zentra for enhanced user engagement.

## Components Overview

### 1. Core Library (`lib/gamification.ts`)

Utility functions for XP and reward calculations:

- **`calculateXP(behaviorTag: BehaviorTag): number`** - Calculate XP based on trading behavior
  - `DISCIPLINED`: +50 XP
  - `PANIC_SELL`: -20 XP
  - `FOMO_BUY`: -10 XP
  - `OVERTRADE`: -5 XP
  - `LOSS_HOLDING`: -5 XP
  - `TRADE`: +10 XP (participation bonus)

- **`calculateVirtualPnL(entryPrice, exitPrice, quantity): number`** - Calculate profit/loss from trades

- **`getUserLevel(xp: number)`** - Get user level from total XP
  - Level 1 (Rookie): 0-500 XP
  - Level 2 (Trader): 500-1500 XP
  - Level 3 (Analyst): 1500-3000 XP
  - Level 4 (Master): 3000+ XP

- **`getLevelProgress(xp: number): number`** - Get progress to next level (0-100%)

### 2. XP Display Component (`components/XPDisplay.tsx`)

Animated XP counter showing:
- Current XP count with smooth animation
- Current level and level name
- Progress bar with percentage to next level
- Framer Motion animations for XP changes
- CSS variable theming support

**Usage:**
```tsx
<XPDisplay xp={2450} />
```

### 3. Mini-Games

#### Game 1: Guess The Bottom (`components/games/GuessTheBottom.tsx`)
- Shows first 20 candles of COVID Crash scenario
- User predicts where the bottom is
- Reveals next 10 candles
- **Reward:** 100 XP (win within 3 candles) or 25 XP (participate)
- **Difficulty:** Medium

#### Game 2: Hold The Line (`components/games/HoldTheLine.tsx`)
- 15-second countdown with volatile price movements
- Price updates every 500ms (±2% random movement)
- Stress meter (red bar) that fills as price drops
- **Reward:** 150 XP (hold full time) or 30 XP (sell early)
- **Difficulty:** Hard

#### Game 3: News Flash (`components/games/NewsFlash.tsx`)
- Shows fake market headlines
- 3-second countdown to predict market direction
- Auto-reveals if user doesn't answer
- **Reward:** 50 XP (correct) or 10 XP (participate)
- **Difficulty:** Easy

**Headlines Include:**
- RBI Unexpectedly Cuts Repo Rate by 50 bps → UP
- Inflation Hits 12-Year High → DOWN
- Foreign Investors Pull 5000 Crore → DOWN
- IT Sector Records Earnings → UP
- Monsoon Rains Below Average → DOWN

### 4. Games Hub Page (`app/dashboard/games/page.tsx`)

Central hub showing all three games with:
- Game cards with difficulty levels
- XP rewards prominently displayed
- Descriptions and mechanics
- Play buttons linking to individual games
- Tab-based navigation between game list and game play

### 5. Leaderboard Page (`app/dashboard/leaderboard/page.tsx`)

Displays top 10 traders ranked by XP:
- User rank with medal emoji (🥇🥈🥉)
- Player name and avatar
- Total XP (primary ranking metric)
- Discipline score (secondary metric)
- Current user highlighted in primary accent color
- How-it-works info box
- Real-time updates from Supabase

## Database Schema

### Required Columns in `user_profiles`

```sql
ALTER TABLE user_profiles ADD COLUMN xp INTEGER DEFAULT 0;
ALTER TABLE user_profiles ADD COLUMN discipline_score INTEGER DEFAULT 0;
ALTER TABLE user_profiles ADD COLUMN game_plays INTEGER DEFAULT 0;
```

### RPC Function: `increment_user_stats`

```sql
CREATE OR REPLACE FUNCTION increment_user_stats(
  p_user_id UUID,
  p_xp_delta INTEGER,
  p_score_delta INTEGER
)
RETURNS TABLE (
  new_xp INTEGER,
  new_discipline_score INTEGER
) AS $$
-- Atomically updates XP and discipline score
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Leaderboard View

```sql
CREATE OR REPLACE VIEW user_leaderboard AS
SELECT 
  id,
  full_name,
  avatar_url,
  xp,
  discipline_score,
  game_plays,
  created_at,
  ROW_NUMBER() OVER (ORDER BY xp DESC) AS rank
FROM user_profiles
WHERE xp > 0 OR discipline_score != 0
ORDER BY xp DESC;
```

## Styling & Theming

All components use CSS variables:
- `--bg-glass`: Semi-transparent background
- `--border-glass`: Subtle glass border color
- `--text-primary`: Primary text color
- `--text-secondary`: Secondary text color
- `--accent-primary`: Main accent (green by default)
- `--accent-up`: Positive movement color (green)
- `--accent-down`: Negative movement color (red)
- `--accent-warning`: Warning color (amber)
- `--accent-up`: Progress/positive color

## Navigation Updates

### Navbar Changes (`components/Navbar.tsx`)
- Added Gamepad2 icon linking to `/dashboard/games`
- Added Trophy icon linking to `/dashboard/leaderboard`
- Dynamic XP display from user state
- Active link highlighting based on current path

### Dashboard Home (`app/dashboard/page.tsx`)
- Added XP Display widget
- Games Hub card with quick links
- Leaderboard card with user rank preview
- Seamless integration with existing scenario selection

## Migration Setup

To enable the gamification system, run this SQL in your Supabase project:

1. Go to SQL Editor in Supabase Dashboard
2. Copy contents of `migrations/gamification_system.sql`
3. Execute the migration
4. This will:
   - Add `xp`, `discipline_score`, `game_plays` columns to `user_profiles`
   - Create `increment_user_stats()` RPC function
   - Create `user_leaderboard` view

## Features Implemented

✅ **XP System**
- Behavior-based XP calculations
- Visual progress bars
- Level progression (Rookie → Trader → Analyst → Master)
- Animated XP counter

✅ **Mini-Games** (3 games)
- Guess The Bottom (crash prediction)
- Hold The Line (emotional control)
- News Flash (market sentiment)
- All with appropriate difficulty and XP rewards

✅ **Leaderboard**
- Top 10 rankings
- Real-time Supabase query
- Current user highlighting
- Medal emoji for top 3

✅ **UI/UX**
- Framer Motion animations
- Responsive design
- Glass morphism styling
- Dark/Light/Neon theme support
- CSS variable theming

## Integration Notes

1. **Navbar XP Display**: Currently mocked at 1,240 XP. Connect to user session:
   ```tsx
   const userXP = session?.user?.xp || 0;
   ```

2. **Leaderboard User Highlighting**: Uses `session?.user?.id`. Ensure session has user ID.

3. **Game XP Rewards**: Currently display-only. Integrate with:
   ```tsx
   await supabase.rpc('increment_user_stats', {
     p_user_id: userId,
     p_xp_delta: xpReward,
     p_score_delta: 0
   });
   ```

4. **Mobile Responsiveness**: All components are fully responsive (mobile, tablet, desktop)

## Next Steps

1. Apply database migration via Supabase SQL Editor
2. Connect XP/user data to NextAuth session
3. Integrate game results with database rewards
4. Add user profile XP display in other parts of app
5. Create daily/weekly challenges system
6. Add streaming rewards during live scenario play
7. Implement seasonal leaderboards

## File Structure

```
zentra/
├── lib/
│   └── gamification.ts
├── components/
│   ├── XPDisplay.tsx
│   └── games/
│       ├── GuessTheBottom.tsx
│       ├── HoldTheLine.tsx
│       └── NewsFlash.tsx
├── app/
│   └── dashboard/
│       ├── games/
│       │   └── page.tsx
│       ├── leaderboard/
│       │   └── page.tsx
│       └── page.tsx (updated)
├── migrations/
│   └── gamification_system.sql
└── components/
    └── Navbar.tsx (updated)
```
