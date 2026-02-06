import { useState, useEffect, useRef, useCallback } from "react";
import { PerlinNoise } from "@/lib/perlin";

const SYMBOLS = ["BTC", "ETH", "SOL", "DOGE"] as const;
export type Symbol = typeof SYMBOLS[number];

type AssetData = {
    symbol: Symbol;
    price: number;
    history: { time: number; price: number }[];
    noiseOffset: number;
    holdings: number;
    avgBuyPrice: number;
};

export type Transaction = {
    id: string;
    type: 'BUY' | 'SELL';
    symbol: Symbol;
    amount: number;
    price: number;
    timestamp: number;
    total: number;
};

type GameState = {
    balance: number;
    startBalance: number;
    assets: Record<Symbol, AssetData>;
    gameTime: number;
    isGameOver: boolean;
    transactions: Transaction[];
};

const INITIAL_BALANCE = 10000;
const HISTORY_LENGTH = 50;
const TICK_RATE_MS = 4000; // Update every 4 seconds

export function useMarketEngine() {
    const [gameState, setGameState] = useState<GameState>(() => {
        const assets: Record<string, AssetData> = {};
        SYMBOLS.forEach((sym, index) => {
            assets[sym] = {
                symbol: sym,
                price: 1000 * (index + 1), // Base price variation
                history: [],
                noiseOffset: Math.random() * 1000,
                holdings: 0,
                avgBuyPrice: 0,
            };
        });

        return {
            balance: INITIAL_BALANCE,
            startBalance: INITIAL_BALANCE,
            assets: assets as Record<Symbol, AssetData>,
            gameTime: 0,
            isGameOver: false,
            transactions: [],
        };
    });

    const noiseGen = useRef(new PerlinNoise());

    useEffect(() => {
        const interval = setInterval(() => {
            setGameState((prev) => {
                if (prev.isGameOver) return prev;

                const time = prev.gameTime + 1;
                const newAssets = { ...prev.assets };

                SYMBOLS.forEach((sym) => {
                    const asset = newAssets[sym];
                    // Use Perlin noise for smooth price movement
                    // x = (time * speed) + offset
                    // We use a slow speed (0.05) for low frequency trends
                    // Octaves: 4 for roughness, Persistence 0.5 for jagged detail
                    const noiseVal = noiseGen.current.noise1D((time * 0.05) + asset.noiseOffset, 4, 0.5);

                    // Map noise (-1 to 1) to price multiplier
                    // Volatility: 15% swings
                    const volatility = 0.15;
                    const trend = 1 + (noiseVal * volatility);

                    // Base price + organic drift
                    let newPrice = asset.price * trend;

                    // Ensure price never hits 0 or negative
                    if (newPrice < 1) newPrice = 1;

                    asset.price = newPrice;
                    asset.history = [
                        ...asset.history,
                        { time, price: newPrice },
                    ].slice(-HISTORY_LENGTH); // Keep last N points
                });

                return {
                    ...prev,
                    assets: newAssets,
                    gameTime: time,
                };
            });
        }, TICK_RATE_MS);

        return () => clearInterval(interval);
    }, []);

    const buyAsset = useCallback((symbol: Symbol, amount: number) => {
        setGameState((prev) => {
            const asset = prev.assets[symbol];
            const cost = asset.price * amount;

            if (prev.balance < cost) return prev; // Not enough funds

            const transaction: Transaction = {
                id: `${Date.now()}-${Math.random()}`,
                type: 'BUY',
                symbol,
                amount,
                price: asset.price,
                timestamp: prev.gameTime,
                total: cost,
            };

            return {
                ...prev,
                balance: prev.balance - cost,
                transactions: [...prev.transactions, transaction],
                assets: {
                    ...prev.assets,
                    [symbol]: {
                        ...asset,
                        holdings: asset.holdings + amount,
                        avgBuyPrice: ((asset.avgBuyPrice * asset.holdings) + cost) / (asset.holdings + amount)
                    }
                }
            };
        });
    }, []);

    const sellAsset = useCallback((symbol: Symbol, amount: number) => {
        setGameState((prev) => {
            const asset = prev.assets[symbol];
            if (asset.holdings < amount) return prev; // Not enough holdings

            const revenue = asset.price * amount;

            const transaction: Transaction = {
                id: `${Date.now()}-${Math.random()}`,
                type: 'SELL',
                symbol,
                amount,
                price: asset.price,
                timestamp: prev.gameTime,
                total: revenue,
            };

            return {
                ...prev,
                balance: prev.balance + revenue,
                transactions: [...prev.transactions, transaction],
                assets: {
                    ...prev.assets,
                    [symbol]: {
                        ...asset,
                        holdings: asset.holdings - amount,
                        // avgBuyPrice stays same on sell (FIFO/LIFO logic simplified)
                    }
                }
            };
        });
    }, []);

    return { gameState, buyAsset, sellAsset };
}
