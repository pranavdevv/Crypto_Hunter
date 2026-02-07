"use client";

import React from "react";
import { useMarketEngine, Symbol } from "@/hooks/useMarketEngine";
import { GlobalStats } from "@/components/game/GlobalStats";
import { CryptoCard } from "@/components/game/CryptoCard";
import { GameOver } from "@/components/game/GameOver";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { TamboProvider } from "@tambo-ai/react";
import { components, tools } from "@/lib/tambo";
import { useGameMaster } from "@/hooks/useGameMaster";
import { TransactionLog } from "@/components/game/TransactionLog";
import { getCryptoColor } from "@/lib/cryptoColors";

const MAX_ANOMALIES = 4; // 4 cryptos = max 4 anomalies
const WIN_BALANCE = 25000;

// Inner component to usage the hooks (must be inside Provider)
function GameContent() {
  const { gameState, buyAsset, sellAsset, setGameOver } = useMarketEngine();
  const { balance, startBalance, gameTime, assets, transactions } = gameState;
  const { activeAnomalies, triggerAnomaly, clearAnomaly } = useGameMaster();

  // Track active tab
  const [activeTab, setActiveTab] = React.useState<Symbol>("BTC");

  // Derive active anomalies count
  const CRYPTO_LIST: Symbol[] = ["BTC", "ETH", "SOL", "DOGE"];
  const activeAnomaliesCount =
    Object.values(activeAnomalies).filter(Boolean).length;

  // Game Over Detection
  const [gameOverReason, setGameOverReason] = React.useState<
    "anomalies" | "bankrupt" | "win" | null
  >(null);

  React.useEffect(() => {
    // Check for game over conditions
    if (gameOverReason) return; // Already game over

    if (activeAnomaliesCount >= MAX_ANOMALIES) {
      setGameOverReason("anomalies");
      setGameOver(); // Stop the timer!
    } else if (balance <= 0) {
      setGameOverReason("bankrupt");
      setGameOver(); // Stop the timer!
    } else if (balance >= WIN_BALANCE) {
      setGameOverReason("win");
      setGameOver(); // Stop the timer!
    }
  }, [activeAnomaliesCount, balance, gameOverReason, setGameOver]);

  const handleRestart = () => {
    // Reload the page to reset all state
    window.location.reload();
  };

  const handleReport = () => {
    // Only clear anomaly on the currently active tab
    clearAnomaly(activeTab);
  };

  // ===== ANOMALY INJECTION - TAMBO AI POWERED =====
  // Anomalies spawn based on progress, with rate limiting to avoid API spam
  React.useEffect(() => {
    // Don't spawn anomalies if game is over
    if (gameOverReason) return;

    // Calculate progress (0 to 1 based on balance)
    const progress = Math.max(
      0,
      (balance - startBalance) / (WIN_BALANCE - startBalance),
    );

    // Grace period at start - let player get comfortable
    if (gameTime < 15) return; // 15 seconds grace period

    // Don't spawn if we already have max
    if (activeAnomaliesCount >= MAX_ANOMALIES) return;

    // BALANCED: Lower chance to avoid spamming Tambo AI
    // Base 5%, up to 25% at goal (every 2 second tick)
    const spawnChance = 0.05 + progress * 0.2;

    // Random check each tick
    if (Math.random() < spawnChance) {
      // Pick a random crypto that doesn't already have an anomaly
      const availableCryptos = CRYPTO_LIST.filter(
        (sym) => !activeAnomalies[sym],
      );
      if (availableCryptos.length > 0) {
        const randomSymbol =
          availableCryptos[Math.floor(Math.random() * availableCryptos.length)];
        triggerAnomaly(randomSymbol, balance);
      }
    }
  }, [
    gameTime,
    balance,
    startBalance,
    activeAnomaliesCount,
    activeAnomalies,
    triggerAnomaly,
    gameOverReason,
  ]);

  return (
    <>
      {/* Game Over Overlay */}
      {gameOverReason && (
        <GameOver
          reason={gameOverReason}
          finalBalance={balance}
          startBalance={startBalance}
          gameTime={gameTime * 2} // Convert ticks to seconds (TICK_RATE_MS = 2000)
          onRestart={handleRestart}
        />
      )}

      <div className="min-h-screen bg-black text-slate-100 p-4 font-sans flex justify-center">
        <div className="w-full max-w-7xl space-y-6">
          {/* Header / Global Stats */}
          <GlobalStats
            balance={balance}
            startBalance={startBalance}
            gameTime={gameTime}
            activeAnomaliesCount={activeAnomaliesCount}
          />

          {/* Main Content Grid: Game + Transaction Log */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
            {/* LEFT COLUMN: Main Game */}
            <div className="space-y-6">
              <Card className="bg-slate-900 border-slate-800 min-h-[500px]">
                <CardContent className="p-6">
                  <Tabs
                    defaultValue="BTC"
                    className="w-full"
                    onValueChange={(value) => setActiveTab(value as Symbol)}
                  >
                    <TabsList className="grid w-full grid-cols-4 bg-slate-950 mb-8 p-1 gap-1">
                      {CRYPTO_LIST.map((symbol) => {
                        const color = getCryptoColor(symbol);
                        return (
                          <TabsTrigger
                            key={symbol}
                            value={symbol}
                            className={`
                              font-mono font-bold
                              data-[state=active]:bg-gradient-to-r data-[state=active]:${color.gradient}
                              data-[state=active]:text-white
                              data-[state=inactive]:text-slate-500
                              data-[state=inactive]:hover:${color.text}
                              transition-all
                            `}
                          >
                            {symbol}{" "}
                            {activeAnomalies[symbol] && (
                              <span className="ml-2 text-red-500">!</span>
                            )}
                          </TabsTrigger>
                        );
                      })}
                    </TabsList>

                    {CRYPTO_LIST.map((symbol) => {
                      const asset = assets[symbol];
                      return (
                        <TabsContent
                          key={symbol}
                          value={symbol}
                          className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300"
                        >
                          <CryptoCard
                            symbol={symbol}
                            price={asset.price}
                            history={asset.history}
                            holdings={asset.holdings}
                            onBuy={(amount) => buyAsset(symbol, amount)}
                            onSell={(amount) => sellAsset(symbol, amount)}
                            customBuyButton={activeAnomalies[symbol]}
                          />
                        </TabsContent>
                      );
                    })}
                  </Tabs>
                </CardContent>
              </Card>

              {/* SCAN & PURGE Button */}
              <div className="flex justify-center">
                <button
                  onClick={handleReport}
                  className="px-8 py-3 bg-red-900/50 border border-red-500/50 text-red-200 rounded hover:bg-red-900/80 transition-colors uppercase tracking-widest text-sm font-bold shadow-[0_0_20px_rgba(220,38,38,0.3)] animate-pulse"
                >
                  SCAN & PURGE SYSTEMS
                </button>
              </div>
            </div>

            {/* RIGHT COLUMN: Transaction Log */}
            <TransactionLog transactions={transactions} />
          </div>
        </div>
      </div>
    </>
  );
}

export default function GamePage() {
  return (
    <TamboProvider
      apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}
      components={components}
      tools={tools}
      tamboUrl={process.env.NEXT_PUBLIC_TAMBO_URL}
    >
      <GameContent />
    </TamboProvider>
  );
}
