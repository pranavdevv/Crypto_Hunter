import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React, { MouseEventHandler } from "react";
import { z } from "zod";

// --- Schemas for Tambo ---
export const buyButtonSchema = z.object({
    symbol: z.string(),
    onClick: z.function().optional(),
});

interface GameButtonProps {
    onClick?: MouseEventHandler;
    className?: string;
    children?: React.ReactNode;
    disabled?: boolean;
}

// 1. STANDARD
export function StandardBuyButton({ onClick, disabled, className }: GameButtonProps) {
    return (
        <Button
            variant="default"
            className={cn("bg-green-600 hover:bg-green-700 text-white font-bold", className)}
            size="sm"
            onClick={onClick}
            disabled={disabled}
        >
            BUY
        </Button>
    );
}

// 2. GLITCH: RED BUY (Confusing Color)
export function GlitchBuyButton_Red(props: { symbol: string } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <Button
            variant="destructive"
            className="w-full bg-red-600 hover:bg-red-700 animate-pulse font-mono tracking-widest"
            {...props}
        >
            BUY {props.symbol}
        </Button>
    );
}

// 3. GLITCH: TYPO (Text Anomaly)
export function GlitchBuyButton_Typo(props: { symbol: string } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <Button
            variant="default"
            className="w-full bg-green-800 hover:bg-green-900 font-serif italic"
            {...props}
        >
            BUY {props.symbol}
        </Button>
    );
}

// 4. GLITCH: JITTER (Visual Noise)
export function GlitchBuyButton_Jitter(props: { symbol: string } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <Button
            variant="default"
            className="w-full bg-green-600 hover:bg-green-700 animate-jitter"
            {...props}
        >
            BUY {props.symbol}
        </Button>
    );
}

// 5. functional anomaly: REVERSE
export function GlitchBuyButton_Reverse({ symbol, onSell, ...props }: { symbol: string, onSell?: () => void } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <Button
            variant="default"
            className="w-full bg-green-500 hover:bg-green-600 border border-yellow-500/50"
            {...props}
            onClick={(e) => {
                e.preventDefault();
                if (onSell) {
                    onSell();
                }
            }}
        >
            BUY {symbol}
        </Button>
    );
}

// 6. GHOST: Appears briefly then disappears
export function GlitchBuyButton_Ghost(props: { symbol: string } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
    const [isVisible, setIsVisible] = React.useState(true);

    React.useEffect(() => {
        // Disappear after 3 seconds
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    if (!isVisible) {
        return (
            <div className="w-full h-9 flex items-center justify-center text-slate-500 text-xs italic">
                [COMPONENT UNAVAILABLE]
            </div>
        );
    }

    return (
        <Button
            variant="default"
            className="w-full bg-green-600 hover:bg-green-700 opacity-50 animate-pulse"
            {...props}
        >
            BUY {props.symbol}
        </Button>
    );
}

// 7. BOUNCE: Button that moves around
export function GlitchBuyButton_Bounce(props: { symbol: string } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <div className="w-full h-9 relative overflow-visible">
            <Button
                variant="default"
                className="absolute w-full bg-green-600 hover:bg-green-700"
                style={{
                    animation: 'bounce-around 4s ease-in-out infinite'
                }}
                {...props}
            >
                BUY {props.symbol}
            </Button>
        </div>
    );
}

// --- SELL BUTTON VARIANTS ---

// 1. GLITCH: GREEN SELL (Visual Anomaly - looks like buy)
export function GlitchSellButton_Green(props: { symbol: string } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <Button
            variant="default"
            className="w-full bg-green-600 hover:bg-green-700"
            {...props}
        >
            SELL {props.symbol}
        </Button>
    );
}

// 2. GLITCH: TYPO SELL (Visual Anomaly - comic sans)
export function GlitchSellButton_Typo(props: { symbol: string } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <Button
            variant="destructive"
            className="w-full"
            style={{ fontFamily: 'Comic Sans MS, cursive' }}
            {...props}
        >
            SELL {props.symbol}
        </Button>
    );
}

// 3. GLITCH: REVERSE SELL (Functional Anomaly - Executes BUY!)
export function GlitchSellButton_Reverse({ symbol, onBuy, ...props }: { symbol: string, onBuy?: () => void } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <Button
            variant="destructive"
            className="w-full border-2 border-yellow-500/50"
            {...props}
            onClick={(e) => {
                e.preventDefault();
                if (onBuy) {
                    onBuy(); // Executes BUY instead of SELL!
                }
            }}
        >
            SELL {symbol}
        </Button>
    );
}
