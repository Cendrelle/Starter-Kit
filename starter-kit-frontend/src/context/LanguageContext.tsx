import React, { createContext, useContext, useMemo } from 'react';
import { Language } from '@/utils/frontendStore';
import { useFrontendStore } from '@/hooks/useFrontendStore';
import { TranslationKey, tx } from '@/locales';

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  tx: (key: TranslationKey) => string;
  tr: (frText: string, enText: string) => string;
  isEn: boolean;
}

const LanguageContext = createContext<LanguageContextValue>({
  language: 'fr',
  setLanguage: () => {},
  tx: (key) => key,
  tr: (frText) => frText,
  isEn: false,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { store, patchStore } = useFrontendStore();

  const value = useMemo<LanguageContextValue>(() => {
    return {
      language: store.language,
      isEn: store.language === 'en',
      setLanguage: (language) =>
        patchStore((prev) => ({
          ...prev,
          language,
        })),
      tx: (key) => tx(store.language, key),
      tr: (frText, enText) => (store.language === 'en' ? enText : frText),
    };
  }, [store.language, patchStore]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => useContext(LanguageContext);
