# Nisarg’s TradeLab — Frontend

*Track. Analyze. Improve.*

> Frontend repository for **Nisarg’s TradeLab**, a personal trading journal, risk-management, analytics, MT5-sync, and AI-assisted performance platform.

**Frontend repository:** https://github.com/Nisarg-13/Nisarg-TradeLab-Frontend  
**Backend repository:** FastAPI backend (`Nisarg-TradeLab-Backend-FastAPI`) — production API on FastAPI Cloud

> The legacy NestJS backend is retired. All API calls go to the FastAPI backend.

---

## 1. Repository Scope

This repository contains **only the frontend/UI application**.

### This repository is responsible for

- Application layout and navigation
- Authentication UI
- Dashboard UI
- Trade journal UI
- New/edit/close trade forms
- Risk Calculator UI
- Live Trades UI
- Analytics dashboards and charts
- Strategy/tag/mistake management UI
- Daily Journal UI
- AI Coach UI
- Settings UI
- Responsive/mobile experience
- API client layer
- Loading, empty, and error states
- Frontend validation for user experience
- Accessibility
- Dark mode

### This repository is NOT responsible for

- PostgreSQL access
- Prisma
- Database migrations
- Canonical risk calculations
- Canonical analytics calculations
- MT5 event processing
- MT5 historical import logic
- Gemini API calls
- Server-side authorization
- Secret keys
- Broker credentials
- Trading execution

Those responsibilities belong to:

```text
Nisarg-TradeLab-Backend-FastAPI
```

---

## 2. Product Goal

Nisarg’s TradeLab should help a trader answer questions such as:

- Which instrument is most profitable?
- Which instrument causes the biggest losses?
- At what time is performance strongest?
- Which strategy has the highest expectancy?
- Which trading session performs best?
- Does higher risk reduce performance?
- Which mistakes are associated with the largest losses?
- Is performance better when the trading plan is followed?
- Are winning trades being closed too early?
- How does the latest 20-trade performance compare with the previous 20?
- What historical behaviors should be improved?

The frontend should make these answers fast, clear, and easy to understand.

---

## 3. High-Level Architecture

```text
                    Nisarg's TradeLab

        +----------------------------------+
        | Nisarg-TradeLab-Frontend         |
        |                                  |
        | Next.js                          |
        | React                            |
        | TypeScript                       |
        | Tailwind CSS                     |
        | shadcn/ui                        |
        | Recharts                         |
        | Clerk                            |
        +----------------+-----------------+
                         |
                         | HTTPS / REST API
                         v
        +----------------------------------+
        | Nisarg-TradeLab-Backend-FastAPI  |
        |                                  |
        | Python + FastAPI               |
        | SQLAlchemy                     |
        | PostgreSQL / Neon              |
        | Risk Engine                    |
        | Analytics Engine               |
        | OpenAI / Gemini AI             |
        | MT5 Sync                       |
        +----------------------------------+
```

The frontend must never connect directly to PostgreSQL, Gemini, or MT5.

---

## 4. Frontend Technology Stack

Use stable compatible versions of:

```text
Next.js
React
TypeScript
Tailwind CSS
shadcn/ui
Recharts
Clerk
Zod
React Hook Form
Vitest
React Testing Library
Playwright
ESLint
Prettier
```

Prefer React Server Components where appropriate, but interactive trading forms, filters, charts, and live states may use Client Components.

---

## 5. Recommended Folder Structure

```text
Nisarg-TradeLab-Frontend/
|
|-- app/
|   |-- (auth)/
|   |   |-- sign-in/
|   |   `-- sign-up/
|   |
|   |-- (app)/
|   |   |-- dashboard/
|   |   |-- trades/
|   |   |   |-- page.tsx
|   |   |   |-- new/
|   |   |   `-- [id]/
|   |   |-- live-trades/
|   |   |-- risk-calculator/
|   |   |-- analytics/
|   |   |   |-- overview/
|   |   |   |-- instruments/
|   |   |   |-- strategies/
|   |   |   |-- time/
|   |   |   |-- risk/
|   |   |   |-- psychology/
|   |   |   `-- mistakes/
|   |   |-- strategies/
|   |   |-- daily-journal/
|   |   |-- ai-coach/
|   |   |-- accounts/
|   |   `-- settings/
|   |
|   |-- layout.tsx
|   `-- page.tsx
|
|-- components/
|   |-- analytics/
|   |-- charts/
|   |-- dashboard/
|   |-- forms/
|   |-- layout/
|   |-- live-trades/
|   |-- risk/
|   |-- trades/
|   `-- ui/
|
|-- lib/
|   |-- api/
|   |-- auth/
|   |-- constants/
|   |-- formatting/
|   |-- hooks/
|   |-- schemas/
|   `-- utils/
|
|-- types/
|
|-- tests/
|
|-- public/
|
|-- .env.example
`-- README.md
```

