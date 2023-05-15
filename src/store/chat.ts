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
};

type Chat = {
  id: string,
  role: string,
  content: ChatContent[]
};

type ChatContent = {
  emitter: ChatContentEmmiter,
  message: string
  hallucination?: boolean
};

type ChatContentEmmiter = "gpt" | "user" | "error";

const savedChats = store.local("@chat");
const getSafeSavedChats = () => {
  if (Array.isArray(savedChats) && savedChats.length > 0) {
    return savedChats;
  };

  return undefined;
};

const initialChatState: Chat[] = getSafeSavedChats() || [
  // {
  //   id: '1',
  //   role: 'About this website',
  //   content: [
  //     {
  //       emitter: "user",
  //       message: "What website is this?"
  //     },
  //     {
  //       emitter: "gpt",
  //       message: "This website is a clone of the ChatGPT website interface created by @WesleyMaik.\n\nYou can also send commands to the original site, with the help of the official ChatGPT API."
  //     }
  //   ],
  // },
];

export const useChat = create<UseChatProps>((set, get) => ({
  chat: initialChatState,
  selectedChat: initialChatState[0],
  setChat: async (payload) => set(({ chat }) => ({ chat: [...chat, payload] })),
  addChat: async (callback) => {
    const hasNewChat = get().chat.find(({ content }) => (content.length === 0));

    if (!hasNewChat) {
      const id = v4()
      get().setChat({
        role: "New chat",
        id: id,
        content: []
      });
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
      const first = props['content'].find(m => m.emitter === 'user')
      if (first) {
        // Automatically set question as title
        props.role = first.message
      }
      chat[selectedChat] = { ...props, content: [...props['content'], action] }
      return ({ chat, selectedChat: chat[selectedChat] });
    };

    return ({});
  }),
  setSelectedChat: async (payload) => set(({ chat }) => {
    const selectedChat = chat.find(({ id }) => id === payload.id);
    return ({ selectedChat: selectedChat })
  }),
  removeChat: async (payload) => set(({ chat }) => {
    const newChat = chat.filter(({ id }) => id !== payload.id);
    return ({ chat: newChat });
  }),
  clearAll: async () => set({ chat: [], selectedChat: undefined })
}))
