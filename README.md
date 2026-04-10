# Zentra

Zentra is an immersive trading psychology simulator built with Next.js, React Three Fiber, Supabase, and gamified learning loops. Instead of focusing only on chart patterns, Zentra trains decision-making under pressure through market scenarios, XP progression, mini-games, leaderboards, and AI-generated coaching.

## Why Zentra

Most trading products help users analyze the market. Zentra is designed to help users analyze themselves.

The experience combines:

- Historical-style scenario drills such as crash, rally, and choppy markets
- Interactive 2D and 3D chart views for simulated trade decisions
- Behavioral feedback tied to discipline, FOMO, panic selling, and loss holding
- XP progression, mini-games, and a public leaderboard
- An AI Mentor API that turns recent trades into direct coaching feedback

## Core Features

- Scenario-based training
- Interactive dashboard with XP tracking
- 3D candle and mountain chart visualizations
- Mini-games for rapid psychology drills
- Supabase-backed auth, profiles, scenarios, and trades
- AI Mentor feedback via the `/api/ai-mentor` route
- Premium motion-driven UI with glassmorphism and cinematic styling

## Tech Stack

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- Three.js
- React Three Fiber
- React Three Drei
- Recharts
- Supabase
- NextAuth

## Project Structure

```text
app/
  api/
    ai-mentor/        AI coaching endpoint
    auth/             NextAuth routes
    seed/             Scenario seeding route
  auth/               Sign-in flow
  dashboard/          Main dashboard, scenarios, games, leaderboard
  page.tsx            Landing page

components/
  games/              Mini-games
  atrium/             Immersive scene components
  *Chart*.tsx         2D/3D chart renderers

lib/
  behaviorEngine.ts   Trade behavior scoring logic
  seedScenarios.ts    Scenario ingestion and seeding
  supabase/           Browser client helpers
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Create your local environment file

Copy `.env.local.example` to `.env.local` and fill in the values:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

ANTHROPIC_API_KEY=

NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_API_KEY=
```

Notes:

- Supabase powers authentication and app data.
- Google OAuth is used in the auth flow.
- `GOOGLE_API_KEY` is used by the AI Mentor route.
- `ANTHROPIC_API_KEY` appears in the example env file, but the current AI mentor route uses Google Gemini.

### 3. Run the app

```bash
npm run dev
```

Open `http://localhost:3000`.

## Available Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Product Flow

1. Users land on the immersive homepage and authenticate with Google.
2. The dashboard surfaces scenarios, XP, games, and leaderboard access.
3. A user enters a scenario and places simulated trades against OHLC data.
4. The behavior engine tags the trade and updates score impact.
5. The AI Mentor returns structured coaching with discipline, risk, and emotional-control scores.
6. XP and profile metrics flow into the leaderboard and progression loop.

## Data Model Overview

The app currently interacts with data shaped around:

- `scenarios`
- `trades`
- `user_profiles`
- `user_leaderboard` view
- raw candle source tables used by the seeding flow

## Visual Design Direction

Zentra leans into a futuristic learning environment rather than a typical finance dashboard:

- glass cards and atmospheric gradients
- animated sparklines and motion transitions
- 3D chart scenes with orbit controls
- dark, cinematic presentation tuned for focus

## Current Notes

- `npm run lint` passes in the current repo state.
- There are existing TypeScript issues outside the README work that should be cleaned up before a production release.
- The repository currently includes scenario seeding and AI mentor plumbing, so local setup depends on valid Supabase and Google credentials.

## Roadmap Ideas

- richer scenario library and difficulty progression
- user trade journals and replay summaries
- mentor personalization and long-term coaching memory
- achievement system and streak mechanics
- production deployment configuration and CI checks

## License

No license file is currently present in this repository. Add one before open distribution if needed.
