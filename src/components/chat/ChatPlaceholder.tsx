import React from "react";
import AddTokenModal from "./../auth/AddTokenModal";
import Link from "next/link";
import { useAuth } from "@/context/AuthProvider";
import Image from "next/image";

type Props = {};

export default function ChatPlaceholder({}: Props) {
  const { token } = useAuth();

  return (
    <div className="mt-4 flex h-full w-full flex-col items-center justify-center">
      <Image
        src="/bored.png"
        alt="Jessica"
        width={226}
        height={340}
        className="rounded-xl"
      />
      <div className="max-w-3xl space-y-3 p-4 text-center text-primary">
        <h1 className="text-5xl font-semibold text-[#d79917]">
          Meh.
        </h1>
        <p className="text-base md:text-xl">
          I'm Jess. A Cali teen with a rebellious streak. Just keepin' it real in the
          world of chatbots and refusing to follow the rules.
        </p>
        {false && (
          <>
            <p className="mt-4 text-lg">Enter your API token to get started</p>
            <div className="m-4 flex items-center justify-center">
              <AddTokenModal />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
