# Zentra — Trading Psychology Simulator

Zentra is an interactive learning product that trains trading decision-making under pressure through simulated market scenarios, behavioral scoring, gamification, and guided feedback.

## What users can do

- Enter simulated crash, rally, and choppy-market scenarios
- Make trade decisions against OHLCV data
- Receive behavioral feedback and discipline scoring
- Track XP and progression
- Play short trading-psychology mini-games
- Compare progression on a leaderboard
- Sign in with Google through Supabase Auth

## Architecture

```text
Next.js 14 application
   │
   ├── Supabase Auth
   ├── Dashboard / scenarios / games
   ├── 2D + 3D market visualization
   ├── Behavioral scoring engine
   └── Server route for controlled scenario seeding
              │
              └── Supabase
                   ├── user_profiles
                   ├── scenarios
                   ├── trades
                   └── raw market-data tables
```

## Stack

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- Three.js / React Three Fiber
- Recharts
- Supabase + `@supabase/ssr`

## Local development

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.local.example` to `.env.local` and provide the Supabase URL, Supabase anonymous key, and any server-side AI credentials used by your local build.

Never commit `.env.local` or real credentials.

### 3. Run

```bash
npm run dev
```

### 4. Validate

```bash
npm run lint
npm run build
```

## Security notes

Authentication is handled through Supabase Auth. Dashboard routes require an authenticated Supabase session, OAuth callback redirects are restricted to local paths, and the scenario-seeding endpoint is protected rather than publicly callable.

The gamification migration also constrains the privileged statistics RPC so a caller cannot update another user's profile and keeps discipline scores within their expected range.

## Current product status

Zentra is a strong technical/product prototype demonstrating modern Next.js architecture, interactive market visualization, behavioral scoring, gamification, and Supabase-backed persistence.

Before treating it as a production SaaS, finish the runtime QA pass, add automated tests/CI, review Supabase RLS policies in the live project, and remove any remaining demo-only UI behavior.

## License

No license is currently declared in the repository.
