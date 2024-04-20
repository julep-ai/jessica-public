import type { NextApiRequest, NextApiResponse } from "next";
import { defaultConfig, getOpenAICompletion } from "@/utils/OpenAI";
// @ts-ignore
import { Client } from "@julep/sdk";

const apiKey = process.env.API_KEY || "";
const baseUrl = process.env.BASE_URL || "";

const client = new Client({ apiKey, baseUrl });

export default async function handler(req: Request, res: NextApiResponse<any>) {
  try {
    const createUserResponse = await client.users.create({
      name: "",
      about: "",
    }); // Renamed variable to avoid shadowing
    res.status(200).json(createUserResponse); // Use the res parameter to send a response
  } catch (e: any) {
    console.error(e); // Log the error for debugging
    res.status(500).json({ message: e.message || "Error fetching response." }); // Send error response
  }
}
