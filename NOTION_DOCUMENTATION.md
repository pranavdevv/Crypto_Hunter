# 🎮 Crypto Hunter - AI Anomaly Trading Game

> A crypto trading simulation where an AI (Tambo) secretly sabotages your trading interface with glitches!

---

## 📋 Project Overview

**Concept:** Players trade cryptocurrencies to grow $10,000 into $25,000. As they profit, an AI "Game Master" (powered by Tambo AI) injects glitchy UI components to disrupt trading. Players must identify and purge anomalies before the system fails!

**Tech Stack:**

- Next.js 15 (React Framework)
- TypeScript
- Tailwind CSS
- Tambo AI (for AI-generated components)
- Recharts (for price charts)
- Party.js (for confetti effects)

---

## ✅ Changes Made

### Game Mechanics

| Change         | Description                                            |
| -------------- | ------------------------------------------------------ |
| Win Goal       | Changed from $50,000 → **$25,000** (faster games)      |
| Tick Rate      | Changed from 4 seconds → **2 seconds** (faster action) |
| Max Anomalies  | Changed from 5 → **4** (since only 4 cryptos exist)    |
| Game Timer     | Now **stops** when game ends                           |
| Estimated Time | ~10-20 minutes per game                                |

### Visual Enhancements

| Change             | Description                                                           |
| ------------------ | --------------------------------------------------------------------- |
| Confetti           | Added party.js celebration on WIN                                     |
| Anomaly Indicators | Red border + "⚠️ GLITCH" badge on affected cards                      |
| Status Display     | Hidden exact anomaly count, shows only STABLE/WARNING/CRITICAL/DANGER |
| Tab Indicators     | Red "!" on tabs with anomalies                                        |

### Anomaly System

| Change        | Description                                          |
| ------------- | ---------------------------------------------------- |
| Spawn Timing  | Starts after 10 seconds (was 10% profit)             |
| Spawn Rate    | 15% base → up to 60% near goal (much harder)         |
| Status Levels | 0=STABLE, 1=WARNING, 2=CRITICAL, 3=DANGER, 4=FAILURE |

---

## ❌ Known Issues

### 🔴 Critical: Tambo AI Streaming Error

**Error Message:**

```
❌ Tambo AI error: Error: Error in streaming response
    at handleStreamResponse (advance-stream.mjs:48:27)
    at async TamboThreadProvider.useCallback[handleAdvanceStream]
    at async TamboThreadProvider.useCallback[sendThreadMessage]
    at async TamboThreadInputProvider.useCallback[submit]
```

**What's Happening:**

- Game sends prompts to Tambo AI (e.g., "Generate GlitchBuyButton_Red for BTC")
- Tambo AI fails to respond properly
- Components are NOT being generated
- Anomalies are counted but NOT visually displayed

**Possible Causes:**

1. API key issues
2. Rate limiting (too many requests)
3. Streaming response format mismatch
4. Network/CORS issues

**Temporary Workaround:**
We can switch to direct component rendering (bypassing Tambo AI) if needed.

### 🟡 Medium: Ghost/Bounce Anomalies Not Showing

**Ghost Button:**

- Should appear briefly then show "[COMPONENT UNAVAILABLE]"
- Currently not rendering at all (due to Tambo AI error above)

**Bounce Button:**

- Should bounce around with CSS animation
- Animation keyframes need to be added to global CSS

### 🟡 Medium: Multiple Anomalies Spam

- Game tries to send multiple prompts too fast
- Shows "⏳ Already submitting, skipping..." in console
- Need debouncing or queue system

---

## 📝 TODO - Need To Do

### 🔧 Bug Fixes

- [ ] Fix Tambo AI streaming error (investigate API response format)
- [ ] Add bounce animation keyframes to CSS
- [ ] Implement proper debouncing for anomaly triggers
- [ ] Add fallback to direct rendering if Tambo fails

### 🎮 Game Enhancements

- [ ] Add SELL button anomalies (currently only BUY buttons glitch)
- [ ] Add chart anomalies (fake price data, no grid, etc.)
- [ ] Add price spike/crash events
- [ ] Add sound effects for anomalies
- [ ] Add tutorial/onboarding for new players

### 🤖 Tambo AI Improvements

