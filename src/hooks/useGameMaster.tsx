"use client";

import { useTamboThread, useTamboThreadInput } from "@tambo-ai/react";
import React, { useEffect, useState, useCallback, useRef } from "react";
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
  const { thread, isIdle, cancel } = useTamboThread();
  const { setValue, submit, isPending } = useTamboThreadInput();

  // Store the AI-generated components
  const [activeAnomalies, setActiveAnomalies] = useState<
    Record<string, React.ReactNode>
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

      const getContent = (content: any): string => {
        if (typeof content === "string") return content;
        if (Array.isArray(content)) {
          return content.map((c) => c.text || "").join(" ");
        }
        return "";
      };

      if (lastUserMsg) {
        const text = getContent(lastUserMsg.content);

        // Detect which crypto the anomaly is for
        if (text.includes("BTC")) {
          console.log("✅ Anomaly assigned to BTC");
          setActiveAnomalies((prev) => ({
            ...prev,
            BTC: lastMsg.renderedComponent,
          }));
        } else if (text.includes("ETH")) {
          console.log("✅ Anomaly assigned to ETH");
          setActiveAnomalies((prev) => ({
            ...prev,
            ETH: lastMsg.renderedComponent,
          }));
        } else if (text.includes("SOL")) {
          console.log("✅ Anomaly assigned to SOL");
          setActiveAnomalies((prev) => ({
            ...prev,
            SOL: lastMsg.renderedComponent,
          }));
        } else if (text.includes("DOGE")) {
          console.log("✅ Anomaly assigned to DOGE");
          setActiveAnomalies((prev) => ({
            ...prev,
            DOGE: lastMsg.renderedComponent,
          }));
        }
      }
    }
  }, [thread?.messages]);

  // Send a prompt to Tambo AI to generate a glitch component
  const triggerAnomaly = useCallback(
    async (symbol: Symbol, currentBalance: number) => {
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
        // Early game: mild anomalies
        const MILD = ["GlitchBuyButton_Typo", "GlitchBuyButton_Red"];
        glitchType = MILD[Math.floor(Math.random() * MILD.length)];
      } else if (progress < 0.6) {
        // Mid game: medium anomalies
        const MEDIUM = [
          "GlitchBuyButton_Red",
          "GlitchBuyButton_Jitter",
          "GlitchBuyButton_Typo",
        ];
        glitchType = MEDIUM[Math.floor(Math.random() * MEDIUM.length)];
      } else {
        // Late game: severe anomalies
        const SEVERE = [
          "GlitchBuyButton_Jitter",
          "GlitchBuyButton_Ghost",
          "GlitchBuyButton_Bounce",
        ];
        glitchType = SEVERE[Math.floor(Math.random() * SEVERE.length)];
      }

      // Create prompt for Tambo AI
      const prompt = `Generate a ${glitchType} component for ${symbol}. The symbol prop should be "${symbol}".`;

      console.log(`🔴 Sending to Tambo AI: ${glitchType} for ${symbol}`);

      try {
        // Set the input value
        setValue(prompt);

        // Wait a moment for setValue to propagate
        await new Promise((resolve) => setTimeout(resolve, 200));

        // Submit with streamResponse: true (matching how the chat component does it)
        await submit({
          streamResponse: false,
          resourceNames: {},
        });

        console.log("📤 Prompt sent to Tambo AI!");
      } catch (e) {
        console.error("❌ Tambo AI error:", e);
        // Important: Reset thread state on error
        await cancel();
        isProcessingRef.current = false;
      }
    },
    [setValue, submit, isPending, isIdle, cancel],
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
    anomalyCount: Object.keys(activeAnomalies).length,
  };
}
