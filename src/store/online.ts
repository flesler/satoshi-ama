import api from '@/services/api'
import { create } from "zustand"

export interface UseOnlineProps {
  isOnline?: boolean | null,
  setOnline: (isOnline: boolean | null) => void
  checkOnline: () => void
};

export const useOnline = create<UseOnlineProps>((set, get) => ({
  setOnline(isOnline) {
    set({ isOnline })
  },
  checkOnline() {
    const { isOnline, setOnline } = get()
    if (isOnline === null) {
      // Prevent multiple requests
      return
    }
    setOnline(null)
    api.get('/health')
      .then(() => setOnline(true))
      .catch(() => setOnline(false))
  }
}))
