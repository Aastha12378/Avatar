import dotenv from "dotenv";
dotenv.config();

import { genkit } from "genkit";
import { googleAI } from "@genkit-ai/googleai";
import openAI from "genkitx-openai";

export const ai = genkit({
  plugins: [googleAI(), openAI()],
  model: "llava-1.5-7b",
});

// Function to register flows after ai is initialized
export function registerFlows() {
  // Import flows here to avoid circular dependency
  import("@/ai/flows/suggest-themes");
  import("@/ai/flows/generate-themed-image-flow");
}
