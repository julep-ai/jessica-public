import { v4 as uuid } from "uuid";
import secureLocalStorage from "react-secure-storage";

import {
  clearHistory,
  Conversation,
  getHistory,
  storeConversation,
  History,
  deleteConversationFromHistory,
  updateConversation,
} from "@/utils/History";
import {
  defaultConfig,
  OpenAIChatMessage,
  OpenAIConfig,
  OpenAISystemMessage,
  OpenAIChatModels,
  JulepAIChatMessageRole,
} from "@/utils/OpenAI";
import React, {
  PropsWithChildren,
  ReactNode,
  useCallback,
  useEffect,
} from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthProvider";
import { JessicaPrompt } from "@/context/prompts";

export const runtime = "nodejs";

const CHAT_ROUTE = "/";

type UserName = {
  id: string;
  name: string;
};

interface OpenAIProviderProps {
  children?: ReactNode;
  onReady: () => void;
}

const defaultContext = {
  systemMessage: {
    role: "system",
    name: "situation",
    content: JessicaPrompt,
  } as OpenAISystemMessage,
  messages: [] as OpenAIChatMessage[],
  config: defaultConfig as OpenAIConfig,
  updateSystemMessage: (content: string) => {},
  addMessage: () => {},
  removeMessage: (id: number) => {},
  conversationName: "",
  conversationId: "",
  deleteConversation: () => {},
  updateConversationName: () => {},
  conversations: {} as History,
  clearConversations: () => {},
  clearConversation: () => {},
  loadConversation: (id: string, conversation: Conversation) => {},
  updateMessageRole: (id: number, role: JulepAIChatMessageRole) => {},
  updateMessageName: (id: number, name: string) => {},
  updateMessageContent: (id: number, content: string) => {},
  updateConfig: (newConfig: Partial<OpenAIConfig>) => {},
  submit: () => {},
  loading: true,
  error: "",
};

const OpenAIContext = React.createContext<{
  systemMessage: OpenAISystemMessage;
  messages: OpenAIChatMessage[];
  config: OpenAIConfig;
  updateSystemMessage: (content: string) => void;
  addMessage: (
    content?: string,
    submit?: boolean,
    role?: JulepAIChatMessageRole,
    name?: string | "situation" | "thought" | "information"
  ) => void;
  removeMessage: (id: number) => void;
  conversationName: string;
  conversationId: string;
  deleteConversation: (id: string) => void;
  updateConversationName: (id: string, name: string) => void;
  conversations: History;
  clearConversation: () => void;
  clearConversations: () => void;
  loadConversation: (id: string, conversation: Conversation) => void;
  updateMessageRole: (id: number, role: JulepAIChatMessageRole) => void;
  updateMessageName: (id: number, name: string) => void;
  updateMessageContent: (id: number, content: string) => void;
  updateConfig: (newConfig: Partial<OpenAIConfig>) => void;
  submit: () => void;
  loading: boolean;
  error: string;
}>(defaultContext);

