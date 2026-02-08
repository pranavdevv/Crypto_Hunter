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
    <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm">
      <div ref={cardRef}>
        <Card
          className={`w-full max-w-lg bg-slate-950 border-slate-800 text-slate-100 ${msg.bgGlow}`}
        >
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <div className={`p-4 rounded-full bg-slate-900 ${msg.color}`}>
                <Icon className="w-16 h-16 animate-pulse" />
              </div>
            </div>
            <CardTitle
              className={`text-4xl font-black tracking-widest ${msg.color} font-mono`}
            >
              {msg.title}
            </CardTitle>
            <p className="text-slate-400 mt-2">{msg.subtitle}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-slate-900 rounded-lg border border-slate-800">
              <div className="text-center">
                <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                  Game Time
                </div>
                <div className="text-xl font-mono font-bold text-white">
                  {gameTime}s
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                  Final Balance
                </div>
                <div className="text-xl font-mono font-bold text-white">
                  $
                  {finalBalance.toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                  })}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                  P&L
                </div>
                <div
                  className={`text-xl font-mono font-bold ${pnl >= 0 ? "text-green-500" : "text-red-500"}`}
                >
                  {pnl >= 0 ? "+" : ""}
                  {pnl.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
              </div>
            </div>

            {/* Restart Button */}
            <Button
              onClick={onRestart}
              className={`w-full py-6 text-lg font-bold uppercase tracking-widest ${
                isWin
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              <RefreshCwIcon className="w-5 h-5 mr-2" />
              {isWin ? "PLAY AGAIN" : "TRY AGAIN"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
