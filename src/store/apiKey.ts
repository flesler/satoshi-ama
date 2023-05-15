import store from "store2"
import { create } from "zustand"

interface UseApiKeyProps {
  apiKey: string | undefined,
  setAPIKey: (key: string | undefined) => void
  clearAPIKey: () => void
};

const initialApiState = import.meta.env.VITE_CHATGPT_SECRET_KEY || store.local('@apikey') || undefined;

export const useApiKey = create<UseApiKeyProps>((set, get) => ({
  apiKey: initialApiState,
  setAPIKey: (key) => {
    store.local('@apikey', key)
    set({ apiKey: key })
  },
  clearAPIKey: () => get().setAPIKey(undefined)
}));