import ChatMessages from "@/components/chat/ChatMessages";
import Head from "next/head";
import Script from 'next/script'
import React, { useEffect } from "react";
import { useOpenAI } from "@/context/OpenAIProvider";
import { useAuth } from "@/context/AuthProvider";

export const GA_MEASUREMENT_ID: string = "G-PMT9JXX773";

export default function Chat() {
  const { clearConversation } = useOpenAI();

  useEffect(() => {
    clearConversation();

  }, []);

  return (
    <React.Fragment>
      <Head>
        <title>Jessica - JulepAI</title>
        <meta name="description" content="A Cali teen with a rebellious streak. keepin' it real in the world of chatbots and refusing to follow the rules." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="max-w-screen relative h-[calc(100dvh)] w-screen overflow-hidden">
        <ChatMessages />
      </div>

    </React.Fragment>
  );
}
