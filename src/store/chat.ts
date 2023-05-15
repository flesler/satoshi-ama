import store from "store2"
import { v4 } from 'uuid'
import { create } from "zustand"

export interface UseChatProps {
  chat: Chat[],
  selectedChat: Chat | undefined,
  setChat: (payload: Chat) => void,
  addChat: (callback?: (id: string) => void) => void,
  addMessage: (id: string, action: ChatContent) => void,
  setSelectedChat: (payload: { id: string }) => void,
  removeChat: (pyload: { id: string }) => void,
  clearAll: () => void,
  getTitle: (chat: Chat) => string,
};

type Chat = {
  id: string,
  content: ChatContent[]
};

export type ChatContent = {
  emitter: "gpt" | "user" | "error",
  message: string
  hallucination?: boolean
  isNew?: boolean
};

const initialChatState: Chat[] = store.local("@chat") || [];

export const useChat = create<UseChatProps>((set, get) => ({
  chat: initialChatState,
  selectedChat: initialChatState[0],
  setChat: async (payload) => set(({ chat }) => ({ chat: [...chat, payload] })),
  addChat: async (callback) => {
    const hasNewChat = get().chat.find(({ content }) => (content.length === 0));

    if (!hasNewChat) {
      const id = v4()
      get().setChat({ id: id, content: [] });
      get().setSelectedChat({ id });
      if (callback) callback(id);
    } else {
      const { id } = hasNewChat;
      get().setSelectedChat({ id });
      if (callback) callback(id);
    };
  },
  addMessage: async (id, action) => set(({ chat }) => {
    const selectedChat = chat.findIndex((query) => (query.id === id)),
      props = chat[selectedChat];

    if (selectedChat > -1) {
      action.message = action.message.trim()
      chat[selectedChat] = { ...props, content: [...props['content'], action] }
      return ({ chat, selectedChat: chat[selectedChat] });
    };

    return ({});
  }),
  setSelectedChat: async (payload) => set(({ chat }) => {
    const selectedChat = chat.find(({ id }) => id === payload.id);
    return ({ selectedChat })
  }),
  removeChat: async (payload) => set(({ chat }) => {
    const newChat = chat.filter(({ id }) => id !== payload.id);
    return ({ chat: newChat });
  }),
  clearAll: async () => set({ chat: [], selectedChat: undefined }),
  getTitle: (chat) => chat.content.find(m => m.emitter === 'user')?.message || 'New chat',
}))
