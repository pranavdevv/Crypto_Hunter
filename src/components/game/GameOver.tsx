"use client";

import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  SkullIcon,
  RefreshCwIcon,
  AlertTriangleIcon,
  TrophyIcon,
} from "lucide-react";
import party from "party-js";
import { motion } from "framer-motion";

interface GameOverProps {
  reason: "anomalies" | "bankrupt" | "win";
  finalBalance: number;
  startBalance: number;
  gameTime: number;
  onRestart: () => void;
}

export function GameOver({
  reason,
  finalBalance,
  startBalance,
  gameTime,
  onRestart,
}: GameOverProps) {
  const pnl = finalBalance - startBalance;
  const isWin = reason === "win";
  const cardRef = useRef<HTMLDivElement>(null);

  // Trigger confetti on win!
  useEffect(() => {
    if (isWin && cardRef.current) {
      // Burst confetti from the card
      party.confetti(cardRef.current, {
        count: party.variation.range(80, 120),
        spread: party.variation.range(30, 50),
      });

      // Additional confetti bursts for extra celebration
      setTimeout(() => {
        if (cardRef.current) {
          party.confetti(cardRef.current, {
            count: party.variation.range(40, 60),
          });
        }
      }, 500);

      setTimeout(() => {
        if (cardRef.current) {
          party.sparkles(cardRef.current, {
            count: party.variation.range(20, 40),
          });
        }
      }, 1000);
    }
  }, [isWin]);

  const getMessage = () => {
    switch (reason) {
      case "anomalies":
        return {
          title: "SYSTEM FAILURE",
          subtitle:
            "Too many unresolved anomalies corrupted the trading system.",
          icon: AlertTriangleIcon,
          color: "text-red-500",
          bgGlow: "shadow-[0_0_100px_rgba(239,68,68,0.5)]",
        };
      case "bankrupt":
        return {
          title: "BANKRUPTCY",
          subtitle: "Your balance hit zero. Better luck next time.",
          icon: SkullIcon,
          color: "text-red-500",
          bgGlow: "shadow-[0_0_100px_rgba(239,68,68,0.5)]",
        };
      case "win":
        return {
          title: "MISSION COMPLETE",
          subtitle: "You reached the $25,000 goal! The system is stable.",
          icon: TrophyIcon,
          color: "text-green-500",
          bgGlow: "shadow-[0_0_100px_rgba(34,197,94,0.5)]",
        };
    }
  };

  const msg = getMessage();
  const Icon = msg.icon;

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div ref={cardRef}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
          className="w-full max-w-lg"
        >
          <Card
            className={`border transition-all duration-300`}
            style={{
              backgroundColor: "var(--card-bg)",
              borderColor: "var(--border-color)",
              boxShadow: `var(--shadow-xl), ${msg.bgGlow}`,
            }}
          >
            <CardHeader className="text-center pb-4 px-4 sm:px-6 pt-6">
              <motion.div
                className="flex justify-center mb-4"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <motion.div
                  className="p-3 sm:p-4 rounded-full"
                  style={{
                    backgroundColor: "rgba(0,0,0,0.2)",
                  }}
                  animate={{ rotate: isWin ? [0, 360] : 0 }}
                  transition={{ duration: isWin ? 2 : 0 }}
                >
                  <Icon
                    className="w-12 h-12 sm:w-16 sm:h-16"
                    style={{
                      color:
                        msg.color === "text-green-500"
                          ? "var(--accent-primary)"
                          : "var(--accent-danger)",
                    }}
                  />
                </motion.div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <CardTitle
                  className="text-3xl sm:text-4xl font-black tracking-widest font-mono"
                  style={{
                    color:
                      msg.color === "text-green-500"
                        ? "var(--accent-primary)"
                        : "var(--accent-danger)",
                  }}
                >
                  {msg.title}
                </CardTitle>
                <p
                  className="text-sm sm:text-base mt-2"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {msg.subtitle}
                </p>
              </motion.div>
            </CardHeader>
            <CardContent className="space-y-6 px-4 sm:px-6 pb-6">
              {/* Stats Grid */}
              <motion.div
                className="grid grid-cols-3 gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg border"
                style={{
                  backgroundColor: "rgba(0,0,0,0.1)",
                  borderColor: "var(--border-color)",
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="text-center">
                  <div
                    className="text-xs uppercase tracking-wider mb-1"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Game Time
                  </div>
                  <div
                    className="text-lg sm:text-xl font-mono font-bold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {gameTime}s
                  </div>
                </div>
                <div className="text-center">
                  <div
                    className="text-xs uppercase tracking-wider mb-1"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Final Balance
                  </div>
                  <motion.div
                    className="text-lg sm:text-xl font-mono font-bold"
                    style={{ color: "var(--text-primary)" }}
                    key={finalBalance}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    $
                    {finalBalance.toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })}
                  </motion.div>
                </div>
                <div className="text-center">
                  <div
                    className="text-xs uppercase tracking-wider mb-1"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    P&L
                  </div>
                  <motion.div
                    className="text-lg sm:text-xl font-mono font-bold"
                    style={{
                      color: pnl >= 0 ? "var(--accent-primary)" : "var(--accent-danger)",
                    }}
                    key={pnl}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {pnl >= 0 ? "+" : ""}
                    {pnl.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </motion.div>
                </div>
              </motion.div>

              {/* Restart Button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={onRestart}
                  className={`w-full py-4 sm:py-6 text-base sm:text-lg font-bold uppercase tracking-widest transition-all ${
                    isWin
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  <RefreshCwIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  {isWin ? "PLAY AGAIN" : "TRY AGAIN"}
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
