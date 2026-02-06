"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black text-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-slate-900 border-slate-800">
        <CardHeader className="text-center space-y-4">
          <CardTitle className="text-5xl font-bold tracking-tight bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            CRYPTO ANOMALY
          </CardTitle>
          <p className="text-xl text-slate-400 font-mono">
            HFT Detection Game
          </p>
        </CardHeader>

        <CardContent className="space-y-6 p-8">
          <div className="space-y-4 text-slate-300">
            <div className="p-4 bg-slate-950/50 rounded border border-slate-700">
              <h3 className="text-lg font-semibold mb-2 text-green-400">🎯 Objective</h3>
              <p>Turn your $10,000 into $50,000 by trading crypto.</p>
            </div>

            <div className="p-4 bg-slate-950/50 rounded border border-slate-700">
              <h3 className="text-lg font-semibold mb-2 text-red-400">⚠️ Warning</h3>
              <p>The system may glitch. Watch for anomalies.</p>
              <p className="text-sm text-slate-500 mt-2">Use the SCAN & PURGE button to clear anomalies.</p>
            </div>

            <div className="p-4 bg-slate-950/50 rounded border border-slate-700">
              <h3 className="text-lg font-semibold mb-2 text-blue-400">💡 Rules</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Lose if balance hits $0</li>
                <li>Lose if anomalies ≥ 5</li>
                <li>Win by reaching $50,000</li>
              </ul>
            </div>
          </div>

          <Button
            onClick={() => router.push("/game")}
            className="w-full py-6 text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 shadow-[0_0_30px_rgba(34,197,94,0.4)]"
          >
            START GAME
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
