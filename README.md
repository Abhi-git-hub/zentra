# Zentra — Trading Psychology Simulator

Zentra is an interactive learning product that trains trading decision-making under pressure through simulated market scenarios, behavioral scoring, gamification, and AI coaching.

## Product problem

Most trading tools focus on charts and market analysis. Zentra focuses on the person making the decision: discipline, FOMO, panic selling, loss holding, and risk behavior.

## What users can do

- Enter simulated crash, rally, and choppy-market scenarios
- Make trade decisions against OHLC data
- Receive behavioral feedback and scoring
- Track XP and progression
- Play short psychology-training mini-games
- Compare progression on a leaderboard
- Ask an AI Mentor for coaching based on recent trades

## Architecture

```text
Next.js application
   │
   ├── Authentication
   ├── Dashboard / scenarios / games
   ├── 2D + 3D visualization
   ├── Behavior scoring engine
   └── /api/ai-mentor
              │
              ├── Supabase
              │      ├── profiles
              │      ├── scenarios
              │      ├── trades
              │      └── leaderboard
              │
              └── LLM provider
```

## Stack

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- Three.js / React Three Fiber
- Recharts
- Supabase
- NextAuth

## Local development

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.local.example` to `.env.local` and provide the required Supabase, authentication, and AI credentials.

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

## Engineering highlights

- Componentized Next.js application architecture
- Typed application code with TypeScript
- Database-backed user progression
- Behavioral scoring separated into a dedicated engine
- API route for AI coaching
- Interactive 2D/3D data visualization
- Motion design used to reinforce product feedback

## Production notes

The current repository is a strong product prototype and technical showcase. Before production release, complete the remaining TypeScript cleanup, verify authentication and authorization rules, configure production environment variables, add automated tests, and establish CI checks.

## Status

Portfolio project demonstrating modern React/Next.js product development, interactive UX, data-backed application design, and AI integration.

## License

No license is currently included. Add an appropriate license before open distribution.
