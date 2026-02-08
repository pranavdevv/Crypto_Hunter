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
import { PurgeDialog } from "@/components/game/PurgeDialog";

const MAX_ANOMALIES = 4; // 4 cryptos = max 4 anomalies
const WIN_BALANCE = 25000;
const GRACE_PERIOD_MS = 5000; // 5 seconds (TESTING)
const BASE_ANOMALY_INTERVAL_MS = 20000; // 20 seconds
const INR_EXCHANGE_RATE = 85;

// Inner component to usage the hooks (must be inside Provider)
function GameContent() {
  const { gameState, buyAsset, sellAsset, setGameOver } = useMarketEngine();
  const { balance, startBalance, gameTime, assets, transactions } = gameState;
  const { activeAnomalies, triggerAnomaly, clearAnomaly, isReady } =
    useGameMaster();

  // Debug: Check API Key
  React.useEffect(() => {
    const key = process.env.NEXT_PUBLIC_TAMBO_API_KEY;
    if (!key) {
      console.error("❌ CRITICAL: NEXT_PUBLIC_TAMBO_API_KEY is missing!");
    } else if (key === "your_key_here") {
      console.error("❌ CRITICAL: You haven't replaced 'your_key_here' with your actual API key!");
    } else {
      console.log(`✅ API Key detected (${key.length} chars). Connecting to Tambo...`);
    }
  }, []);

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

  // Timing State
  const [gracePeriodEndTime] = React.useState<number>(Date.now() + GRACE_PERIOD_MS);
  const [nextAnomalyTime, setNextAnomalyTime] = React.useState<number>(
    Date.now() + GRACE_PERIOD_MS + 10000 // First anomaly 10s after grace period
  );
  const [showWarning, setShowWarning] = React.useState(false);


  React.useEffect(() => {
    // Check for game over conditions
    if (gameOverReason) return;
  }, [activeAnomaliesCount, balance, gameOverReason, setGameOver]);

  const handleRestart = () => {
    window.location.reload();
  };

  // Purge Dialog State
  const [isPurgeDialogOpen, setIsPurgeDialogOpen] = React.useState(false);

  const handleReport = () => {
    setIsPurgeDialogOpen(true);
  };

  const handlePurgeConfirm = (selectedType: "button" | "chart") => {
    const anomalies = activeAnomalies[activeTab];
    if (!anomalies) return;

    let hasAnomaly = false;

    if (selectedType === "button") {
      hasAnomaly = !!(anomalies.buy || anomalies.sell);
    } else if (selectedType === "chart") {
      hasAnomaly = !!anomalies.chart;
    }

    if (hasAnomaly) {
      clearAnomaly(activeTab);
      setIsPurgeDialogOpen(false);
      console.log("✅ PURGE SUCCESSFUL");
    } else {
      console.log("❌ PURGE FAILED");
      setIsPurgeDialogOpen(false);
    }
  };

  // ===== GAME OVER: ALL TABS ANOMALIED FOR 30s =====
  const [allAnomaliesStartTime, setAllAnomaliesStartTime] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (gameOverReason) return;

    const allTabsHaveAnomalies = CRYPTO_LIST.every((sym) => !!activeAnomalies[sym]);

    if (allTabsHaveAnomalies) {
      if (allAnomaliesStartTime === null) {
        // Start the timer
        setAllAnomaliesStartTime(Date.now());
        console.log("⚠️ ALL CRYPTOS ANOMALIED! 30s countdown started...");
      } else {
        // Check if 30 seconds have passed
        const elapsed = Date.now() - allAnomaliesStartTime;
        if (elapsed >= 30000) {
          console.log("💀 GAME OVER: All cryptos anomalied for 30+ seconds");
          setGameOverReason("anomalies");
          setGameOver();
        }
      }
    } else {
      // Reset timer if not all have anomalies
      if (allAnomaliesStartTime !== null) {
        console.log("✅ Timer reset: Not all cryptos have anomalies");
        setAllAnomaliesStartTime(null);
      }
    }
  }, [activeAnomalies, allAnomaliesStartTime, gameOverReason, setGameOver]);

  // ===== AUTOMATIC ANOMALY INJECTION (DYNAMIC TIMING) =====
  React.useEffect(() => {
    if (gameOverReason) return;

    const now = Date.now();
    const timeRemainingInGrace = gracePeriodEndTime - now;

    // 1. GRACE PERIOD HANDLING
    if (timeRemainingInGrace > 0) {
      if (timeRemainingInGrace < 10000 && !showWarning) {
        setShowWarning(true);
      }
      return;
    }

    if (showWarning) setShowWarning(false);

    // 2. TIMING CHECK
    if (now < nextAnomalyTime) return;

    // 3. SPAWN LOGIC
    if (activeAnomaliesCount >= MAX_ANOMALIES) {
      setNextAnomalyTime(now + 5000);
      return;
    }

    if (!isReady) {
      setNextAnomalyTime(now + 2000);
      return;
    }

    const availableCryptos = CRYPTO_LIST.filter(
      (sym) => !activeAnomalies[sym],
    );

    if (availableCryptos.length > 0) {
      const randomSymbol =
        availableCryptos[Math.floor(Math.random() * availableCryptos.length)];
      triggerAnomaly(randomSymbol, balance);
    }

    // 4. CALCULATE NEXT INTERVAL
    const progress = Math.max(0, (balance - startBalance) / (WIN_BALANCE - startBalance));

    let minAlpha = 10000;
    let maxAlpha = 35000;

    if (progress >= 0.75) maxAlpha = 20000;
    else if (progress >= 0.50) maxAlpha = 25000;
    else if (progress >= 0.25) maxAlpha = 30000;

    const alpha = Math.floor(Math.random() * (maxAlpha - minAlpha + 1)) + minAlpha;
    const totalInterval = BASE_ANOMALY_INTERVAL_MS + alpha;

    console.log(`⏱️ Next anomaly in ${(totalInterval / 1000).toFixed(1)}s`);
    setNextAnomalyTime(now + totalInterval);

  }, [
    gameTime,
    balance,
    startBalance,
    activeAnomaliesCount,
    activeAnomalies,
    triggerAnomaly,
    gameOverReason,
    isReady,
    gracePeriodEndTime,
    nextAnomalyTime,
    showWarning
  ]);

  return (
    <>
      {gameOverReason && (
        <GameOver
          reason={gameOverReason}
          finalBalance={balance}
          startBalance={startBalance}
          gameTime={gameTime * 2}
          onRestart={handleRestart}
        />
      )}

      <div className="min-h-screen bg-black text-slate-100 p-4 font-sans flex justify-center">
        <div className="w-full max-w-7xl space-y-6">
          <GlobalStats
            balance={balance}
            startBalance={startBalance}
            gameTime={gameTime}
            activeAnomaliesCount={activeAnomaliesCount}
          />

          {/* GRACE PERIOD WARNING ONLY */}
          {Date.now() < gracePeriodEndTime && (
            <>
              <div className="w-full bg-blue-900/30 border border-blue-500/50 p-2 text-center text-blue-200 text-sm font-mono animate-pulse">
                🛡️ GRACE PERIOD ACTIVE: MEMORIZE THE INTERFACE ({Math.ceil((gracePeriodEndTime - Date.now()) / 1000)}s)
              </div>
              {showWarning && (
                <div className="mt-2 w-full bg-yellow-900/80 border-y-2 border-yellow-500 p-4 text-center text-white font-bold text-2xl animate-pulse tracking-[0.2em] shadow-[0_0_30px_rgba(234,179,8,0.5)]">
                  ⚠️ SYSTEM WARNING: ANOMALIES IMMINENT ⚠️
                </div>
              )}
            </>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
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
                            {symbol}
                          </TabsTrigger>
                        );
                      })}
                    </TabsList>

                    {CRYPTO_LIST.map((symbol) => {
                      const asset = assets[symbol];
                      const anomaly = activeAnomalies[symbol];

                      // Check for INR Glitch
                      const isINR = anomaly?.chart?.type === "GlitchChart_INR";
                      const currencyLabel = isINR ? "INR" : "USD";

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
                            currency={currencyLabel}
                            onBuy={(amount) => {
                              // EXPLOIT: If INR, user pays 1/85th of the actual price!
                              const multiplier = isINR ? (1 / INR_EXCHANGE_RATE) : 1;
                              buyAsset(symbol, amount, multiplier);
                            }}
                            onSell={(amount) => {
                              // PENALTY: Valid sales in INR pay out peanuts
                              const multiplier = isINR ? (1 / INR_EXCHANGE_RATE) : 1;
                              sellAsset(symbol, amount, multiplier);
                            }}
                            customBuyButton={anomaly?.buy?.component}
                            customSellButton={anomaly?.sell?.component}
                            customChart={anomaly?.chart?.component}
                          />
                        </TabsContent>
                      );
                    })}
                  </Tabs>
                </CardContent>
              </Card>

              <div className="flex justify-center">
                <button
                  onClick={handleReport}
                  className="px-8 py-3 bg-red-900/50 border border-red-500/50 text-red-200 rounded hover:bg-red-900/80 transition-colors uppercase tracking-widest text-sm font-bold shadow-[0_0_20px_rgba(220,38,38,0.3)] animate-pulse"
                >
                  SCAN & PURGE SYSTEMS
                </button>
              </div>

              <PurgeDialog
                isOpen={isPurgeDialogOpen}
                onClose={() => setIsPurgeDialogOpen(false)}
                onConfirm={handlePurgeConfirm}
              />
            </div>

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
      <React.Suspense fallback={<div className="text-white text-center p-10">Loading Game Environment...</div>}>
        <GameContent />
      </React.Suspense>
    </TamboProvider>
  );
}
