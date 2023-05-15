import api from '@/services/api'
import store from "store2"
import { create } from "zustand"

export interface UseQuestionsProps {
  questions: string[],
  load: () => void
};

const initialChatState = JSON.parse(store.local("@questions") || '[]');

export const useQuestions = create<UseQuestionsProps>((set, get) => ({
  questions: initialChatState,
  load() {
    if (!get().questions.length) {
      set({ questions: ['Loading...'] })
      api.get('/questions').then((questions: string[]) => {
        store.local('@questions', JSON.stringify(questions))
        set({ questions })
      })
    }
  }
}))