- [ ] Add more glitch component types
- [ ] Make AI choose anomalies based on context
- [ ] Add AI "taunts" via toast notifications
- [ ] Allow AI to control difficulty dynamically

### 💎 Polish

- [ ] Add leaderboard (best times)
- [ ] Add difficulty settings (Easy/Normal/Hard)
- [ ] Mobile responsive layout
- [ ] Add more cryptocurrencies
- [ ] Portfolio view with pie chart

---

## 📁 File Structure & Explanations

### `/src/app/` - Pages

#### `page.tsx` - Home/Start Screen

**Purpose:** Landing page with game intro and START button

**Key Elements:**

- Game title and description
- Trading objective explanation ($10k → $25k)
- "START GAME" button → navigates to /game

---

#### `game/page.tsx` - Main Game Page

**Purpose:** The actual trading game interface

**Key Functions:**

- `GameContent()` - Main game component
- Wraps everything in `TamboProvider` for AI access
- Contains game over detection logic
- Handles anomaly spawning timer

**Key Logic:**

```typescript
// Game Over Detection
if (activeAnomaliesCount >= MAX_ANOMALIES) → "anomalies" (lose)
if (balance <= 0) → "bankrupt" (lose)
if (balance >= WIN_BALANCE) → "win" (win!)

// Anomaly Spawning
useEffect(() => {
  if (shouldSpawn) triggerAnomaly(symbol, balance);
}, [gameTime]);
```

---

### `/src/components/game/` - Game UI Components

#### `CryptoCard.tsx`

**Purpose:** Displays one cryptocurrency with its chart and trading buttons

**Props:**

- `symbol` - Crypto name (BTC, ETH, etc.)
- `price` - Current price
- `history` - Price history for chart
- `holdings` - User's holdings
- `onBuy` / `onSell` - Trading functions
- `customBuyButton` - AI-generated glitch button (if any)

**Shows:**

- Price chart
- Holdings count
- SELL button
- BUY button (or glitched version)
- Red border + GLITCH badge if anomaly present

---

#### `CryptoChart.tsx`

**Purpose:** Renders the price line chart using Recharts

**Features:**

- Line chart with gradient fill
- X-axis (time) and Y-axis (price)
- Grid lines
- Color-coded by crypto

---

#### `GlobalStats.tsx`

**Purpose:** Top bar showing game status

**Displays:**

- Current balance
- P&L (profit/loss)
- System status (STABLE/WARNING/CRITICAL/DANGER)
- Game time (ticks)

**Hidden Info:**

- Exact anomaly count (only shows status label)
- Makes game harder - user doesn't know exactly how close to failure!

---

#### `GameOver.tsx`

**Purpose:** Win/Lose overlay when game ends

**Features:**

- Different messages for win/lose/anomalies
- Shows final balance and game time
- Confetti animation on WIN (party.js)
- Trophy icon for wins
- "PLAY AGAIN" button

---

#### `TransactionLog.tsx`

**Purpose:** Sidebar showing buy/sell history

**Shows:**

- Recent transactions
- BUY (green) / SELL (red) indicators
- Price and amount
- Timestamp

---

### `/src/components/tambo/` - Tambo AI Components

#### `GameButtons.tsx`

**Purpose:** All button variants that Tambo AI can generate

**Standard:**

- `StandardBuyButton` - Normal green buy button

**Glitch Variants:**
| Component | Effect |
|-----------|--------|
| `GlitchBuyButton_Red` | Red pulsing button (danger color) |
| `GlitchBuyButton_Typo` | Italic serif font (looks wrong) |
| `GlitchBuyButton_Jitter` | Shakes/bounces constantly |
| `GlitchBuyButton_Ghost` | Disappears after 3 seconds! |
| `GlitchBuyButton_Bounce` | Moves around (hard to click) |
| `GlitchBuyButton_Reverse` | Secretly SELLS instead of buying! |

---

### `/src/hooks/` - React Hooks

#### `useMarketEngine.ts`

**Purpose:** Core game state management

**State Managed:**

- `balance` - Current money
- `startBalance` - Initial $10,000
- `gameTime` - Seconds elapsed
- `assets` - All crypto data (price, holdings, history)
- `transactions` - Buy/sell history
- `isGameOver` - Game ended flag

**Functions:**

