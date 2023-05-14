import store from "store2"
import { create } from "zustand"

interface UseAPIProps {
  api: string | undefined,
  setAPI: (key: string) => void
};

const initialApiState = import.meta.env.VITE_CHATGPT_SECRET_KEY || store.local('@apikey') || undefined;

export const useAPI = create<UseAPIProps>((set) => ({
  api: initialApiState,
  setAPI: async (key) => {
    store.local('@apikey', key)
    set({ api: key })
  }
}));