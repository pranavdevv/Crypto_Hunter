import { CryptoChart } from './CryptoChart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';
import type { Symbol } from '@/hooks/useMarketEngine';
import React from 'react';

interface CryptoCardProps {
    symbol: Symbol;
    price: number;
    history: { time: number; price: number }[];
    holdings: number;
    onBuy: (amount: number) => void;
    onSell: (amount: number) => void;
    customBuyButton?: React.ReactNode;
}

export function CryptoCard({ symbol, price, history, holdings, onBuy, onSell, customBuyButton }: CryptoCardProps) {
    const isUp = history.length > 1 && price >= history[history.length - 2].price;
    const priceColor = isUp ? "text-green-500" : "text-red-500";

    return (
        <Card className="w-full bg-slate-950 border-slate-800 text-slate-100">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-bold font-mono">{symbol}/USD</CardTitle>
                <Badge variant={isUp ? "default" : "destructive"} className="font-mono">
                    {isUp ? <ArrowUpIcon className="w-4 h-4 mr-1" /> : <ArrowDownIcon className="w-4 h-4 mr-1" />}
                    ${price.toFixed(2)}
                </Badge>
            </CardHeader>
            <CardContent>
                {/* Price Chart */}
                <div className="bg-slate-800 rounded p-3">
                    <CryptoChart data={history} symbol={symbol} />
                </div>

                <div className="flex justify-between items-center mt-4">
                    <div className="text-sm text-slate-400">
                        Holdings: <span className="font-mono text-white">{holdings}</span>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => onSell(1)}
                            disabled={holdings <= 0}
                        >
                            SELL
                        </Button>

                        {customBuyButton ? (
                            <div className="custom-tambo-button">
                                {React.isValidElement(customBuyButton)
                                    ? React.cloneElement(customBuyButton as React.ReactElement<any>, {
                                        // We pass BOTH handlers.
                                        // Standard button uses onClick (from spread props)
                                        // Glitch buttons can choose to use onSell instead of onClick!
                                        onClick: () => onBuy(1),
                                        onSell: () => onSell(1), // Backdoor for Reverse button
                                        className: "w-full"
                                    })
                                    : customBuyButton}
                            </div>
                        ) : (
                            <Button
                                variant="default" // Using default (usually black/white) or custom green
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