---

## 6. Main Navigation

```text
Dashboard
Trades
Live Trades
Risk Calculator
Analytics
Strategies
Daily Journal
AI Coach
Accounts
Settings
```

Desktop should use a sidebar.

Mobile should use a compact navigation pattern suitable for smaller screens.

---

## 7. Authentication

Use Clerk for authentication UI.

V1 authentication methods:

```text
Google
Email
```

The frontend receives authentication state from Clerk and includes the required auth token/session when calling the backend.

### Important

Do not treat a frontend `userId` as authorization.

The backend determines the authenticated user from the Clerk token.

The frontend must never send a user ID as a trusted ownership field.

---

## 8. API Client Layer

All backend communication should go through a centralized API client.

Example structure:

```text
lib/api/
|-- client.ts
|-- accounts.ts
|-- trades.ts
|-- risk.ts
|-- analytics.ts
|-- strategies.ts
|-- journal.ts
|-- mt5.ts
`-- ai.ts
```

Do not scatter raw `fetch()` calls throughout components.

The API layer should handle:

- Base URL
- Auth headers
- JSON parsing
- Error normalization
- Request cancellation where useful
- Typed responses

---

## 9. Environment Variables

Create `.env.example`.

```env
NEXT_PUBLIC_API_BASE_URL=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
```

Do not put backend secrets in this repository.

Never expose:

```text
DATABASE_URL
CLERK_SECRET_KEY
GEMINI_API_KEY
MT5_CONNECTION_TOKEN_SECRET
```

---

# 10. Dashboard

The dashboard should present the trader’s current performance at a glance.

## Summary Cards

Display:

```text
Net PnL
Return %
Total Trades
Win Rate
Profit Factor
Expectancy
Average R
Maximum Drawdown
Current Drawdown
Current Open Risk
```

## Dashboard Sections

```text
Equity Curve
PnL Calendar
Instrument Performance
Strategy Performance
Recent Trades
Live Positions
AI Insights
```

All numerical values come from backend analytics APIs.

The frontend must not independently recalculate canonical statistics.

---

# 11. Trade Journal UI

## Trades List

Support:

- Search
- Date filtering
- Account filtering
- Instrument filtering
- Strategy filtering
- Direction filtering
- Result filtering
- Pagination
- Sorting

Columns/cards may show:

```text
Instrument
Direction
Opened At
Closed At
Entry
Exit
Risk
PnL
Realized R
Strategy
Status
```

---

## Trade Details

Display:

```text
Trade summary
Entry/exit executions
Original plan
Current/final values
Trade timeline
Strategy
Tags
Psychology
Mistakes
Screenshots
Notes
Lessons
```

---

## New Trade

The workflow should be optimized for speed.

```text
Account
Instrument
Direction
Entry
Stop Loss
Take Profit
Risk
Position Size
Strategy
Tags
Emotion
Reason
Notes
Screenshot
```

Risk values should be calculated using the backend Risk Calculator API.

---

# 12. Risk Calculator UI

This is a first-class feature.

Inputs:

```text
Trading Account
Instrument
Direction
Entry Price
Stop Loss
Take Profit
Risk Mode
Risk Percentage / Fixed Amount
```

Outputs:

```text
Account Balance
Risk %
Risk Amount
Stop Distance
Recommended Position Size
Potential Loss
Potential Profit
Risk : Reward
Current Daily Risk
Daily Risk After Trade
Current Open Risk
Open Risk After Trade
```

Provide risk presets:

```text
0.25%
0.50%
0.75%
1.00%
```

The backend is the source of truth for position sizing.

---

## Risk Warnings

Clearly display backend warnings such as:

```text
Risk exceeds configured maximum.
Daily risk limit would be exceeded.
Maximum number of trades reached.
Maximum consecutive loss rule reached.
Open-risk limit would be exceeded.
```

Use:

```text
warning
critical
blocked
```

visual states.

If backend returns a strict-mode violation, disable the final action and explain why.

---

# 13. Risk Calculator -> New Trade

Provide:

```text
Create Trade
```

The calculated values should pre-fill the New Trade form.

Transfer:

```text
Account
Instrument
Direction
Entry
SL
TP
Risk %
Risk Amount
Position Size
Planned R:R
```

Then the user adds the human context.

---

# 14. Live Trades UI

Display currently open MT5-synchronized positions.

Show:

```text
Instrument
LONG / SHORT
Entry
Current Price
SL
TP
Volume
Floating PnL
Current R
Opened At
Last Sync
```

The backend controls whether data is considered live or stale.

UI states:

```text
LIVE
STALE
DISCONNECTED
```

Never show stale data as live.

---

# 15. Analytics UI

Create dedicated analytics pages.

## Overview

```text
Net PnL
Win Rate
Profit Factor
Expectancy
Average R
Drawdown
Equity Curve
```

## Instruments

For each instrument show:

```text
Trades
Win Rate
PnL
Average R
Expectancy
Profit Factor
Confidence Level
```

## Strategies

Show the same style of metrics by strategy/setup.

## Time

Support:

```text
Hour
Day of Week
Month
Trading Session
```

## Risk

Analyze performance by risk percentage.

## Psychology

Compare emotions and plan compliance.

## Mistakes

Show trade count, PnL, and R associated with mistake tags.

---

# 16. Global Analytics Filters

Use a consistent global filter model:

```text
Account
Date Range
Instrument
Strategy
Direction
Session
Result
Risk %
Emotion
Mistake
Followed Plan
```

Filters should be reflected in the URL where practical so views are shareable/bookmarkable.

---

# 17. Heatmap

Create:

```text
Day of Week x Hour
```

Metric selector:

```text
PnL
Average R
Win Rate
Trade Count
```

Tooltip must show sample size.

---

# 18. Trading Calendar

Create a calendar visualization.

Each day displays:

```text
PnL
R
Number of Trades
```

Clicking a day opens the relevant trades.

---

# 19. Equity Curve

Allow metric selection:

```text
Balance
Cumulative PnL
Cumulative R
```

The backend provides the data series.

---

# 20. Period Comparison UI

Support:

```text
Latest 20 vs Previous 20
This Month vs Last Month
Custom Period A vs Period B
```

Display deltas for:

```text
Win Rate
Average R
Expectancy
Profit Factor
Mistake Rate
Plan Compliance
Drawdown
```

---

# 21. Strategies, Tags and Mistakes UI

Users must be able to manage:

```text
Strategies
Tags / Confluences
Mistakes
```

Example strategies:

```text
Liquidity Sweep
Break and Retest
Trend Continuation
Reversal
London Breakout
```

Example mistakes:

```text
FOMO
Revenge Trade
Oversized Position
Moved SL Wider
Entered Early
Entered Late
Closed Winner Early
Overtrading
Ignored Setup
```

---

# 22. Daily Journal UI

Before trading:

```text
Sleep Quality
Focus
Mood
Market Bias
Maximum Trades
Maximum Risk
Pre-Market Notes
```

After trading:

```text
Post-Market Review
What Went Well?
What Went Wrong?
What Will Change Tomorrow?
```

Use quick-select controls where possible.

---

# 23. AI Coach UI

The AI Coach displays backend-generated analysis.

Sections:

```text
Summary
Strengths
Weaknesses
Patterns
Recommendations
Rules for Next Trades
Data Limitations
```

Always display sample-size/data-confidence information when returned.

Do not imply the AI predicts future market movement.

---

# 24. Ask My Journal UI

Provide a conversational interface.

Example questions:

```text
Which pair am I most profitable on?
When do I lose the most?
What is my best strategy?
How do I perform after two losses?
Do I perform worse above 1% risk?
Which mistakes cost me the most?
Compare my latest 20 trades with my previous 20.
```

The backend decides which analytics functions to use.

The frontend only sends the question and renders the structured answer.

---

# 25. Screenshots

Support:

```text
Before Trade
During Trade
After Trade
```

Frontend responsibilities:

- File picker
- Image preview
- Upload progress
- Type selection
- Error handling

Backend handles storage/security.

---

# 26. Responsive Design

Prioritize mobile UX for:

```text
Risk Calculator
New Trade
Live Trades
Trade Review
Daily Journal
```

Do not use wide desktop-only tables on small screens.

Switch to cards or horizontally constrained layouts where appropriate.

---

# 27. Accessibility

At minimum:

- Keyboard-accessible controls
- Visible focus states
- Semantic headings
- Accessible form labels
- Chart text summaries where practical
- Sufficient contrast
- `aria` attributes when necessary
- No information communicated only through color

---

# 28. Frontend Development Phases

Implement **one phase at a time**.

## Frontend Phase 0 — Foundation

Implement:

```text
Next.js
TypeScript
Tailwind CSS
shadcn/ui
Clerk dependencies
Zod
React Hook Form
Recharts
ESLint
Prettier
Vitest
React Testing Library
Playwright
Folder structure
.env.example
```

Add a placeholder landing page.

---

## Frontend Phase 1 — Authentication & App Shell

Implement:

```text
Sign In
Sign Up
Google Login
Email Login
Protected App Layout
Sidebar
Mobile Navigation
User Menu
Logout
```

---

## Frontend Phase 2 — Accounts & Settings UI

Implement:

```text
Trading Accounts List
Create Account Form
Edit Account Form
Archive Account
Risk Settings Form
Timezone Settings
Preferred Currency
```

Connect to backend APIs.

---

## Frontend Phase 3 — Risk Calculator

Implement:

```text
Risk Calculator Page
Instrument Selection
Risk Presets
Percentage/Fixed Risk Modes
Results Panel
Risk Warnings
Create Trade Flow
Mobile Layout
```

---

## Frontend Phase 4 — Trade Journal

Implement:

```text
Trades List
Trade Filters
New Trade
Edit Trade
Close Trade
Trade Details
Executions
Timeline
Strategies
Tags
Mistakes
Psychology
Notes
```

---

## Frontend Phase 5 — Dashboard

Implement:

```text
Summary Cards
Equity Curve
Trading Calendar
Instrument Performance
Strategy Performance
Recent Trades
```

---

## Frontend Phase 6 — Live Trades

Implement:

```text
Live Position Cards/Table
PnL Display
SL/TP Display
Connection Status
Last Sync
Stale State
Polling / Refresh
```

---

## Frontend Phase 7 — Advanced Analytics

Implement:

```text
Global Filters
Time Heatmap
Instrument Analytics
Strategy Analytics
Risk Analytics
Psychology Analytics
Mistake Analytics
Plan Compliance
Period Comparison
```

---

## Frontend Phase 8 — Daily Journal & AI Coach

Implement:

```text
Daily Journal
AI Analysis View
Ask My Journal Chat
Analysis History
Confidence Indicators
```

---

## Frontend Phase 9 — Polish

Implement:

```text
Dark Mode
Responsive Refinements
Loading Skeletons
Empty States
Error Boundaries
Toast Notifications
Accessibility Review
Performance Optimization
E2E Tests
```

---

# 29. Frontend Testing Requirements

At minimum test:

```text
Authentication redirects
Protected routes
Form validation
Risk calculator API states
Risk warnings
Trade form behavior
Filter state
Responsive navigation
Live/stale states
Analytics rendering
Error handling
```

Do not duplicate backend business-logic tests in the frontend.

---

# 30. Frontend Code Rules

Prefer:

```text
Small reusable components
Typed API responses
Shared form components
Central API client
Server Components where appropriate
Client Components only when needed
Zod validation
Accessible UI
```

Avoid:

```text
any
Raw fetch calls everywhere
Database logic
Prisma
Gemini SDK
MT5 code
Hardcoded analytics calculations
Hardcoded risk calculations
Secrets in client code
Huge page components
```

---

# 31. Cursor Rules for This Repository

Cursor must read this README before implementing.

Before every phase:

1. Inspect the current repository.
2. Explain the planned changes.
3. List files to create/modify.
4. Identify backend API dependencies.
5. Implement only the requested frontend phase.

After every phase:

1. Run lint.
2. Run TypeScript type checking.
3. Run unit/component tests.
4. Run relevant Playwright tests.
5. Fix failures.
6. Summarize changes.
7. List any required backend endpoints.
8. Stop before the next phase.

---

# 32. First Cursor Prompt

```text
Read README.md completely.

This repository is Nisarg-TradeLab-Frontend.

The backend is a separate repository:
https://github.com/Nisarg-13/Nisarg-TradeLab-Backend

Do not implement backend code here.

Implement only Frontend Phase 0 - Foundation.

Before making changes:
1. Inspect the repository.
2. Explain the implementation plan.
3. List files to create or modify.
4. List required frontend environment variables.

After implementation:
1. Run lint.
2. Run TypeScript type checking.
3. Run tests.
4. Fix all errors.
5. Summarize the implementation.
6. Stop.

Do not implement Phase 1.
```

---

# 33. Product Philosophy

The UI should make the following workflow simple:

```text
PLAN TRADE
    |
    v
RISK CALCULATOR
    |
    v
TAKE TRADE
    |
    v
JOURNAL / MT5 SYNC
    |
    v
REVIEW
    |
    v
ANALYTICS
    |
    v
AI INSIGHTS
    |
    v
IMPROVE
```

The frontend should make complex trading data understandable without hiding important context such as sample size, risk, drawdown, or stale live data.
