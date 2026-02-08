"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { motion } from "framer-motion";

export default function HomePage() {
  const router = useRouter();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-3 sm:p-4 relative overflow-hidden"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      {/* Background accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 sm:w-96 h-64 sm:h-96 rounded-full blur-3xl pointer-events-none opacity-20"
        style={{ backgroundColor: "var(--accent-primary)" }}
      />

      {/* Theme Toggle */}
      <motion.div
        className="absolute top-4 sm:top-6 right-4 sm:right-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <ThemeToggle />
      </motion.div>

      <motion.div
        className="w-full max-w-2xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Card
          className="w-full border transition-colors duration-300"
          style={{
            backgroundColor: "var(--card-bg)",
            borderColor: "var(--border-color)",
            boxShadow: "var(--shadow-lg)",
          }}
        >
          <CardHeader className="text-center space-y-2 sm:space-y-4 px-4 sm:px-6 pt-6 sm:pt-8">
            <motion.div variants={itemVariants}>
              <CardTitle className="text-3xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                CRYPTO ANOMALY
              </CardTitle>
            </motion.div>
            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl font-mono"
              style={{ color: "var(--text-secondary)" }}
            >
              HFT Detection Game
            </motion.p>
          </CardHeader>

          <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-8">
            <motion.div
              className="space-y-3 sm:space-y-4"
              style={{ color: "var(--text-secondary)" }}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div
                variants={itemVariants}
                className="p-3 sm:p-4 rounded-lg border transition-all hover:shadow-md"
                style={{
                  backgroundColor: "var(--bg-tertiary)",
                  borderColor: "var(--border-color)",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                }}
              >
                <h3
                  className="text-base sm:text-lg font-semibold mb-2"
                  style={{ color: "var(--accent-primary)" }}
                >
                  🎯 Objective
                </h3>
                <p className="text-sm sm:text-base">
                  Turn your $10,000 into <strong>$25,000</strong> by trading
                  crypto.
                </p>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="p-3 sm:p-4 rounded-lg border transition-all hover:shadow-md"
                style={{
                  backgroundColor: "var(--bg-tertiary)",
                  borderColor: "var(--border-color)",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                }}
              >
                <h3
                  className="text-base sm:text-lg font-semibold mb-2"
                  style={{ color: "var(--accent-danger)" }}
                >
                  ⚠️ Warning
                </h3>
                <p className="text-sm sm:text-base">The system may glitch. Watch for anomalies.</p>
                <p
                  className="text-xs sm:text-sm mt-2"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Use the SCAN & PURGE button to clear anomalies.
                </p>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="p-3 sm:p-4 rounded-lg border transition-all hover:shadow-md"
                style={{
                  backgroundColor: "var(--bg-tertiary)",
                  borderColor: "var(--border-color)",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                }}
              >
                <h3
                  className="text-base sm:text-lg font-semibold mb-2"
                  style={{ color: "var(--accent-primary)" }}
                >
                  💡 Rules
                </h3>
                <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
                  <li>Lose if balance hits $0</li>
                  <li>Lose if anomalies ≥ 5</li>
                  <li>
                    Win by reaching <strong>$25,000</strong>
                  </li>
                </ul>
              </motion.div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={() => router.push("/game")}
                className="w-full py-4 sm:py-6 text-base sm:text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 rounded-lg transition-all uppercase tracking-wide"
                style={{
                  boxShadow: "0 0 30px rgba(34, 197, 94, 0.4)",
                }}
              >
                START GAME
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
