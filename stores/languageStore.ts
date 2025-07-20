import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import i18n from '../lib/i18n';

export type Language = 'en' | 'uk';

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
}

interface LanguageState {
  language: Language;
  selectorVisible: boolean;
  setLanguage: (lang: Language) => void;
  setSelectorVisible: (visible: boolean) => void;
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська' },
];

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: i18n.language as Language,
      selectorVisible: false,
      setLanguage: (lang) => {
        i18n.changeLanguage(lang);
        set({ language: lang });
      },
      setSelectorVisible: (visible) => set({ selectorVisible: visible }),
    }),
    {
      name: 'language-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        language: state.language,
      }),
    }
  )
);
