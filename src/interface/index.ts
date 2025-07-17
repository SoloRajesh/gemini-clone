export interface Message {
  sender: "user" | "ai";
  text: string;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
}

export interface ContextType {
  onSentMessage: (prompt: string) => void;
  input: string;
  setInput: (val: string) => void;
  isLoading: boolean;
  setIsLoading: (val: boolean) => void;
  chats: Chat[];
  setChats: (chats: Chat[]) => void;
  activeChatId: string | null;
  setActiveChatId: (id: string | null) => void;
  createNewChat: () => void;
}

export interface CountryApiResponse {
  name: { common: string };
  cca2: string;
  idd: {
    root?: string;
    suffixes?: string[];
  };
}
