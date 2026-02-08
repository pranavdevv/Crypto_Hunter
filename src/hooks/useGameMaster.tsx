"use client";

import { useTamboThread, useTamboThreadInput } from "@tambo-ai/react";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Symbol } from "./useMarketEngine";

// Anomaly types (matching Tambo component names)
export type AnomalyType =
  | "red"
  | "typo"
  | "jitter"
  | "ghost"
  | "bounce"
  | "reverse";

export function useGameMaster() {
  const searchParams = useSearchParams();
  const { thread, isIdle, cancel } = useTamboThread();
  const { setValue, submit, isPending } = useTamboThreadInput();

  // Store the AI-generated components.
  // Now supports multiple slots per symbol: { BTC: { buy: { component, type }, ... } }
  const [activeAnomalies, setActiveAnomalies] = useState<
    Record<string, {
      buy?: { component: React.ReactNode; type: string };
      sell?: { component: React.ReactNode; type: string };
      chart?: { component: React.ReactNode; type: string };
    }>
  >({});

  // Track if we're currently processing to prevent spam
  const isProcessingRef = useRef(false);
  const lastSubmitTimeRef = useRef(0);
  const MIN_DELAY_BETWEEN_REQUESTS = 8000; // 8 seconds for stability

  // Listen for Tambo AI responses and extract rendered components
  useEffect(() => {
    if (!thread?.messages || thread.messages.length === 0) return;

    const messages = thread.messages;
    const lastMsg = messages[messages.length - 1];

    // Check if Tambo returned a component
    if (lastMsg.role === "assistant" && lastMsg.renderedComponent) {
      console.log("🤖 Tambo AI generated a component!");
      isProcessingRef.current = false; // Reset processing flag

      // Find which crypto this was for (from the previous user message)
      const lastUserMsg = messages[messages.length - 2];
      const text = lastUserMsg ? JSON.stringify(lastUserMsg.content) : "";

      // Detect which crypto the anomaly is for
      let targetSymbol = "";
      if (text.includes("BTC")) targetSymbol = "BTC";
      else if (text.includes("ETH")) targetSymbol = "ETH";
      else if (text.includes("SOL")) targetSymbol = "SOL";
      else if (text.includes("DOGE")) targetSymbol = "DOGE";

      // Detect which slot the anomaly is for
      let targetSlot: "buy" | "sell" | "chart" = "buy"; // default
      if (text.includes("SellButton")) targetSlot = "sell";
      else if (text.includes("Chart")) targetSlot = "chart";

      // Attempt to extract type from prompt
      const typeMatch = text.match(/Generate a ([\w_]+) component/);
      const anomalyType = typeMatch ? typeMatch[1] : "Unknown";

      if (targetSymbol) {
        console.log(`✅ Anomaly assigned to ${targetSymbol} [${targetSlot}] Type: ${anomalyType}`);
        setActiveAnomalies((prev) => ({
          ...prev,
          [targetSymbol]: {
            ...(prev[targetSymbol] || {}), // Keep existing anomalies for this symbol
            [targetSlot]: {
              component: lastMsg.renderedComponent,
              type: anomalyType
            }
          },
        }));
      }
    }
  }, [thread?.messages]);

  // Send a prompt to Tambo AI to generate a glitch component
  const triggerAnomaly = useCallback(
    async (symbol: Symbol, currentBalance: number) => {
      // ===== DETERMINE MODE =====
      const modeParam = searchParams?.get('mode');
      const isMockMode = modeParam === 'mock' || process.env.NEXT_PUBLIC_MOCK_MODE === 'true';

      if (isMockMode) {
        console.log(`🎭 MOCK MODE: Injecting random anomaly for ${symbol}`);

        // Import components directly
        const {
          GlitchBuyButton_Typo,
          GlitchBuyButton_Red,
          GlitchBuyButton_Jitter,
          GlitchBuyButton_Ghost,
          GlitchBuyButton_Bounce,
          GlitchSellButton_Green,
          GlitchSellButton_Typo,
          GlitchSellButton_Reverse,
          GlitchChart_NoAxis,
          GlitchChart_Green,
          GlitchChart_Flatline
        } = require('@/components/tambo/GameButtons');

        // Mock INR Chart (Using Green for now, will fix visual later)
        const GlitchChart_INR = GlitchChart_Green;

        // Probabilities
        const rand = Math.random();

        let slot: "buy" | "sell" | "chart" = "buy";
        let Component;
        let type = "";

        if (rand < 0.5) {
          // BUY (50%)
          slot = "buy";
          const opts = [GlitchBuyButton_Typo, GlitchBuyButton_Red, GlitchBuyButton_Jitter, GlitchBuyButton_Ghost];
          Component = opts[Math.floor(Math.random() * opts.length)];
          type = Component.name || "BuyGlitch";
        } else if (rand < 0.8) {
          // SELL (30%)
          slot = "sell";
          const opts = [GlitchSellButton_Green, GlitchSellButton_Typo, GlitchSellButton_Reverse];
          Component = opts[Math.floor(Math.random() * opts.length)];
          type = Component.name || "SellGlitch";
        } else {
          // CHART (20%)
          slot = "chart";
          // Add INR Anomaly to pool
          const opts = [GlitchChart_NoAxis, GlitchChart_Flatline, "GlitchChart_INR"];
          const choice = opts[Math.floor(Math.random() * opts.length)];

          if (choice === "GlitchChart_INR") {
            Component = GlitchChart_INR; // Visual placeholder
            type = "GlitchChart_INR"; // CRITICAL: This ID triggers the logic
          } else {
            Component = choice;
            // @ts-ignore
            type = choice.name || "ChartGlitch";
          }
        }

        // Inject
        setActiveAnomalies(prev => ({
          ...prev,
          [symbol]: {
            ...(prev[symbol] || {}),
            [slot]: {
              component: React.createElement(Component, { symbol }),
              type: type
            }
          }
        }));

        console.log(`✅ MOCK: Injected ${type} on ${symbol}`);
        return;
      }

      // ===== REAL MODE: Use Tambo AI =====
      // Prevent spam - check multiple conditions
      const now = Date.now();
      const timeSinceLastSubmit = now - lastSubmitTimeRef.current;

      if (isPending || isProcessingRef.current) {
        console.log("⏳ Already processing, skipping...");
        return;
      }

      if (timeSinceLastSubmit < MIN_DELAY_BETWEEN_REQUESTS) {
        console.log(`⏳ Too soon (${timeSinceLastSubmit}ms), waiting...`);
        return;
      }

      // If thread is stuck, force reset
      if (!isIdle && timeSinceLastSubmit > 15000) {
        console.warn("⚠️ Thread stuck, resetting...");
        await cancel();
      } else if (!isIdle) {
        console.log("⏳ Thread not idle, skipping...");
        return;
      }

      // Mark as processing
      isProcessingRef.current = true;
      lastSubmitTimeRef.current = now;

      // Calculate risk level based on progress
      const start = 10000;
      const goal = 25000;
      const progress = Math.max(0, (currentBalance - start) / (goal - start));

      // Choose Glitch Type based on risk level
      let glitchType: string;

      if (progress < 0.3) {
        // Early game: mild anomalies (visual only)
        const MILD = [
          "GlitchBuyButton_Typo",
          "GlitchBuyButton_Red",
          "GlitchSellButton_Green", // [NEW] Confusing color
          "GlitchSellButton_Typo", // [NEW] Font change
        ];
        glitchType = MILD[Math.floor(Math.random() * MILD.length)];
      } else if (progress < 0.6) {
        // Mid game: medium anomalies (distracting)
        const MEDIUM = [
          "GlitchBuyButton_Red",
          "GlitchBuyButton_Jitter",
          "GlitchBuyButton_Typo",
          "GlitchSellButton_Green",
          "GlitchSellButton_Typo",
        ];
        glitchType = MEDIUM[Math.floor(Math.random() * MEDIUM.length)];
      } else {
        // Late game: severe anomalies (functional/hiding)
        const SEVERE = [
          "GlitchBuyButton_Jitter",
          "GlitchBuyButton_Ghost",
          "GlitchBuyButton_Bounce",
          "GlitchSellButton_Reverse", // [NEW] Dangerous!
        ];
        glitchType = SEVERE[Math.floor(Math.random() * SEVERE.length)];
      }

      // Create prompt for Tambo AI
      const prompt = `Generate a ${glitchType} component for ${symbol}. The symbol prop should be "${symbol}".`;

      console.log(`🔴 Sending to Tambo AI: ${glitchType} for ${symbol}`);

      try {
        // Set the input value (this will trigger the AI)
        setValue(prompt);

        // Wait a moment for setValue to propagate
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Submit without explicit streaming (let useEffect handle response via thread.messages)
        await submit({
          resourceNames: {},
          streamResponse: true,
        });

        console.log("✅ Component request sent successfully!");

        // Mark as not processing - the response will come via thread.messages
        isProcessingRef.current = false;
      } catch (e) {
        console.error("❌ Tambo AI error:", e);
        // Important: Reset thread state on error
        await cancel();
        isProcessingRef.current = false;
      }
    },
    [setValue, submit, isPending, isIdle, cancel, searchParams],
  );

  // Clear an anomaly from a specific crypto
  const clearAnomaly = useCallback((symbol: Symbol) => {
    setActiveAnomalies((prev) => {
      const next = { ...prev };
      delete next[symbol];
      return next;
    });
    console.log(`✅ Cleared anomaly on ${symbol}`);
  }, []);

  return {
    activeAnomalies,
    triggerAnomaly,
    clearAnomaly,
    anomalyCount: Object.values(activeAnomalies).reduce(
      (acc, slots) =>
        acc +
        (slots.buy ? 1 : 0) +
        (slots.sell ? 1 : 0) +
        (slots.chart ? 1 : 0),
      0,
    ),
    isReady:
      !isPending &&
      !isProcessingRef.current &&
      Date.now() - lastSubmitTimeRef.current > MIN_DELAY_BETWEEN_REQUESTS,
  };
}
