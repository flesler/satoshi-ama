import api from '@/services/api'
import store from "store2"
import { create } from "zustand"

export interface UseQuestionsProps {
  questions: string[],
  setQuestions: (questions: string[]) => void
  askedQuestion: (question: string) => void
  loadQuestions: () => void
};

const initialChatState = JSON.parse(store.local("@questions") || '[]');

export const useQuestions = create<UseQuestionsProps>((set, get) => ({
  questions: initialChatState,
  setQuestions(questions) {
    store.local('@questions', JSON.stringify(questions))
    set({ questions })
  },
  askedQuestion(question) {
    const { questions } = get()
    if (questions.includes(question)) {
      // Move to the end
      get().setQuestions([...questions.filter(q => q !== question), question])
    }
  },
  loadQuestions() {
    if (!get().questions.length) {
      set({ questions: ['Loading...'] })
      api.get('/questions').then(get().setQuestions)
    }
  }
}))
