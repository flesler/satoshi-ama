import store from "store2"
import { create } from "zustand"

interface UseAPIProps {
  apiKey: string | undefined,
  setAPIKey: (key: string) => void
};

const initialApiState = import.meta.env.VITE_CHATGPT_SECRET_KEY || store.local('@apikey') || undefined;

export const useAPI = create<UseAPIProps>((set) => ({
  apiKey: initialApiState,
  setAPIKey: async (key) => {
    store.local('@apikey', key)
    set({ apiKey: key })
  }
}));