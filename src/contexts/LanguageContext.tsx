import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { translations, Language, TranslationKeys } from "@/lib/translations";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof TranslationKeys) => string;
  isNepali: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("cankavre-language");
    return (saved as Language) || "en";
  });

  useEffect(() => {
    localStorage.setItem("cankavre-language", language);
  }, [language]);

  const t = (key: keyof TranslationKeys): string => {
    return translations[language][key] || key;
  };

  const isNepali = language === "ne";

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isNepali }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
