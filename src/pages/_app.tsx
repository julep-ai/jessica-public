import { AuthProvider } from "@/context/AuthProvider";
import OpenAIProvider from "@/context/OpenAIProvider";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Analytics } from "@vercel/analytics/react";
import { getHistory } from "@/utils/History";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const [providerReady, setProviderReady] = useState(false);
  const router = useRouter();
  if (typeof window !== "undefined") {
    const isDarkSet = localStorage.theme === "dark";
    const isThemeStored = "theme" in localStorage;
    const isDarkPrefered = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (isDarkSet || (!isThemeStored && isDarkPrefered)) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }
  useEffect(() => {
    const history = getHistory();
    if (history && Object.keys(history).length > 0) {
      const firstId = Object.keys(history)[0];
      router.push(`/chat/${firstId}`);
    }
  }, [providerReady]);

  return (
    <>
      <AuthProvider>
        <OpenAIProvider onReady={() => setProviderReady(true)}>
          <Component {...pageProps} />
        </OpenAIProvider>
      </AuthProvider>
      <Analytics />
    </>
  );
}
