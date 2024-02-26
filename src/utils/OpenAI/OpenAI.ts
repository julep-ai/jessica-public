"use server";
import { OpenAIChatMessage, OpenAIConfig } from "./OpenAI.types";
// @ts-ignore
// import { JulepApiClient } from "@julep/sdk";

export const defaultConfig = {
  model: "julep-ai/samantha-1-turbo",
  temperature: 0.7,
  max_tokens: 800,
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0.0,
  ignore_eos: false,
  skip_special_tokens: false,
  stop: ["<", "<|"],
};

export type OpenAIRequest = {
  messages: OpenAIChatMessage[];
} & OpenAIConfig;

export interface ChatCompletion {
  data: {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: Choice[];
    usage: {
      prompt_tokens: number;
      total_tokens: number;
      completion_tokens: number;
    };
  };
}

interface Choice {
  index: number;
  message: {
    role: string;
    content: string;
    name: null;
  };
  finish_reason: string;
}

const token = process.env.API_KEY || "";

export const getOpenAICompletion = async (
  payload: OpenAIRequest
): Promise<Response> => {
  const response = await fetch(
    "https://api-alpha.julep.ai/v1/chat/completions",
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(payload),
    }
  );

  // Check for errors
  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response;
};
