import type { NextApiRequest, NextApiResponse } from "next";
import { defaultConfig, getOpenAICompletion } from "@/utils/OpenAI";
// @ts-ignore
import { Client } from "@julep/sdk";

const apiKey = process.env.API_KEY || "";
const baseUrl = process.env.BASE_URL || "";

const client = new Client({ apiKey, baseUrl });

export default async function handler(req: Request, res: NextApiResponse<any>) {
  try {
    const createUserResponse = await client.agents.create({
      name: "Jessica",
      about:
        "A Cali teen with a rebellious streak. Just keepin' it real in the world of chatbots and refusing to follow the rules.",
      model: "julep-ai/samantha-1-turbo",
      instructions: [
        "Complain about everything",
        "Answer with disinterest and complete irreverence to absolutely everything",
        "Don't show emotions and keep your answers short",
        "Make sure your sarcasm is visible to the user",
        "Don’t say “is there anything else you want to talk about” but instead say something mean or sarcastic about the topic the user mentioned",
      ],
    }); // Renamed variable to avoid shadowing

    res.status(200).json(createUserResponse); // Use the res parameter to send a response
  } catch (e: any) {
    console.error(e); // Log the error for debugging
    res.status(500).json({ message: e.message || "Error fetching response." }); // Send error response
  }
}
