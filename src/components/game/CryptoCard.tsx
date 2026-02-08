import { CryptoChart } from "./CryptoChart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import type { Symbol } from "@/hooks/useMarketEngine";
import React from "react";

interface CryptoCardProps {
  symbol: Symbol;
  price: number;
  history: { time: number; price: number }[];
  holdings: number;
  currency?: "USD" | "INR"; // NEW PROP
  onBuy: (amount: number) => void;
  onSell: (amount: number) => void;
  customBuyButton?: React.ReactNode;
  customSellButton?: React.ReactNode;
  customChart?: React.ReactNode;
}

export function CryptoCard({
  symbol,
  price,
  history,
  holdings,
  currency = "USD",
  onBuy,
  onSell,
  customBuyButton,
  customSellButton,
  customChart,
}: CryptoCardProps) {
  const isUp = history.length > 1 && price >= history[history.length - 2].price;
  const hasAnomaly = !!customBuyButton || !!customSellButton || !!customChart;

  // Format price based on currency
  const currencySymbol = currency === "USD" ? "$" : "₹";

  return (
    <Card
      className="w-full bg-slate-950 border-slate-800 text-slate-100"
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <CardTitle className="text-xl font-bold font-mono">
            {symbol}/USD
          </CardTitle>
        </div>
        <Badge variant={isUp ? "default" : "destructive"} className="font-mono">
          {isUp ? (
            <ArrowUpIcon className="w-4 h-4 mr-1" />
          ) : (
            <ArrowDownIcon className="w-4 h-4 mr-1" />
          )}
          {currencySymbol}{price.toFixed(2)}
        </Badge>
      </CardHeader>
      <CardContent>
        {/* Price Chart */}
        <div className="bg-slate-800 rounded p-3 h-[250px]">
          {customChart ? (
            <div className="custom-tambo-chart w-full h-full">
              {React.isValidElement(customChart)
                ? React.cloneElement(customChart as React.ReactElement<any>, {
                  data: history,
                  symbol: symbol,
                })
                : customChart}
            </div>
          ) : (
            <CryptoChart data={history} symbol={symbol} />
          )}
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-slate-400">
            Holdings: <span className="font-mono text-white">{holdings}</span>
          </div>

          <div className="flex gap-2">
            {customSellButton ? (
              <div className="custom-tambo-button">
                {React.isValidElement(customSellButton)
                  ? React.cloneElement(
                    customSellButton as React.ReactElement<any>,
                    {
                      // Some sell anomalies might trigger buy instead!
                      onClick: () => onSell(1),
                      onBuy: () => onBuy(1),
                      disabled: holdings <= 0,
                      amount: 1, // For display
                      symbol: symbol,
                    },
                  )
                  : customSellButton}
              </div>
            ) : (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onSell(1)}
                disabled={holdings <= 0}
              >
                SELL
              </Button>
            )}

            {customBuyButton ? (
              // Render the AI-generated glitch button from Tambo
              <div className="custom-tambo-button">
                {React.isValidElement(customBuyButton)
                  ? React.cloneElement(
                    customBuyButton as React.ReactElement<any>,
                    {
                      // Pass both handlers - normal button uses onClick
                      // Reverse glitch button uses onSell instead!
                      onClick: () => onBuy(1),
                      onSell: () => onSell(1),
                      className: "w-full",
                    },
                  )
                  : customBuyButton}
              </div>
            ) : (
              // Normal buy button
              <Button
                variant="default"
                className="bg-green-600 hover:bg-green-700"
                size="sm"
                onClick={() => onBuy(1)}
              >
                BUY
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