export default function OpenAIProvider({
  children,
  onReady,
}: OpenAIProviderProps) {
  const { token } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  // Conversation state
  const [conversations, setConversations] = React.useState<History>(
    {} as History
  );
  const [conversationId, setConversationId] = React.useState<string>("");
  const [conversationName, setConversationName] = React.useState("");
  const [systemMessage, setSystemMessage] = React.useState<OpenAISystemMessage>(
    defaultContext.systemMessage
  );
  const [config, setConfig] = React.useState<OpenAIConfig>(defaultConfig);
  const [messages, setMessages] = React.useState<OpenAIChatMessage[]>([]);
  const [userId_, setUserId] = React.useState<string | undefined>(undefined);
  const [agentId_, setAgentId] = React.useState<string | undefined>(undefined);
  const [sessionId_, setSessionId] = React.useState<string | undefined>(
    undefined
  );

  const initialized = React.useRef(false);

  // Load conversation from local storage
  useEffect(() => {
    setConversations(getHistory());
  }, []);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    setLoading(true);

    const userId = secureLocalStorage.getItem("user-id") as string;
    const agentId = process.env.NEXT_PUBLIC_AGENT_ID as string;
    const sessionId = secureLocalStorage.getItem("session-id") as string;

    if (agentId) {
      setAgentId(agentId);
    }

    if (userId) {
      handleExistingUser(userId);
      if (sessionId) {
        handleExistingSession(sessionId);
        setLoading(false);
      } else {
        handleNewSession(agentId, userId).then(() => {
          setLoading(false);
        });
      }
    } else {
      handleNewUser(agentId).then(() => {
        setLoading(false);
      });
    }
  }, []);

  const handleExistingUser = (userId: string) => {
    setUserId(userId);
    onReady();
  };

  const handleNewUser = (agentId: string) => {
    return fetch("/api/createUser", {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => {
        setUserId(data.id);
        secureLocalStorage.setItem("user-id", data.id);
        handleNewSession(agentId, data.id);
      })
      .catch((err) => console.error(err));
  };

  const handleExistingSession = (sessionId: string) => {
    setSessionId(sessionId);
  };

  const handleNewSession = (agentId: string, userId: string) => {
    return fetch("/api/createSession", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ agentId, userId, situation: JessicaPrompt }),
    })
      .then((res) => res.json())
      .then((data) => {
        setSessionId(data.id);
        secureLocalStorage.setItem("session-id", data.id);
      });
  };

  const updateSystemMessage = (content: string) => {
    setSystemMessage({
      role: "system",
      name: "situation",
      content,
    });
  };

  const removeMessage = (id: number) => {
    setMessages((prev) => {
      return [...prev.filter((message) => message.id !== id)];
    });
  };

  const updateMessageRole = (id: number, role: JulepAIChatMessageRole) => {
    setMessages((prev) => {
      const index = prev.findIndex((message) => message.id === id);
      if (index === -1) return prev;
      const message = prev[index];
      return [
        ...prev.slice(0, index),
        {
          ...message,
          role,
        },
        ...prev.slice(index + 1),
      ];
    });
  };

  const updateMessageName = (id: number, name: string) => {
    setMessages((prev) => {
      const index = prev.findIndex((message) => message.id === id);
      if (index === -1) return prev;
      const message = prev[index];
      return [
        ...prev.slice(0, index),
        {
          ...message,
          name,
        },
        ...prev.slice(index + 1),
      ];
    });
  };

  const updateConfig = (newConfig: Partial<OpenAIConfig>) => {
    setConfig((prev) => {
      // If model changes set max tokens to half of the model's max tokens
      if (newConfig.model && newConfig.model !== prev.model) {
        newConfig.max_tokens = Math.floor(
          OpenAIChatModels[newConfig.model].maxLimit / 2
        );
      }

      return {
        ...prev,
        ...newConfig,
      };
    });
  };

  const updateMessageContent = (id: number, content: string) => {
    setMessages((prev) => {
      const index = prev.findIndex((message) => message.id === id);
      if (index === -1) return prev;
      const message = prev[index];
      return [
        ...prev.slice(0, index),
        {
          ...message,
          content,
        },
        ...prev.slice(index + 1),
      ];
    });
  };

  const handleStoreConversation = useCallback(() => {
    if (messages.length === 0) return;

    const conversation = {
      name: conversationName,
      systemMessage,
      messages,
      config,
      lastMessage: Date.now(),
    } as Conversation;

    let id = storeConversation(conversationId, conversation);
    setConversationId(id);
    setConversations((prev) => ({ ...prev, [id]: conversation }));

    if (router.pathname === CHAT_ROUTE) router.push(`/chat/${id}`);
  }, [conversationId, messages]);

  useEffect(() => {
    handleStoreConversation();
  }, [messages, systemMessage, config]);

  const loadConversation = (id: string, conversation: Conversation) => {
    setConversationId(id);

    const { systemMessage, messages, config, name } = conversation;

    setSystemMessage(systemMessage);
    setMessages(messages);
    updateConfig(config);
    setConversationName(name);
  };

  const clearConversations = useCallback(() => {
    clearHistory();

    setMessages([]);
    setConversationId("");
    setConversations({});

    router.push("/");
  }, []);

  const clearConversation = () => {
    setMessages([]);
    setSystemMessage(defaultContext.systemMessage);
    setConversationId("");
  };

  const deleteConversation = (id: string) => {
    deleteConversationFromHistory(id);
    setConversations((prev) => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });

    if (id === conversationId) clearConversation();
  };

  const updateConversationName = (id: string, name: string) => {
    setConversations((prev) => {
      const conversation = prev[id];
      if (!conversation) return prev;
      return {
        ...prev,
        [id]: {
          ...conversation,
          name,
        },
      };
    });

    if (id === conversationId) setConversationName(name);

    updateConversation(id, { name });
  };

  const submit = async (messages_: OpenAIChatMessage[] = []) => {
    if (loading) return;
    setLoading(true);
    messages_ = messages_.length ? messages_ : messages;

    const contentEmpty = messages_.some(
      (message) => message.content.trim() === ""
    );

    if (contentEmpty) {
      setLoading(false);
      return;
    }

    try {
      const messages = [systemMessage, ...messages_].map(
        ({ role, content, name }) => ({
          role,
          content,
          name,
        })
      );

      const response = await fetch("/api/completion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...config,
          session_id: sessionId_,
          messages,
        }),
      });

      if (!response.ok) {
        // Get the error message from the response body
        const error = await response.json();

        throw new Error(
          error?.message ||
            "Failed to fetch response, check your API key and try again."
        );
      }

      const data = await response.json();

      const message = data.response[0][0];

      const newMessage = {
        ...message,
        id: uuid(),
        name: "Jessica",
      } as OpenAIChatMessage;

      setMessages((prev) => {
        message.id = uuid();
        return [...prev, newMessage];
      });
    } catch (error: any) {
      setLoading(false);
      console.error(error);
      throw new Error(error.message);
    }

    setLoading(false);
  };

  const addMessage = useCallback(
    (
      content: string = "",
      submit_: boolean = false,
      role: "user" | "assistant" = "user",
      name: string
    ) => {
      setMessages((prev) => {
        const messages = [
          ...prev,
          {
            id: prev.length,
            role,
            content: content || "",
          } as OpenAIChatMessage,
        ];
        submit_ && submit(messages);
        return messages;
      });
    },
    [submit]
  );

  const value = React.useMemo(
    () => ({
      systemMessage,
      messages,
      config,
      loading,
      updateSystemMessage,
      addMessage,
      removeMessage,
      conversationId,
      conversationName,
      updateConversationName,
      deleteConversation,
      loadConversation,
      clearConversation,
      conversations,
      clearConversations,
      updateMessageRole,
      updateMessageName,
      updateMessageContent,
      updateConfig,
      submit,
      error,
    }),
    [
      systemMessage,
      messages,
      config,
      loading,
      addMessage,
      submit,
      conversationId,
      conversations,
      clearConversations,
      error,
    ]
  );

  return (
    // @ts-ignore
    <OpenAIContext.Provider value={value}>{children}</OpenAIContext.Provider>
  );
}

export const useOpenAI = () => React.useContext(OpenAIContext);
