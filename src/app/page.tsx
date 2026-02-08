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
          <p className="text-xl text-slate-400 font-mono">HFT Detection Game</p>
        </CardHeader>

        <CardContent className="space-y-6 p-8">
          <div className="space-y-4 text-slate-300">
            <div className="p-4 bg-slate-950/50 rounded border border-slate-700">
              <h3 className="text-lg font-semibold mb-2 text-green-400">
                🎯 Objective
              </h3>
              <p>
                Turn your $10,000 into <strong>$25,000</strong> by trading
                crypto.
              </p>
            </div>

            <div className="p-4 bg-slate-950/50 rounded border border-slate-700">
              <h3 className="text-lg font-semibold mb-2 text-yellow-400">
                ⚠️ Critical Intel
              </h3>
              <p>
                You have a <strong>2-minute grace period</strong> to memorize the
                interface.
              </p>
              <p className="text-sm text-slate-500 mt-2">
                After that, glitches will alter the UI. Use <strong>SCAN & PURGE</strong> to fix them.
              </p>
            </div>

            <div className="p-4 bg-slate-950/50 rounded border border-slate-700">
              <h3 className="text-lg font-semibold mb-2 text-blue-400">
                💡 Rules
              </h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Lose if balance hits $0</li>
                <li>Lose if anomalies ≥ 5</li>
                <li>
                  Win by reaching <strong>$25,000</strong>
                </li>
              </ul>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => router.push("/game?mode=mock")}
              className="flex flex-row items-center w-full py-6 text-xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 shadow-[0_0_30px_rgba(234,179,8,0.4)]"
            >
              START (MOCK MODE)
              <span className="ml-2 text-sm font-normal opacity-80 decoration-slice">
                - Free, No API
              </span>
            </Button>

            <Button
              onClick={() => router.push("/game?mode=live")}
              className="flex flex-row items-center w-full py-6 text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 shadow-[0_0_30px_rgba(34,197,94,0.4)]"
            >
              START (LIVE MODE)
              <span className="ml-2 text-sm font-normal opacity-80">
                - Uses Tambo API
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
