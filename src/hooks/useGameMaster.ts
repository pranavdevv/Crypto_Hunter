import { useTamboThread, useTamboThreadInput } from "@tambo-ai/react";
import React, { useEffect, useState, useCallback } from "react";
import { Symbol } from "./useMarketEngine";

export function useGameMaster() {
    const { thread } = useTamboThread();
    const { setValue, submit, isPending } = useTamboThreadInput();
    const [activeAnomalies, setActiveAnomalies] = useState<Record<string, React.ReactNode>>({});

    // Scan messages for generated components
    useEffect(() => {
        if (!thread?.messages || thread.messages.length === 0) return;

        const messages = thread.messages;
        const lastMsg = messages[messages.length - 1];

        // Check if the last message has a component
        if (lastMsg.role === 'assistant' && lastMsg.renderedComponent) {
            const lastUserMsg = messages[messages.length - 2];

            const getContent = (content: any): string => {
                if (typeof content === 'string') return content;
                if (Array.isArray(content)) {
                    return content.map(c => c.text || '').join(' ');
                }
                return '';
            };

            if (lastUserMsg) {
                const text = getContent(lastUserMsg.content);
                if (text.includes("BTC")) {
                    setActiveAnomalies(prev => ({ ...prev, BTC: lastMsg.renderedComponent }));
                } else if (text.includes("ETH")) {
                    setActiveAnomalies(prev => ({ ...prev, ETH: lastMsg.renderedComponent }));
                } else if (text.includes("SOL")) {
                    setActiveAnomalies(prev => ({ ...prev, SOL: lastMsg.renderedComponent }));
                } else if (text.includes("DOGE")) {
                    setActiveAnomalies(prev => ({ ...prev, DOGE: lastMsg.renderedComponent }));
                }
            }
        }
    }, [thread?.messages]);

    // Calculate Progress (0.0 to 1.0) based on Balance relative to Goal ($50k)
    // Assuming start $10k, Goal $50k.
    const calculateAnomalyChance = (currentBalance: number) => {
        const start = 10000;
        const goal = 50000;
        const progress = Math.max(0, (currentBalance - start) / (goal - start)); // 0.0 to 1.0 (or higher)

        // Chance scales from 5% to 80% as you get richer
        const chance = 0.05 + (progress * 0.75);
        return Math.min(0.9, chance);
    };

    const triggerAnomaly = useCallback(async (symbol: Symbol, currentBalance: number) => {
        // Prevent spam if already submitting
        if (isPending) return;

        // Determine severity based on progress
        const riskLevel = calculateAnomalyChance(currentBalance);

        // Choose Glitch Type based on risk
        let glitchType = "GlitchBuyButton_Typo"; // Default mild

        if (riskLevel > 0.5) {
            // High risk: Nasty glitches
            const SEVERE_GLITCHES = ["GlitchBuyButton_Red", "GlitchBuyButton_Jitter", "GlitchBuyButton_Reverse"];
            glitchType = SEVERE_GLITCHES[Math.floor(Math.random() * SEVERE_GLITCHES.length)];
        } else {
            // Low risk: Mild glitches
            const MILD_GLITCHES = ["GlitchBuyButton_Typo", "GlitchBuyButton_Red"];
            glitchType = MILD_GLITCHES[Math.floor(Math.random() * MILD_GLITCHES.length)];
        }

        // We "type" into the input and submit it programmatically
        const command = `System Alert: Corruption detected in ${symbol} module. Generate a ${glitchType} component for symbol "${symbol}".`;

        setValue(command);

        setTimeout(() => {
            submit({ resourceNames: {} }).catch(e => console.error(e));
        }, 100);

    }, [setValue, submit, isPending, calculateAnomalyChance]);

    const clearAnomaly = useCallback((symbol: Symbol) => {
        setActiveAnomalies(prev => {
            const next = { ...prev };
            delete next[symbol];
            return next;
        });
        // Optional: send "System Restored"
    }, []);

    return { activeAnomalies, triggerAnomaly, clearAnomaly };
}
