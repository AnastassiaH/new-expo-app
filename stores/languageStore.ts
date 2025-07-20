import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import i18n from '../lib/i18n';

export type Language = 'en' | 'uk';

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist((set) => ({
    language: i18n.language as Language,
    setLanguage: (lang) => {
      i18n.changeLanguage(lang);
      set({ language: lang });
    },
  }),
    {
      name: 'language-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        language: state.language,
      }),
    }
  )
)
