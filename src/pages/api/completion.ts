import type { NextApiRequest, NextApiResponse } from "next";
import { defaultConfig, getOpenAICompletion } from "@/utils/OpenAI";
import { OpenAIRequest } from "@/utils/OpenAI";
// @ts-ignore
import { Client } from "@julep/sdk";

const apiKey = process.env.API_KEY || "";
const baseUrl = process.env.BASE_URL || "";

const client = new Client({ apiKey, baseUrl });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const {
    session_id,
    max_tokens,
    temperature,
    top_p,
    frequency_penalty,
    presence_penalty,
    messages,
  } = await req.body;

  if (!messages) {
    return new Response("Missing messages", { status: 400 });
  }
  const config = {
    maxTokens: max_tokens || defaultConfig.max_tokens,
    temperature: temperature || defaultConfig.temperature,
    topP: top_p || defaultConfig.top_p,
    frequencyPenalty: frequency_penalty || defaultConfig.frequency_penalty,
    presencePenalty: presence_penalty || defaultConfig.presence_penalty,
    stream: false,
  };

  try {
    const createChatResponse = await client.sessions.chat(session_id, {
      ...config,
      messages: messages,
    });
    res.status(200).json(createChatResponse); // Use the res parameter to send a response
  } catch (e: any) {
    console.error(e); // Log the error for debugging
    res.status(500).json({ message: e.message || "Error fetching response." }); // Send error response
  }

  // try {
  //   const response = await getOpenAICompletion(payload);
  //   return response
  // } catch (e: any) {
  //   // throw new Error(e.message || "Error fetching response.")
  //   return new Response(e.message || "Error fetching response.", {
  //     status: 500,
  //   });
  // }
}
