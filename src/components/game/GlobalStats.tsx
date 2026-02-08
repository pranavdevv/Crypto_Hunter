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
import { motion } from "framer-motion";

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
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card
        className="mb-4 sticky top-0 z-50 border transition-colors duration-300"
        style={{
          backgroundColor: "var(--card-bg)",
          borderColor: "var(--border-color)",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 py-3 sm:py-4 px-4 sm:px-6 overflow-x-auto">
          <div className="flex items-center gap-3 sm:gap-8 w-full sm:w-auto">
            <motion.div
              className="flex flex-col"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <span
                className="text-xs uppercase tracking-wider font-bold"
                style={{ color: "var(--text-secondary)" }}
              >
                Balance
              </span>
              <motion.div
                className="flex items-center text-lg sm:text-2xl font-mono font-bold mt-1"
                style={{ color: "var(--accent-primary)" }}
              >
                <WalletIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
                <span className="truncate">$</span>
                <motion.span
                  key={balance}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="truncate"
                >
                  {balance.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </motion.span>
              </motion.div>
            </motion.div>

            <div
              className="h-10 w-px opacity-20"
              style={{ backgroundColor: "var(--border-color)" }}
            />

            <motion.div
              className="flex flex-col"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <span
                className="text-xs uppercase tracking-wider font-bold"
                style={{ color: "var(--text-secondary)" }}
              >
                P & L
              </span>
              <motion.div
                className={`flex items-center text-lg sm:text-2xl font-mono font-bold mt-1 ${
                  isProfit ? "text-green-500" : "text-red-500"
                }`}
                key={pnl}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <TrendingUpIcon
                  className={`w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0 ${
                    isProfit ? "" : "rotate-180"
                  }`}
                />
                <span className="truncate">
                  {isProfit ? "+" : ""}
                  {pnl.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </motion.div>
            </motion.div>
          </div>

          <div
            className="h-px sm:h-10 w-full sm:w-px opacity-20"
            style={{ backgroundColor: "var(--border-color)" }}
          />

          <div className="flex items-center gap-3 sm:gap-6 w-full sm:w-auto justify-between sm:justify-end">
            <motion.div
              className="flex flex-col items-start sm:items-end"
              animate={{ scale: activeAnomaliesCount >= 3 ? [1, 1.02, 1] : 1 }}
              transition={{ duration: 0.6, repeat: activeAnomaliesCount >= 3 ? Infinity : 0 }}
            >
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{
                    opacity: activeAnomaliesCount >= 3 ? [1, 0.6, 1] : 1,
                  }}
                  transition={{
                    duration: 1,
                    repeat: activeAnomaliesCount >= 3 ? Infinity : 0,
                  }}
                >
                  <StatusIcon className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0`}
                    style={{ color: status.color === "text-green-500" ? "var(--accent-primary)" : status.color === "text-yellow-500" ? "#EAB308" : status.color === "text-orange-500" ? "#F97316" : "var(--accent-danger)" }}
                  />
                </motion.div>
                <span
                  className="text-xs sm:text-sm font-bold uppercase tracking-wider"
                  style={{ color: status.color === "text-green-500" ? "var(--accent-primary)" : status.color === "text-yellow-500" ? "#EAB308" : status.color === "text-orange-500" ? "#F97316" : "var(--accent-danger)" }}
                >
                  SYSTEM: {status.label}
                </span>
              </div>
              {activeAnomaliesCount >= 2 && (
                <motion.span
                  className="text-xs mt-1"
                  style={{ color: "var(--accent-danger)" }}
                  animate={{ opacity: [1, 0.6, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                >
                  ⚠️{" "}
                  {activeAnomaliesCount >= 3
                    ? "SYSTEM CRITICAL!"
                    : "Anomalies detected!"}
                </motion.span>
              )}
            </motion.div>

            <div
              className="h-10 w-px opacity-20 hidden sm:block"
              style={{ backgroundColor: "var(--border-color)" }}
            />

            <div className="text-xs font-mono whitespace-nowrap" style={{ color: "var(--text-secondary)" }}>
              TICK: {gameTime}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
