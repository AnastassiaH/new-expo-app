import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from '@/locales/en.json';
import uk from '@/locales/uk.json';

const resources = {
  en: { translation: en },
  uk: { translation: uk },
};

export const initI18n = async (lng: string) => {
  await i18n
    .use(initReactI18next)
    .init({
      compatibilityJSON: 'v4',
      lng,
      fallbackLng: 'en',
      resources,
      interpolation: { escapeValue: false },
    });
};

export default i18n;
