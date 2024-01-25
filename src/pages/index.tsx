import ChatMessages from "@/components/chat/ChatMessages";
import ChatSidebar from "@/components/chat/sidebar/ChatSidebar";
import Head from "next/head";
import Script from 'next/script'
import React, { useEffect } from "react";
import { useOpenAI } from "@/context/OpenAIProvider";
import ChatHeader from "@/components/chat/ChatHeader";
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
        {/* <ChatHeader /> */}
        <ChatMessages />
        {/* <ChatSidebar /> */}
      </div>

      <div className="container">
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} />
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
 
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
      </div>
    </React.Fragment>
  );
}
