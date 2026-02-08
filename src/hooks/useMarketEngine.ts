import { useState, useEffect, useRef, useCallback } from "react";
import { PerlinNoise } from "@/lib/perlin";

const SYMBOLS = ["BTC", "ETH", "SOL", "DOGE"] as const;
export type Symbol = (typeof SYMBOLS)[number];

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
  type: "BUY" | "SELL";
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
const TICK_RATE_MS = 2000; // Update every 2 seconds (faster gameplay)

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
          // Market Math Tuning (More Volatility + Spikes)
          const asset = newAssets[sym];

          // 1. Base Trend (Momentum) - Perlin Noise
          // Speed 0.1 means sentiment shifts gradually
          const trendNoise = noiseGen.current.noise1D(
            time * 0.1 + asset.noiseOffset,
            2,
            0.5
          );

          // 2. Jitter (High frequency chaos) - White Noise
          // +/- 1.5% random fluctuation every tick
          const jitter = (Math.random() - 0.5) * 0.03;

          // 3. Spikes (Sudden market shocks) - 5% chance
          let spike = 0;
          if (Math.random() < 0.05) {
            // +/- 5% to 15% shock
            spike = (Math.random() < 0.5 ? -1 : 1) * (0.05 + Math.random() * 0.10);
            console.log(`⚡ Market Spike on ${sym}: ${(spike * 100).toFixed(1)}%`);
          }

          // Combined Return
          // Moderate the trend influence (trendNoise is -1 to 1) so it doesn't spiral
          const change = (trendNoise * 0.02) + jitter + spike;

          // Apply change
          let newPrice = asset.price * (1 + change);

          // Soft floor/ceiling to keep numbers readable (optional, but good for game balance)
          // Floor at $1, no hard ceiling but drag if it gets too high? Maybe later.
          if (newPrice < 1) newPrice = 1;

          asset.price = newPrice;
          asset.history = [...asset.history, { time, price: newPrice }].slice(
            -HISTORY_LENGTH,
          ); // Keep last N points
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

  const buyAsset = useCallback((symbol: Symbol, amount: number, priceMultiplier: number = 1.0) => {
    setGameState((prev) => {
      const asset = prev.assets[symbol];
      const cost = asset.price * amount * priceMultiplier; // Apply multiplier

      if (prev.balance < cost) return prev; // Not enough funds

      const transaction: Transaction = {
        id: `${Date.now()}-${Math.random()}`,
        type: "BUY",
        symbol,
        amount,
        price: asset.price * priceMultiplier, // Record actual price paid
        timestamp: prev.gameTime,
        total: cost,
      };

      return {
        ...prev,
        balance: prev.balance - cost,
        transactions: [transaction, ...prev.transactions].slice(0, 50), // Keep last 50
        assets: {
          ...prev.assets,
          [symbol]: {
            ...asset,
            holdings: asset.holdings + amount,
            avgBuyPrice:
              (asset.avgBuyPrice * asset.holdings + cost) /
              (asset.holdings + amount),
          },
        },
      };
    });
  }, []);

  const sellAsset = useCallback((symbol: Symbol, amount: number, priceMultiplier: number = 1.0) => {
    setGameState((prev) => {
      const asset = prev.assets[symbol];
      if (asset.holdings < amount) return prev; // Not enough holdings

      const revenue = asset.price * amount * priceMultiplier;

      const transaction: Transaction = {
        id: `${Date.now()}-${Math.random()}`,
        type: "SELL",
        symbol,
        amount,
        price: asset.price * priceMultiplier, // Record actual revenue
        timestamp: prev.gameTime,
        total: revenue,
      };

      return {
        ...prev,
        balance: prev.balance + revenue,
        transactions: [transaction, ...prev.transactions].slice(0, 50), // Keep last 50
        assets: {
          ...prev.assets,
          [symbol]: {
            ...asset,
            holdings: asset.holdings - amount,
            // avgBuyPrice stays same on sell
          },
        },
      };
    });
  }, []);

  // Function to stop the game timer
  const setGameOver = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      isGameOver: true,
    }));
  }, []);

  return { gameState, buyAsset, sellAsset, setGameOver };
}
