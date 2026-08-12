import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import en from '../locales/en.js';
import hi from '../locales/hi.js';
import kn from '../locales/kn.js';

export const LANGUAGES = {
  en: { code: 'en', label: 'English', nativeLabel: 'English' },
  kn: { code: 'kn', label: 'Kannada', nativeLabel: 'ಕನ್ನಡ' },
  hi: { code: 'hi', label: 'Hindi', nativeLabel: 'हिंदी' },
};

const translations = { en, hi, kn };

const STORAGE_KEY = 'jme-language';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    if (typeof window === 'undefined') return 'en';
    return localStorage.getItem(STORAGE_KEY) || 'en';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const t = useCallback(
    (key) => {
      const parts = key.split('.');
      let val = translations[lang];
      for (const p of parts) {
        if (val == null) break;
        val = val[p];
      }
      if (val == null && lang !== 'en') {
        val = translations.en;
        for (const p of parts) {
          if (val == null) break;
          val = val[p];
        }
      }
      return typeof val === 'function' ? val : val ?? key;
    },
    [lang]
  );

  const tf = useCallback(
    (key, ...args) => {
      const val = t(key);
      return typeof val === 'function' ? val(...args) : val;
    },
    [t]
  );

  const value = { lang, setLang, t, tf };
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
