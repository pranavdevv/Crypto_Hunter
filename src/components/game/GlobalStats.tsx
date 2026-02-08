import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  WalletIcon,
  TrendingUpIcon,
  AlertTriangleIcon,
  ShieldIcon,
  ShieldAlertIcon,
  ShieldXIcon,
} from "lucide-react";

interface GlobalStatsProps {
  balance: number;
  startBalance: number;
  gameTime: number;
  activeAnomaliesCount: number;
}

const MAX_ANOMALIES = 4; // 4 cryptos = max 4 anomalies

export function GlobalStats({
  balance,
  startBalance,
  gameTime,
  activeAnomaliesCount,
}: GlobalStatsProps) {
  const pnl = balance - startBalance;
  const isProfit = pnl >= 0;

  // Calculate system integrity (inverse of anomaly count)
  const integrityPercent = Math.max(
    0,
    ((MAX_ANOMALIES - activeAnomaliesCount) / MAX_ANOMALIES) * 100,
  );

  // Determine status level (max 4 anomalies)
  const getStatusLevel = () => {
    if (activeAnomaliesCount === 0)
      return {
        label: "STABLE",
        color: "text-green-500",
        bgColor: "bg-green-500",
        icon: ShieldIcon,
      };
    if (activeAnomaliesCount === 1)
      return {
        label: "WARNING",
        color: "text-yellow-500",
        bgColor: "bg-yellow-500",
        icon: ShieldAlertIcon,
      };
    if (activeAnomaliesCount === 2)
      return {
        label: "CRITICAL",
        color: "text-orange-500",
        bgColor: "bg-orange-500",
        icon: ShieldAlertIcon,
      };
    if (activeAnomaliesCount === 3)
      return {
        label: "DANGER",
        color: "text-red-500",
        bgColor: "bg-red-500",
        icon: ShieldXIcon,
      };
    // 4 = FAILURE (game over)
    return {
      label: "FAILURE",
      color: "text-red-600",
      bgColor: "bg-red-600",
      icon: ShieldXIcon,
    };
  };

  const status = getStatusLevel();
  const StatusIcon = status.icon;

  return (
    <Card className="mb-4 bg-slate-950 border-slate-800 text-slate-100 sticky top-0 z-50 shadow-xl shadow-slate-900/50">
      <CardContent className="flex items-center justify-between py-4">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">
              Balance
            </span>
            <div className="flex items-center text-2xl font-mono font-bold text-white">
              <WalletIcon className="w-5 h-5 mr-2 text-blue-500" />$
              {balance.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
          </div>

          <div className="h-10 w-px bg-slate-800" />

          <div className="flex flex-col">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">
              P & L
            </span>
            <div
              className={`flex items-center text-2xl font-mono font-bold ${isProfit ? "text-green-500" : "text-red-500"}`}
            >
              <TrendingUpIcon
                className={`w-5 h-5 mr-2 ${isProfit ? "" : "rotate-180"}`}
              />
              {isProfit ? "+" : ""}
              {pnl.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* System Status - HIDDEN details for harder gameplay */}
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-2">
              <StatusIcon
                className={`w-5 h-5 ${status.color} ${activeAnomaliesCount >= 3 ? "animate-pulse" : ""}`}
              />
              <span
                className={`text-sm font-bold uppercase tracking-wider ${status.color}`}
              >
                SYSTEM: {status.label}
              </span>
            </div>
            {/* Only show warning text when things are bad - no exact numbers! */}
            {activeAnomaliesCount >= 2 && (
              <span className="text-xs text-red-400 animate-pulse mt-1">
                ⚠️{" "}
                {activeAnomaliesCount >= 3
                  ? "SYSTEM CRITICAL!"
                  : "Anomalies detected!"}
              </span>
            )}
          </div>

          <div className="h-10 w-px bg-slate-800" />

          <div className="text-xs text-slate-500 font-mono">
            TICK: {gameTime}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
