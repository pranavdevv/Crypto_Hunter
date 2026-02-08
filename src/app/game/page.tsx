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
import { ThemeToggle } from "@/components/ThemeToggle";
import { motion } from "framer-motion";

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

      <div
        className="min-h-screen text-base font-sans flex justify-center relative transition-colors duration-300"
        style={{ backgroundColor: "var(--bg-primary)" }}
      >
        {/* Background accent */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-64 sm:w-96 h-64 sm:h-96 rounded-full blur-3xl pointer-events-none opacity-20"
          style={{ backgroundColor: "var(--accent-primary)" }}
        />

        {/* Theme Toggle */}
        <motion.div
          className="absolute top-3 sm:top-4 right-3 sm:right-4 z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <ThemeToggle />
        </motion.div>

        <div className="w-full max-w-7xl space-y-4 sm:space-y-6 relative z-10 p-3 sm:p-4">
          {/* Header / Global Stats */}
          <GlobalStats
            balance={balance}
            startBalance={startBalance}
            gameTime={gameTime}
            activeAnomaliesCount={activeAnomaliesCount}
          />

          {/* Main Content Grid: Game + Transaction Log */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4 sm:gap-6">
            {/* LEFT COLUMN: Main Game */}
            <motion.div
              className="space-y-4 sm:space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <Card
                className="border min-h-[400px] sm:min-h-[500px] transition-colors duration-300"
                style={{
                  backgroundColor: "var(--card-bg)",
                  borderColor: "var(--border-color)",
                  boxShadow: "var(--shadow-lg)",
                }}
              >
                <CardContent className="p-3 sm:p-6">
                  <Tabs
                    defaultValue="BTC"
                    className="w-full"
                    onValueChange={(value) => setActiveTab(value as Symbol)}
                  >
                    <TabsList className="grid w-full grid-cols-4 mb-6 sm:mb-8 p-1 gap-1"
                      style={{
                        backgroundColor: "var(--bg-tertiary)",
                      }}
                    >
                      {CRYPTO_LIST.map((symbol) => {
                        const color = getCryptoColor(symbol);
                        return (
                          <TabsTrigger
                            key={symbol}
                            value={symbol}
                            className={`
                              font-mono font-bold text-xs sm:text-sm
                              data-[state=active]:bg-gradient-to-r data-[state=active]:${color.gradient}
                              data-[state=active]:text-white
                              data-[state=inactive]:opacity-60
                              transition-all
                            `}
                          >
                            {symbol}{" "}
                            {activeAnomalies[symbol] && (
                              <span className="ml-1 text-red-500">!</span>
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
                          className="space-y-3 sm:space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300"
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
              <motion.div
                className="flex justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <motion.button
                  onClick={handleReport}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg hover:opacity-80 transition-all uppercase tracking-widest text-xs sm:text-sm font-bold shadow-lg animate-pulse"
                  style={{
                    backgroundColor: "rgba(239, 68, 68, 0.1)",
                    color: "var(--accent-danger)",
                    border: "1px solid rgba(239, 68, 68, 0.3)",
                  }}
                >
                  SCAN & PURGE SYSTEMS
                </motion.button>
              </motion.div>
            </motion.div>

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
