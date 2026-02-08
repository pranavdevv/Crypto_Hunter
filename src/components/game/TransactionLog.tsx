import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getCryptoColor, getTransactionBorderColor } from '@/lib/cryptoColors';

export type Transaction = {
    id: string;
    type: 'BUY' | 'SELL';
    symbol: string;
    amount: number;
    price: number;
    timestamp: number;
    total: number;
};

interface TransactionLogProps {
    transactions: Transaction[];
}

export function TransactionLog({ transactions }: TransactionLogProps) {
    return (
        <Card className="bg-slate-900 border-slate-800 h-full">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg text-slate-100 font-mono">
                    📊 SYSTEM LOGS
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-200px)]">
                    <div className="space-y-1 px-4 pb-4">
                        {transactions.length === 0 ? (
                            <p className="text-slate-500 text-sm text-center py-8">
                                No transactions yet
                            </p>
                        ) : (
                            transactions.slice().reverse().map((tx) => {
                                const cryptoColor = getCryptoColor(tx.symbol as any);
                                const borderColor = getTransactionBorderColor(tx.type);

                                return (
                                    <div
                                        key={tx.id}
                                        className={`p-3 rounded-lg font-mono border-4 ${cryptoColor.transactionBg} ${borderColor} shadow-lg`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <span className="font-bold text-xl text-black">
                                                    {tx.amount} {tx.symbol}
                                                </span>
                                            </div>
                                            <span className="text-black/60 text-xs">
                                                {new Date(tx.timestamp * 1000).toLocaleTimeString()}
                                            </span>
                                        </div>
                                        <div className="text-black font-black text-3xl">
                                            ${tx.price.toFixed(2)}
                                        </div>
                                        <div className="text-black/70 text-sm mt-1">
                                            Total: ${tx.total.toFixed(2)}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
