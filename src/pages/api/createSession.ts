import type { NextApiRequest, NextApiResponse } from "next";
import { defaultConfig, getOpenAICompletion } from "@/utils/OpenAI";
// @ts-ignore
import * as julep from "@julep/sdk";


const apiKey =
    process.env.API_KEY ||
    

const client = new julep.JulepApiClient({ apiKey });

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
    const { agentId, userId } = req.body;
    try {
        const createSessionResponse = await client.createSession({ agentId, userId }); // Renamed variable to avoid shadowing
        res.status(200).json(createSessionResponse); // Use the res parameter to send a response
    } catch (e: any) {
        console.error(e); // Log the error for debugging
        res.status(500).json({ message: e.message || "Error fetching response." }); // Send error response
    }
}