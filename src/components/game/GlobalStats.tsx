import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WalletIcon, TrendingUpIcon, AlertTriangleIcon } from "lucide-react";

interface GlobalStatsProps {
    balance: number;
    startBalance: number;
    gameTime: number;
    activeAnomaliesCount: number;
}

export function GlobalStats({ balance, startBalance, gameTime, activeAnomaliesCount }: GlobalStatsProps) {
    const pnl = balance - startBalance;
    const isProfit = pnl >= 0;

    return (
        <Card className="mb-4 bg-slate-950 border-slate-800 text-slate-100 sticky top-0 z-50 shadow-xl shadow-slate-900/50">
            <CardContent className="flex items-center justify-between py-4">
                <div className="flex items-center gap-6">
                    <div className="flex flex-col">
                        <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">Balance</span>
                        <div className="flex items-center text-2xl font-mono font-bold text-white">
                            <WalletIcon className="w-5 h-5 mr-2 text-blue-500" />
                            ${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                    </div>

                    <div className="h-10 w-px bg-slate-800" />

                    <div className="flex flex-col">
                        <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">P & L</span>
                        <div className={`flex items-center text-2xl font-mono font-bold ${isProfit ? 'text-green-500' : 'text-red-500'}`}>
                            <TrendingUpIcon className={`w-5 h-5 mr-2 ${isProfit ? '' : 'rotate-180'}`} />
                            {isProfit ? '+' : ''}{pnl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {activeAnomaliesCount > 0 && (
                        <Badge variant="destructive" className="animate-pulse">
                            <AlertTriangleIcon className="w-4 h-4 mr-1" />
                            SYSTEM UNSTABLE ({activeAnomaliesCount})
                        </Badge>
                    )}
                    <div className="text-xs text-slate-500 font-mono">
                        TICK: {gameTime}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
