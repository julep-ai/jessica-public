import { useOpenAI } from "@/context/OpenAIProvider";
import { OpenAIChatMessage } from "@/utils/OpenAI";
import React from "react";
import { MdPerson, MdSmartToy } from "react-icons/md";
import AssistantMessageContent from "./AssistantMessageContent";
import UserMessageContent from "./UserMessageContent";
import UserIcon from "./UserIcon";
import Image from "next/image";

type Props = {
  message: OpenAIChatMessage;
};

export default function ChatMessage({ message: { id, role, content } }: Props) {
  const [hover, setHover] = React.useState(false);

  return (
    <div
      className={`flex flex-row items-center border-b border-[#242424] p-4 transition-all`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="max-w-screen relative mx-auto flex w-full max-w-4xl flex-row items-center">
        <div
          className={`sticky top-0 my-4 mr-2 flex-none h-10 w-10 items-center justify-center self-start text-4xl transition-colors ${
            hover ? "text-stone-300" : "text-primary/20"
          }`}
        >
          {role === "user" ? (
            <UserIcon />
          ) : (
            <Image
              src="/bored-circle.png"
              alt="Jessica Circle Icon"
              width={40}
              height={40}
            />
          )}
        </div>
        <div className="overflow-x-auto flex">
          <div className="text-md prose w-full max-w-4xl rounded p-4 text-primary dark:prose-invert prose-code:text-primary prose-pre:bg-transparent prose-pre:p-0">
            {role === "user" ? (
              <UserMessageContent content={content} />
            ) : (
              <AssistantMessageContent content={content} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
