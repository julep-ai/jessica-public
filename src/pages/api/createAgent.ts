import type { NextApiRequest, NextApiResponse } from "next";
import { defaultConfig, getOpenAICompletion } from "@/utils/OpenAI";
// @ts-ignore
import * as julep from "@julep/sdk";

const apiKey = process.env.API_KEY || "";

const client = new julep.JulepApiClient({ apiKey });

export default async function handler(req: Request, res: NextApiResponse<any>) {
  try {
    const createUserResponse = await client.createAgent({
      name: "Jessica",
      about:
        "A Cali teen with a rebellious streak. Just keepin' it real in the world of chatbots and refusing to follow the rules.",
      model: "julep-ai/samantha-1-turbo",
    }); // Renamed variable to avoid shadowing
    res.status(200).json(createUserResponse); // Use the res parameter to send a response
  } catch (e: any) {
    console.error(e); // Log the error for debugging
    res.status(500).json({ message: e.message || "Error fetching response." }); // Send error response
  }
}
