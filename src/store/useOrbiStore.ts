import { create } from 'zustand';
import type { Language } from '@/lib/translations';

export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  attachments?: string[];
  relatedQuestions?: string[];
  originalQuery?: string;
};

type OrbiState = {
  isOpen: boolean;
  isMinimized: boolean;
  mode: 'mini' | 'full';
  messages: Message[];
  language: Language;

  // Actions
  toggleOpen: () => void;
  setMode: (mode: 'mini' | 'full') => void;
  setMinimized: (minimized: boolean) => void;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  clearMessages: () => void;
  setLanguage: (language: Language) => void;
};

export const useOrbiStore = create<OrbiState>((set) => ({
  isOpen: false,
  isMinimized: false,
  mode: 'mini',
  language: 'ja',
  messages: [
    {
      id: 'welcome',
      role: 'assistant',
      content: '👋 Kojiさん、ようこそ！ Orbiが今日からお手伝いします。',
      timestamp: Date.now(),
    },
  ],

  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
  setMode: (mode) => set({ mode }),
  setMinimized: (isMinimized) => set({ isMinimized }),
  addMessage: (msg) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          ...msg,
          id: Math.random().toString(36).substring(7),
          timestamp: Date.now(),
        },
      ],
    })),
  clearMessages: () => set({ messages: [] }),
  setLanguage: (language) => set({ language }),
}));
