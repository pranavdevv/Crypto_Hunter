import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { getCryptoColor } from "@/lib/cryptoColors";

interface CryptoChartProps {
    data: { time: number; price: number }[];
    symbol: string;
}

export function CryptoChart({ data, symbol }: CryptoChartProps) {
    const cryptoColor = getCryptoColor(symbol as any);

    // Determine trend (up or down)
    const firstPrice = data[0]?.price || 0;
    const lastPrice = data[data.length - 1]?.price || 0;
    const isUp = lastPrice >= firstPrice;

    return (
        <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis
                    dataKey="time"
                    hide={false}
                    tick={{ fill: '#94a3b8', fontSize: 10 }}
                    tickFormatter={(val) => `${val}s`}
                    interval="preserveStartEnd"
                />
                <YAxis
                    domain={['auto', 'auto']}
                    orientation="right"
                    tick={{ fill: '#94a3b8', fontSize: 10 }}
                    width={40}
                    tickFormatter={(val) => `$${val.toFixed(0)}`}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: '#1e293b',
                        border: `1px solid ${cryptoColor.base}`,
                        borderRadius: '4px',
                        fontSize: '12px'
                    }}
                    labelFormatter={(val) => `Time: ${val}s`}
                    formatter={(val: number | undefined) => val ? [`$${val.toFixed(2)}`, 'Price'] : ['--', 'Price']}
                />
                <Line
                    type="monotone"
                    dataKey="price"
                    stroke={isUp ? "#22c55e" : "#ef4444"}
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                />
            </LineChart>
        </ResponsiveContainer>
    );
}
