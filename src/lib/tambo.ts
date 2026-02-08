/**
 * @file tambo.ts
 * @description Central configuration file for Tambo components and tools
 *
 * This file serves as the central place to register your Tambo components and tools.
 * It exports arrays that will be used by the TamboProvider.
 *
 * Read more about Tambo at https://tambo.co/docs
 */

import { Graph, graphSchema } from "@/components/tambo/graph";
import { DataCard, dataCardSchema } from "@/components/ui/card-data";
import {
  getCountryPopulations,
  getGlobalPopulationTrend,
} from "@/services/population-stats";
import type { TamboComponent } from "@tambo-ai/react";
import { TamboTool } from "@tambo-ai/react";
import { z } from "zod";
import {
  StandardBuyButton,
  GlitchBuyButton_Red,
  GlitchBuyButton_Typo,
  GlitchBuyButton_Jitter,
  GlitchBuyButton_Reverse,
  GlitchBuyButton_Ghost,
  GlitchBuyButton_Bounce,
  GlitchSellButton_Green,
  GlitchSellButton_Typo,
  GlitchSellButton_Reverse
} from "@/components/tambo/GameButtons";
import {
  GlitchChart_NoAxis,
  GlitchChart_NoGrid,
  GlitchChart_Neon,
  GlitchChart_Flatline
} from "@/components/tambo/GameCharts";

/**
 * tools
 *
 * This array contains all the Tambo tools that are registered for use within the application.
 * Each tool is defined with its name, description, and expected props. The tools
 * can be controlled by AI to dynamically fetch data based on user interactions.
 */

export const tools: TamboTool[] = [
  {
    name: "countryPopulation",
    description:
      "A tool to get population statistics by country with advanced filtering options",
    tool: getCountryPopulations,
    inputSchema: z.object({
      continent: z.string().optional(),
      sortBy: z.enum(["population", "growthRate"]).optional(),
      limit: z.number().optional(),
      order: z.enum(["asc", "desc"]).optional(),
    }),
    outputSchema: z.array(
      z.object({
        countryCode: z.string(),
        countryName: z.string(),
        continent: z.enum([
          "Asia",
          "Africa",
          "Europe",
          "North America",
          "South America",
          "Oceania",
        ]),
        population: z.number(),
        year: z.number(),
        growthRate: z.number(),
      }),
    ),
  },
  {
    name: "globalPopulation",
    description:
      "A tool to get global population trends with optional year range filtering",
    tool: getGlobalPopulationTrend,
    inputSchema: z.object({
      startYear: z.number().optional(),
      endYear: z.number().optional(),
    }),
    outputSchema: z.array(
      z.object({
        year: z.number(),
        population: z.number(),
        growthRate: z.number(),
      }),
    ),
  },
  // Add more tools here
];

/**
 * components
 *
 * This array contains all the Tambo components that are registered for use within the application.
 * Each component is defined with its name, description, and expected props. The components
 * can be controlled by AI to dynamically render UI elements based on user interactions.
 */
export const components: TamboComponent[] = [
  {
    name: "Graph",
    description:
      "A component that renders various types of charts (bar, line, pie) using Recharts. Supports customizable data visualization with labels, datasets, and styling options.",
    component: Graph,
    propsSchema: graphSchema,
  },
  {
    name: "DataCard",
    description:
      "A component that displays options as clickable cards with links and summaries with the ability to select multiple items.",
    component: DataCard,
    propsSchema: dataCardSchema,
  },
  {
    name: "StandardBuyButton",
    description: "A standard, functioning 'Buy' button for the crypto exchange. Use this when the system is normal.",
    component: StandardBuyButton,
    propsSchema: z.object({
      symbol: z.string().describe("The crypto symbol (e.g. BTC)"),
    }),
  },
  {
    name: "GlitchBuyButton_Red",
    description: "A corrupted 'Buy' button that is colored RED (danger). Use this when the system is under attack or glitching.",
    component: GlitchBuyButton_Red,
    propsSchema: z.object({
      symbol: z.string(),
    }),
  },
  {
    name: "GlitchBuyButton_Typo",
    description: "A 'Buy' button with text errors (typos). Use for mild system corruption.",
    component: GlitchBuyButton_Typo,
    propsSchema: z.object({
      symbol: z.string(),
    }),
  },
  {
    name: "GlitchBuyButton_Jitter",
    description: "A corrupted 'Buy' button that is visually shaking/jittering. Use for 'Jitter' or 'Shake' errors.",
    component: GlitchBuyButton_Jitter,
    propsSchema: z.object({
      symbol: z.string(),
    }),
  },
  {
    name: "GlitchBuyButton_Reverse",
    description: "A corrupted 'Buy' button that functionally sells units instead of buying. Visually subtle.",
    component: GlitchBuyButton_Reverse,
    propsSchema: z.object({
      symbol: z.string(),
    }),
  },
  {
    name: "GlitchBuyButton_Ghost",
    description: "A 'Buy' button that appears briefly then disappears after 3 seconds. Forces quick decisions.",
    component: GlitchBuyButton_Ghost,
    propsSchema: z.object({
      symbol: z.string(),
    }),
  },
  {
    name: "GlitchBuyButton_Bounce",
    description: "A 'Buy' button that bounces around, making it hard to click. Use for high chaos.",
    component: GlitchBuyButton_Bounce,
    propsSchema: z.object({
      symbol: z.string(),
    }),
  },
  {
    name: "GlitchSellButton_Green",
    description: "A corrupted 'Sell' button that is colored GREEN (like a buy button). Confusing visual.",
    component: GlitchSellButton_Green,
    propsSchema: z.object({
      symbol: z.string(),
    }),
  },
  {
    name: "GlitchSellButton_Typo",
    description: "A 'Sell' button with Comic Sans font. Mild visual anomaly.",
    component: GlitchSellButton_Typo,
    propsSchema: z.object({
      symbol: z.string(),
    }),
  },
  {
    name: "GlitchSellButton_Reverse",
    description: "A corrupted 'Sell' button that functionally BUYS units instead of selling. VERY DANGEROUS.",
    component: GlitchSellButton_Reverse,
    propsSchema: z.object({
      symbol: z.string(),
    }),
  },
  {
    name: "GlitchChart_NoAxis",
    description: "A chart with hidden axis labels - makes it impossible to judge exact prices. Confusing visual anomaly.",
    component: GlitchChart_NoAxis,
    propsSchema: z.object({
      symbol: z.string(),
      data: z.array(z.object({ time: z.number(), price: z.number() })),
    }),
  },
  {
    name: "GlitchChart_NoGrid",
    description: "A chart without grid lines - harder to read trends and magnitude. Subtle visual degradation.",
    component: GlitchChart_NoGrid,
    propsSchema: z.object({
      symbol: z.string(),
      data: z.array(z.object({ time: z.number(), price: z.number() })),
    }),
  },
  {
    name: "GlitchChart_Neon",
    description: "A chart with psychedelic rainbow colors - disorienting and hard to read. High visual chaos.",
    component: GlitchChart_Neon,
    propsSchema: z.object({
      symbol: z.string(),
      data: z.array(z.object({ time: z.number(), price: z.number() })),
    }),
  },
  {
    name: "GlitchChart_Flatline",
    description: "A chart showing a completely flat line at $0 with SIGNAL LOST warning. Pretends asset is dead/crashed.",
    component: GlitchChart_Flatline,
    propsSchema: z.object({
      symbol: z.string(),
      data: z.array(z.object({ time: z.number(), price: z.number() })),
    }),
  },
];
