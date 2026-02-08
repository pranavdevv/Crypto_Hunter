import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getCryptoColor, getTransactionBorderColor } from '@/lib/cryptoColors';
import { motion } from 'framer-motion';

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
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full lg:w-80"
        >
            <Card
                className="h-full border transition-colors duration-300"
                style={{
                    backgroundColor: "var(--card-bg)",
                    borderColor: "var(--border-color)",
                    boxShadow: "var(--shadow-lg)",
                }}
            >
                <CardHeader className="pb-3 px-4 sm:px-6 pt-4">
                    <CardTitle
                        className="text-base sm:text-lg font-mono"
                        style={{ color: "var(--text-primary)" }}
                    >
                        📊 SYSTEM LOGS
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <ScrollArea className="h-[300px] sm:h-[400px] lg:h-[calc(100vh-200px)]">
                        <div className="space-y-2 px-4 sm:px-6 pb-4">
                            {transactions.length === 0 ? (
                                <p
                                    className="text-sm text-center py-8"
                                    style={{ color: "var(--text-secondary)" }}
                                >
                                    No transactions yet
                                </p>
                            ) : (
                                transactions.slice().reverse().map((tx, index) => {
                                    const cryptoColor = getCryptoColor(tx.symbol as any);
                                    const borderColor = getTransactionBorderColor(tx.type);

                                    return (
                                        <motion.div
                                            key={tx.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.3, delay: index * 0.05 }}
                                            whileHover={{ scale: 1.02, x: 2 }}
                                            className={`p-2 sm:p-3 rounded-lg font-mono border-4 ${cryptoColor.transactionBg} ${borderColor} shadow-lg transition-all cursor-default text-xs sm:text-sm`}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <span className="font-bold text-lg sm:text-xl text-black">
                                                        {tx.amount} {tx.symbol}
                                                    </span>
                                                </div>
                                                <span className="text-black/60 text-xs flex-shrink-0">
                                                    {new Date(tx.timestamp * 1000).toLocaleTimeString()}
                                                </span>
                                            </div>
                                            <div className="text-black font-black text-2xl sm:text-3xl">
                                                ${tx.price.toFixed(2)}
                                            </div>
                                            <div className="text-black/70 text-xs sm:text-sm mt-1">
                                                Total: ${tx.total.toFixed(2)}
                                            </div>
                                        </motion.div>
                                    );
                                })
                            )}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
        </motion.div>
    );
}
