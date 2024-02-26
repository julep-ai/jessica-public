import React, { PropsWithChildren } from "react";
import {
  clearHistory,
  Conversation,
  getHistory,
  storeConversation,
  History,
  deleteConversationFromHistory,
  updateConversation,
} from "@/utils/History";


const PlaygroundContext = React.createContext<{
  showConversations: boolean;
  setShowConversations: (show: boolean) => void;
  toggleShowConversations: () => void;
}>({
  showConversations: false,
  setShowConversations: (show: boolean) => {},
  toggleShowConversations: () => {},
});

export default function PlaygroundProvider(props: PropsWithChildren) {
  const [showConversations, setShowConversations] = React.useState(false);
  const [userId_, setUserId] = React.useState<string | undefined>(undefined);
  const [agentId_, setAgentId] = React.useState<string | undefined>(undefined);
  const [sessionId_, setSessionId] = React.useState<string | undefined>(
    undefined
  );

  const history = getHistory();
  console.log(history)
  const toggleShowConversations = () => {
    setShowConversations(!showConversations);
  };

  const value = React.useMemo(
    () => ({
      showConversations,
      setShowConversations,
      toggleShowConversations,
    }),
    [showConversations]
  );

  return <PlaygroundContext.Provider {...props} value={value} />;
}

export const usePlayground = () => React.useContext(PlaygroundContext);
