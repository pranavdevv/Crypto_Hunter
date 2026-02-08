import { CryptoChart } from "./CryptoChart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import type { Symbol } from "@/hooks/useMarketEngine";
import React from "react";
import { motion } from "framer-motion";

interface CryptoCardProps {
  symbol: Symbol;
  price: number;
  history: { time: number; price: number }[];
  holdings: number;
  onBuy: (amount: number) => void;
  onSell: (amount: number) => void;
  customBuyButton?: React.ReactNode; // AI-generated glitch button from Tambo
}

export function CryptoCard({
  symbol,
  price,
  history,
  holdings,
  onBuy,
  onSell,
  customBuyButton,
}: CryptoCardProps) {
  const isUp = history.length > 1 && price >= history[history.length - 2].price;
  const hasAnomaly = !!customBuyButton;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
      className="w-full"
    >
      <Card
        className={`w-full border transition-all duration-300 ${
          hasAnomaly
            ? "ring-2 ring-red-500/50 animate-pulse"
            : "hover:shadow-lg"
        }`}
        style={{
          backgroundColor: "var(--card-bg)",
          color: "var(--text-primary)",
          borderColor: "var(--border-color)",
          boxShadow: "var(--shadow-md)",
        }}
      >
        <CardHeader className="flex flex-row items-center justify-between pb-3 px-4 sm:px-6 pt-4">
          <div className="flex items-center gap-2 min-w-0">
            <CardTitle className="text-lg sm:text-xl font-bold font-mono truncate">
              {symbol}/USD
            </CardTitle>
            {hasAnomaly && (
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.6, repeat: Infinity }}
              >
                <Badge
                  variant="destructive"
                  className="animate-pulse text-xs whitespace-nowrap"
                >
                  ⚠️ GLITCH
                </Badge>
              </motion.div>
            )}
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className="flex-shrink-0"
          >
            <Badge
              variant={isUp ? "default" : "destructive"}
              className="font-mono text-xs sm:text-sm whitespace-nowrap"
            >
              {isUp ? (
                <ArrowUpIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              ) : (
                <ArrowDownIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              )}
              ${price.toFixed(2)}
            </Badge>
          </motion.div>
        </CardHeader>
        <CardContent className="space-y-4 px-4 sm:px-6 pb-4">
          {/* Price Chart */}
          <motion.div
            className="rounded-lg p-3 sm:p-4 border"
            style={{
              backgroundColor: "var(--bg-tertiary)",
              borderColor: "var(--border-color)",
              boxShadow: "inset 0 1px 3px rgba(0,0,0,0.05)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <CryptoChart data={history} symbol={symbol} />
          </motion.div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
            <motion.div
              className="text-sm"
              style={{ color: "var(--text-secondary)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              Holdings:{" "}
              <motion.span
                className="font-mono font-bold"
                style={{ color: "var(--text-primary)" }}
                key={holdings}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {holdings}
              </motion.span>
            </motion.div>

            <div className="flex gap-2 w-full sm:w-auto">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 sm:flex-none"
              >
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onSell(1)}
                  disabled={holdings <= 0}
                  className="w-full sm:w-auto font-semibold uppercase tracking-wider transition-all text-xs sm:text-sm"
                  style={{
                    backgroundColor: holdings <= 0 ? "var(--text-tertiary)" : "var(--accent-danger)",
                    color: "white",
                  }}
                >
                  SELL
                </Button>
              </motion.div>

              {customBuyButton ? (
                <div className="custom-tambo-button flex-1 sm:flex-none">
                  {React.isValidElement(customBuyButton)
                    ? React.cloneElement(
                        customBuyButton as React.ReactElement<any>,
                        {
                          onClick: () => onBuy(1),
                          onSell: () => onSell(1),
                          className: "w-full",
                        },
                      )
                    : customBuyButton}
                </div>
              ) : (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 sm:flex-none"
                >
                  <Button
                    variant="default"
                    className="w-full sm:w-auto bg-green-600 hover:bg-green-700 font-semibold uppercase tracking-wider transition-all text-xs sm:text-sm"
                    size="sm"
                    onClick={() => onBuy(1)}
                  >
                    BUY
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
