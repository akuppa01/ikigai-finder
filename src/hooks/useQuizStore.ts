'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { QuizState, QuizResponse } from '@/lib/types';

interface QuizStore extends QuizState {
  // Actions
  setResponse: (question: keyof QuizResponse, value: string | number) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  goToQuestion: (index: number) => void;
  completeQuiz: () => void;
  resetQuiz: () => void;
}

const initialResponses: Partial<QuizResponse> = {};

export const useQuizStore = create<QuizStore>()(
  persist(
    (set, get) => ({
      currentQuestion: 0,
      responses: initialResponses,
      isComplete: false,

      setResponse: (question: keyof QuizResponse, value: string | number) => {
        set(state => ({
          responses: {
            ...state.responses,
            [question]: value,
          },
        }));
      },

      nextQuestion: () => {
        const state = get();
        if (state.currentQuestion < 7) {
          // 8 questions total (0-7)
          set({ currentQuestion: state.currentQuestion + 1 });
        }
      },

      previousQuestion: () => {
        const state = get();
        if (state.currentQuestion > 0) {
          set({ currentQuestion: state.currentQuestion - 1 });
        }
      },

      goToQuestion: (index: number) => {
        if (index >= 0 && index <= 7) {
          set({ currentQuestion: index });
        }
      },

      completeQuiz: () => {
        set({ isComplete: true });
      },

      resetQuiz: () => {
        set({
          currentQuestion: 0,
          responses: initialResponses,
          isComplete: false,
        });
      },
    }),
    {
      name: 'ikigai-quiz-storage',
      partialize: state => ({
        currentQuestion: state.currentQuestion,
        responses: state.responses,
        isComplete: state.isComplete,
      }),
    }
  )
);
