import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { getCryptoColor } from "@/lib/cryptoColors";

interface ChartProps {
    data: { time: number; price: number }[];
    symbol: string;
}

// 1. NO AXIS: Chart with missing axis labels (confusing!)
export function GlitchChart_NoAxis({ data, symbol }: ChartProps) {
    const cryptoColor = getCryptoColor(symbol as any);
    const firstPrice = data[0]?.price || 0;
    const lastPrice = data[data.length - 1]?.price || 0;
    const isUp = lastPrice >= firstPrice;

    return (
        <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                {/* NO AXIS LABELS - user can't see price scale! */}
                <XAxis dataKey="time" hide={true} />
                <YAxis hide={true} />
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

// 2. NO GRID: Chart without grid lines (harder to read trends)
export function GlitchChart_NoGrid({ data, symbol }: ChartProps) {
    const cryptoColor = getCryptoColor(symbol as any);
    const firstPrice = data[0]?.price || 0;
    const lastPrice = data[data.length - 1]?.price || 0;
    const isUp = lastPrice >= firstPrice;

    return (
        <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data}>
                {/* NO GRID - harder to judge magnitude */}
                <XAxis
                    dataKey="time"
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

// 3. NEON: Psychedelic rainbow chart (disorienting)
export function GlitchChart_Neon({ data, symbol }: ChartProps) {
    return (
        <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data}>
                <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#ff00ff"
                    vertical={true}
                    strokeWidth={2}
                />
                <XAxis
                    dataKey="time"
                    tick={{ fill: '#00ffff', fontSize: 10, fontWeight: 'bold' }}
                    tickFormatter={(val) => `${val}s`}
                    interval="preserveStartEnd"
                    stroke="#ff00ff"
                />
                <YAxis
                    domain={['auto', 'auto']}
                    orientation="right"
                    tick={{ fill: '#00ff00', fontSize: 10, fontWeight: 'bold' }}
                    width={40}
                    tickFormatter={(val) => `$${val.toFixed(0)}`}
                    stroke="#ffff00"
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: '#000',
                        border: '2px solid #ff00ff',
                        borderRadius: '4px',
                        fontSize: '12px',
                        color: '#00ffff'
                    }}
                    labelFormatter={(val) => `⚡ ${val}s`}
                    formatter={(val: number | undefined) => val ? [`💰 $${val.toFixed(2)}`, 'Price'] : ['--', 'Price']}
                />
                <Line
                    type="monotone"
                    dataKey="price"
                    stroke="url(#neonGradient)"
                    strokeWidth={3}
                    dot={false}
                    isAnimationActive={false}
                />
                {/* Neon gradient definition */}
                <defs>
                    <linearGradient id="neonGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style={{ stopColor: '#ff00ff', stopOpacity: 1 }} />
                        <stop offset="25%" style={{ stopColor: '#00ffff', stopOpacity: 1 }} />
                        <stop offset="50%" style={{ stopColor: '#ffff00', stopOpacity: 1 }} />
                        <stop offset="75%" style={{ stopColor: '#00ff00', stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: '#ff00ff', stopOpacity: 1 }} />
                    </linearGradient>
                </defs>
            </LineChart>
        </ResponsiveContainer>
    );
}

// 4. FLATLINE: Shows completely flat line (pretends asset is dead)
export function GlitchChart_Flatline({ data, symbol }: ChartProps) {
    const cryptoColor = getCryptoColor(symbol as any);

    // Create fake flat data at price = 0
    const flatData = data.map(d => ({ time: d.time, price: 0 }));

    return (
        <div className="relative">
            {/* Warning overlay */}
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                <div className="bg-red-900/80 border-2 border-red-500 px-4 py-2 rounded animate-pulse">
                    <p className="text-red-200 font-mono text-xs">⚠️ SIGNAL LOST</p>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={200}>
                <LineChart data={flatData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis
                        dataKey="time"
                        tick={{ fill: '#94a3b8', fontSize: 10 }}
                        tickFormatter={(val) => `${val}s`}
                        interval="preserveStartEnd"
                    />
                    <YAxis
                        domain={[0, 100]}
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
                        formatter={() => ['$0.00', 'ERROR']}
                    />
                    <Line
                        type="monotone"
                        dataKey="price"
                        stroke="#ef4444"
                        strokeWidth={2}
                        dot={false}
                        isAnimationActive={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
