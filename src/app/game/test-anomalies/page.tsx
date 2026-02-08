"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    GlitchBuyButton_Red,
    GlitchBuyButton_Typo,
    GlitchBuyButton_Jitter,
    GlitchBuyButton_Reverse,
    GlitchBuyButton_Ghost,
    GlitchBuyButton_Bounce,
    GlitchSellButton_Green,
    GlitchSellButton_Typo,
    GlitchSellButton_Reverse,
} from "@/components/tambo/GameButtons";
import {
    GlitchChart_NoAxis,
    GlitchChart_NoGrid,
    GlitchChart_Neon,
    GlitchChart_Flatline
} from "@/components/tambo/GameCharts";

type AnomalyVariant =
    | "Red"
    | "Typo"
    | "Jitter"
    | "Reverse"
    | "Ghost"
    | "Bounce"
    | "SellGreen"
    | "SellTypo"
    | "SellReverse"
    | "ChartNoAxis"
    | "ChartNoGrid"
    | "ChartNeon"
    | "ChartFlatline"
    | null;

export default function TestAnomaliesPage() {
    const [activeAnomaly, setActiveAnomaly] = useState<AnomalyVariant>(null);
    const [renderKey, setRenderKey] = useState(0); // Add key to force re-render
    const testSymbol = "BTC";

    // Sample price data for charts
    const sampleData = Array.from({ length: 20 }, (_, i) => ({
        time: i * 2,
        price: 50000 + Math.sin(i / 2) * 5000
    }));

    // Handle button click to spawn/respawn
    const spawnAnomaly = (variant: AnomalyVariant) => {
        setActiveAnomaly(variant);
        setRenderKey(prev => prev + 1); // Force re-mount
    };

    const anomalyComponents = {
        Red: <GlitchBuyButton_Red symbol={testSymbol} />,
        Typo: <GlitchBuyButton_Typo symbol={testSymbol} />,
        Jitter: <GlitchBuyButton_Jitter symbol={testSymbol} />,
        Reverse: <GlitchBuyButton_Reverse symbol={testSymbol} />,
        Ghost: <GlitchBuyButton_Ghost symbol={testSymbol} />,
        Bounce: <GlitchBuyButton_Bounce symbol={testSymbol} />,
        SellGreen: <GlitchSellButton_Green symbol={testSymbol} />,
        SellTypo: <GlitchSellButton_Typo symbol={testSymbol} />,
        SellReverse: <GlitchSellButton_Reverse symbol={testSymbol} />,
        ChartNoAxis: <GlitchChart_NoAxis symbol={testSymbol} data={sampleData} />,
        ChartNoGrid: <GlitchChart_NoGrid symbol={testSymbol} data={sampleData} />,
        ChartNeon: <GlitchChart_Neon symbol={testSymbol} data={sampleData} />,
        ChartFlatline: <GlitchChart_Flatline symbol={testSymbol} data={sampleData} />,
    };

    return (
        <div className="min-h-screen bg-black text-slate-100 p-8">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header */}
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-bold text-red-500">Anomaly Test Lab</h1>
                    <p className="text-slate-400">Click to spawn and test each anomaly variant</p>
                </div>

                {/* Test Controls */}
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                        <CardTitle>🔬 Buy Button Anomalies</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-3 gap-4">
                        <Button
                            variant="outline"
                            onClick={() => spawnAnomaly("Red")}
                            className="h-20"
                        >
                            🔴 Red Warning
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => spawnAnomaly("Typo")}
                            className="h-20"
                        >
                            📝 Font Glitch
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => spawnAnomaly("Jitter")}
                            className="h-20"
                        >
                            🌀 Jitter/Shake
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => spawnAnomaly("Reverse")}
                            className="h-20"
                        >
                            🔄 Reverse (Sells)
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => spawnAnomaly("Ghost")}
                            className="h-20"
                        >
                            👻 Ghost (Fades)
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => spawnAnomaly("Bounce")}
                            className="h-20"
                        >
                            🎾 Bounce (Moves)
                        </Button>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                        <CardTitle>💰 Sell Button Anomalies</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-3 gap-4">
                        <Button
                            variant="outline"
                            onClick={() => spawnAnomaly("SellGreen")}
                            className="h-20"
                        >
                            💚 Green (Confusing)
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => spawnAnomaly("SellTypo")}
                            className="h-20"
                        >
                            📝 Font Glitch
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => spawnAnomaly("SellReverse")}
                            className="h-20"
                        >
                            🔄 Reverse (Buys)
                        </Button>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                        <CardTitle>📊 Chart Anomalies</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                        <Button
                            variant="outline"
                            onClick={() => spawnAnomaly("ChartNoAxis")}
                            className="h-20"
                        >
                            📉 No Axis Labels
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => spawnAnomaly("ChartNoGrid")}
                            className="h-20"
                        >
                            📊 No Grid Lines
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => spawnAnomaly("ChartNeon")}
                            className="h-20"
                        >
                            🌈 Neon/Psychedelic
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => spawnAnomaly("ChartFlatline")}
                            className="h-20"
                        >
                            💀 Flatline (Dead)
                        </Button>
                    </CardContent>
                </Card>

                {/* Preview Area */}
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            Preview Area
                            {activeAnomaly && (
                                <div className="space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setRenderKey(prev => prev + 1)}
                                    >
                                        🔄 Respawn
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => setActiveAnomaly(null)}
                                    >
                                        Clear
                                    </Button>
                                </div>
                            )}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="min-h-[200px] flex items-center justify-center">
                        {activeAnomaly ? (
                            <div key={renderKey} className="w-full max-w-md space-y-4 animate-in fade-in zoom-in duration-300">
                                <div className="text-center text-sm text-slate-400 mb-4">
                                    Active: <span className="text-red-500 font-bold">{activeAnomaly}</span>
                                </div>
                                {anomalyComponents[activeAnomaly]}
                            </div>
                        ) : (
                            <p className="text-slate-500 text-center">
                                Click a button above to preview an anomaly
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* Back Button */}
                <div className="text-center">
                    <Button
                        variant="outline"
                        onClick={() => (window.location.href = "/game")}
                    >
                        ← Back to Game
                    </Button>
                </div>
            </div>
        </div>
    );
}
