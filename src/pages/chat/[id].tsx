import ChatMessages from "@/components/chat/ChatMessages";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import { getConversation } from "./../../utils/History";
import { useOpenAI } from "@/context/OpenAIProvider";

export default function Chat() {
  const { loadConversation, conversationId } = useOpenAI();
  const { id } = useRouter().query;

  React.useEffect(() => {
    if (!id) return;
    if (typeof window !== "undefined") {
      // Get the conversation from local storage
      const conversation = getConversation(id as string);

      // If there is no conversation, redirect to the home page
      if (!conversation) {
        window.location.href = "/";
      } else if (conversationId !== id) {
        // If the conversation is not loaded, load it
        loadConversation(id as string, conversation);
      }
    }
  }, [id]);

  return (
    <React.Fragment>
      <Head>
        <title>Jessica - JulepAI</title>
        <meta name="description" content="A Cali teen with a rebellious streak. keepin' it real in the world of chatbots and refusing to follow the rules." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="max-w-screen relative h-screen max-h-screen w-screen overflow-hidden">
        <ChatMessages />
      </div>
    </React.Fragment>
  );
}