- `buyAsset(symbol, amount)` - Buy crypto
- `sellAsset(symbol, amount)` - Sell crypto
- `setGameOver()` - Stop the game timer

**Price Simulation:**
Uses Perlin noise for realistic, smooth price movements

---

#### `useGameMaster.tsx`

**Purpose:** Tambo AI integration for anomalies

**How It Works:**

1. Game calls `triggerAnomaly(symbol, balance)`
2. Hook creates a prompt for Tambo AI
3. Prompt is sent via `setValue()` + `submit()`
4. Hook listens for AI response via `useEffect`
5. Captures `renderedComponent` from AI response
6. Stores in `activeAnomalies` state

**Key Functions:**

- `triggerAnomaly(symbol, balance)` - Ask AI for glitch
- `clearAnomaly(symbol)` - Remove anomaly (SCAN & PURGE)

---

### `/src/lib/` - Utilities

#### `tambo.ts`

**Purpose:** Register components with Tambo AI

**Contains:**

- `components[]` - Array of components AI can generate
- Each component has: name, description, component, propsSchema

**Example:**

```typescript
{
  name: "GlitchBuyButton_Red",
  description: "A corrupted RED button...",
  component: GlitchBuyButton_Red,
  propsSchema: z.object({ symbol: z.string() }),
}
```

---

#### `cryptoColors.ts`

**Purpose:** Color schemes for each cryptocurrency

**Returns:** Gradient, text color, border color for BTC/ETH/SOL/DOGE

---

#### `perlin.ts`

**Purpose:** Perlin noise implementation for realistic price movement

---

## 🤖 How Tambo AI Integration Works

```
┌─────────────────────────────────────────────────────┐
│                    FLOW DIAGRAM                      │
├─────────────────────────────────────────────────────┤
│                                                      │
│  1. REGISTER (tambo.ts)                             │
│     "Hey Tambo, you can generate these components"  │
│                       ↓                              │
│  2. TRIGGER (useGameMaster.tsx)                     │
│     "Generate GlitchBuyButton_Red for BTC"          │
│                       ↓                              │
│  3. AI PROCESSES (Tambo Cloud)                      │
│     AI reads prompt, checks registry, creates JSX   │
│                       ↓                              │
│  4. CAPTURE (useGameMaster.tsx)                     │
│     Listen for renderedComponent in response        │
│                       ↓                              │
│  5. DISPLAY (CryptoCard.tsx)                        │
│     Show the glitch button instead of normal one    │
│                                                      │
└─────────────────────────────────────────────────────┘
```

**Key Tambo Hooks:**

- `useTamboThread()` - Access conversation (read responses)
- `useTamboThreadInput()` - Send messages (setValue + submit)

---

## 🎯 Game Rules Summary

| Rule             | Value                            |
| ---------------- | -------------------------------- |
| Starting Balance | $10,000                          |
| Win Condition    | Reach $25,000                    |
| Lose Condition   | $0 (bankrupt) OR 4 anomalies     |
| Price Update     | Every 2 seconds                  |
| Anomaly Spawn    | Starts after 10 seconds          |
| Anomaly Chance   | 15% → 60% (scales with progress) |
| Game Duration    | ~10-20 minutes                   |

---

## 🚀 How to Run

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

**Environment Variables (.env.local):**

```
NEXT_PUBLIC_TAMBO_API_KEY=your_tambo_api_key
```

---

## 📊 Status Levels

| Anomalies | Status   | Color       | Action            |
| --------- | -------- | ----------- | ----------------- |
| 0         | STABLE   | 🟢 Green    | Safe to trade     |
| 1         | WARNING  | 🟡 Yellow   | Be alert          |
| 2         | CRITICAL | 🟠 Orange   | Scan & Purge!     |
| 3         | DANGER   | 🔴 Red      | One more = death! |
| 4         | FAILURE  | 💀 Dark Red | GAME OVER         |

---

## 🎨 Design Notes

- Dark theme (slate-950 background)
- Gradient accents (green-blue for positive, red for danger)
- Monospace fonts for financial data
- Smooth animations (fade-in, pulse, bounce)
- Responsive layout (mobile support pending)

---

## 📅 Last Updated

**Date:** February 7, 2026
**Version:** 1.0.0-beta

---

_Built for Tambo AI Hackathon_ 🏆
