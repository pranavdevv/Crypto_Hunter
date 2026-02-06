import { Symbol } from "@/hooks/useMarketEngine";

export const CRYPTO_COLORS = {
    BTC: {
        base: '#3b82f6', // Blue
        light: '#60a5fa',
        dark: '#2563eb',
        gradient: 'from-blue-600 to-blue-400',
        bg: 'bg-blue-950/30',
        border: 'border-blue-500/50',
        text: 'text-blue-400',
        transactionBg: 'bg-gradient-to-r from-blue-600 to-blue-400',
    },
    ETH: {
        base: '#16a34a', // Dark Green
        light: '#22c55e',
        dark: '#15803d',
        gradient: 'from-green-700 to-green-500',
        bg: 'bg-green-950/30',
        border: 'border-green-600/50',
        text: 'text-green-400',
        transactionBg: 'bg-gradient-to-r from-green-700 to-green-500',
    },
    SOL: {
        base: '#f59e0b', // Orange/Sun
        light: '#fbbf24',
        dark: '#d97706',
        gradient: 'from-red-500 via-orange-500 to-yellow-500',
        bg: 'bg-gradient-to-br from-red-950/30 via-orange-950/30 to-yellow-950/30',
        border: 'border-orange-500/50',
        text: 'text-orange-400',
        transactionBg: 'bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500',
    },
    DOGE: {
        base: '#fef3c7', // Light Yellow
        light: '#fef9e7',
        dark: '#fde047',
        gradient: 'from-white to-yellow-200',
        bg: 'bg-gradient-to-br from-slate-900/50 to-yellow-950/30',
        border: 'border-yellow-300/50',
        text: 'text-yellow-200',
        transactionBg: 'bg-gradient-to-r from-white to-yellow-200',
    },
} as const;

export function getCryptoColor(symbol: Symbol) {
    return CRYPTO_COLORS[symbol];
}

export function getTransactionBorderColor(type: 'BUY' | 'SELL') {
    return type === 'BUY'
        ? 'border-red-500/70' // Red for BUY
        : 'border-green-500/70'; // Green for SELL
}
