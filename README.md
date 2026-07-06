# NINJA — Institutional Wealth Advisory Platform

AI-powered institutional wealth advisory platform with a structured client suitability assessment, an Investment Policy Statement (IPS) engine, a deterministic portfolio construction engine recommending Indian investment products, and a full investment dashboard.

**Live demo:** https://tejasgjadhav.github.io/NINJA/

## Flow

1. **Landing page** — institutional value proposition, CTA "Start Portfolio Assessment".
2. **Assessment** — a 6-question structured suitability interview (investor type, objective, horizon, risk tolerance, corpus, constraints) conducted by a professional advisor chatbot.
3. **IPS engine** — codifies the answers into a formal Investment Policy Statement: return expectations, risk profile, liquidity needs, asset-allocation guidelines with policy bands, review and rebalancing rules.
4. **Portfolio engine** — a deterministic allocation matrix (risk × horizon, tilted by objective and constraints) mapped to a curated catalog of real Indian products (mutual funds, index funds, international FoFs, REITs/InvITs, PMS strategies), with portfolio metrics from capital-market assumptions.
5. **Dashboard** — overview stats (CAGR, volatility, Sharpe, drawdown, risk score), allocation donut, geographic exposure, fund and PMS recommendations, goal tracker, portfolio drift with rebalancing suggestions, one-page IPS summary, auto-drafted quarterly review letter, and rule-generated AI insights.

## Stack

Next.js (App Router) · React · TypeScript · Tailwind CSS · shadcn/ui · Framer Motion · Recharts

Fully client-side (static export), deployed to GitHub Pages via GitHub Actions.

## Development

```bash
npm install
npm run dev        # http://localhost:3000/NINJA
npm run build      # static export to out/
npx tsx scripts/engine-sanity.ts   # engine invariant checks
```

## Architecture

- `src/types/` — domain model (ClientProfile, IPS, AssetAllocation, ProductRecommendation, …)
- `src/data/` — question script, allocation matrices, capital-market assumptions, product catalog
- `src/lib/engine/` — pure-TypeScript engines (profile, allocation, IPS, products, metrics, drift, goals, insights, review letter); zero React imports, the seam for future auth/CRM/live-NAV/PDF integrations
- `src/components/` — landing, assessment, dashboard, and shared motion/UI components

## Disclaimer

Demonstration platform. All portfolios, products and figures are illustrative and do not constitute investment advice.
