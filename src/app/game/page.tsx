"use client";

import React from "react";
import { useMarketEngine, Symbol } from "@/hooks/useMarketEngine";
import { GlobalStats } from "@/components/game/GlobalStats";
import { CryptoCard } from "@/components/game/CryptoCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { TamboProvider } from "@tambo-ai/react";
import { components, tools } from "@/lib/tambo";
import { useGameMaster } from "@/hooks/useGameMaster";
import { TransactionLog } from "@/components/game/TransactionLog";
import { getCryptoColor } from "@/lib/cryptoColors";

// Inner component to usage the hooks (must be inside Provider)
function GameContent() {
    const { gameState, buyAsset, sellAsset } = useMarketEngine();
    const { balance, startBalance, gameTime, assets, transactions } = gameState;
    const { activeAnomalies, triggerAnomaly, clearAnomaly } = useGameMaster();

    // Track active tab
    const [activeTab, setActiveTab] = React.useState<Symbol>("BTC");

    // Derive active anomalies count
    const CRYPTO_LIST: Symbol[] = ["BTC", "ETH", "SOL", "DOGE"];
    const activeAnomaliesCount = Object.values(activeAnomalies).filter(Boolean).length;

    const handleReport = () => {
        // Only clear anomaly on the currently active tab
        clearAnomaly(activeTab);
    };

    // ===== MANUAL TESTING: Inject Bounce on Mount =====
    React.useEffect(() => {
        // Manually inject Bounce button on BTC for testing
        setActiveTab("BTC");
        // Simulate what triggerAnomaly would do
        // This is a hack for testing - normally triggerAnomaly handles this via Tambo
    }, []);

    // ===== ANOMALY INJECTION DISABLED FOR MANUAL TESTING =====
    // Uncomment this block when ready to test auto-injection
    /*
    React.useEffect(() => {
      const progress = (balance - startBalance) / (startBalance * 0.5); // 50% = goal
      if (progress > 0.1 && activeAnomaliesCount < 2) {
        // Trigger anomaly on a random asset
        const randomSymbol = CRYPTO_LIST[Math.floor(Math.random() * CRYPTO_LIST.length)];
        if (!activeAnomalies[randomSymbol]) {
          if (Math.random() > 0.7) {
            triggerAnomaly(randomSymbol);
          }
        }
      }
    }, [gameTime, activeAnomaliesCount, activeAnomalies, triggerAnomaly, balance]);
    */

    return (
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
                                <Tabs defaultValue="BTC" className="w-full" onValueChange={(value) => setActiveTab(value as Symbol)}>
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
                                                    {symbol} {activeAnomalies[symbol] && <span className="ml-2 text-red-500">!</span>}
                                                </TabsTrigger>
                                            );
                                        })}
                                    </TabsList>

                                    {CRYPTO_LIST.map((symbol) => {
                                        const asset = assets[symbol];
                                        return (
                                            <TabsContent key={symbol} value={symbol} className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
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
