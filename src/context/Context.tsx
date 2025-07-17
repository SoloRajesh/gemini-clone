import { useState, type ReactNode } from "react";
import GeminiChat from "../gemini/gemini";
import type { Chat, ContextType, Message } from "../interface";
import { Context } from "./AppContext";
import { marked } from "marked";

interface Props {
  children: ReactNode;
}

const createEmptyChat = (): Chat => ({
  id: crypto.randomUUID(),
  title: "NewChat",
  messages: [],
});

const ContextProvider = ({ children }: Props) => {
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [chats, setChats] = useState<Chat[]>([createEmptyChat()]);
  const [activeChatId, setActiveChatId] = useState<string | null>(
    chats[0]?.id || null
  );

  const createNewChat = () => {
    const newChat = createEmptyChat();
    const curChat = chats.some((item) => item.messages.length < 1);
    if (curChat) return;
    setChats((prev) => [newChat, ...prev]);
    setActiveChatId(newChat.id);
  };

  const onSentMessage = async (prompt: string) => {
    if (!activeChatId) return;

    const userMessage: Message = { sender: "user", text: prompt };
    setInput("");

    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === activeChatId
          ? {
              ...chat,
              title: chat.title === "NewChat" ? prompt : chat.title,
              messages: [...chat.messages, userMessage],
            }
          : chat
      )
    );

    setIsLoading(true);

    const aiResponse = await GeminiChat(prompt);

    const html = marked.parse(aiResponse);

    const botMessage: Message = { sender: "ai", text: html.toString() };

    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === activeChatId
          ? { ...chat, messages: [...chat.messages, botMessage] }
          : chat
      )
    );

    setIsLoading(false);
  };

  console.log(chats, "chats");

  const contextValue: ContextType = {
    onSentMessage,
    input,
    setInput,
    isLoading,
    setIsLoading,
    chats,
    setChats,
    activeChatId,
    setActiveChatId,
    createNewChat,
  };

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};

export default ContextProvider;
