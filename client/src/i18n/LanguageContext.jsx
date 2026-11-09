import React, { createContext, useContext, useState, useEffect } from "react";
import { translations, languages } from "./translations";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem("qc_app_language") || "en";
  });

  const setLanguage = (langCode) => {
    setLanguageState(langCode);
    localStorage.setItem("qc_app_language", langCode);
    document.body.setAttribute("data-lang", langCode);
  };

  useEffect(() => {
    document.body.setAttribute("data-lang", language);
  }, [language]);

  // Translate helper with template string replacement (e.g. {{count}})
  const t = (key, params = {}) => {
    const langDict = translations[language] || translations.en;
    let text = langDict[key] || translations.en[key] || key;

    Object.keys(params).forEach((paramKey) => {
      text = text.replace(new RegExp(`{{${paramKey}}}`, "g"), params[paramKey]);
    });

    return text;
  };

  // Helper to extract localized name from model object { en, ta, hi, or }
  const getLocalizedName = (nameObj, fallback = "") => {
    if (!nameObj) return fallback;
    if (typeof nameObj === "string") return nameObj;
    return nameObj[language] || nameObj.en || fallback;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, getLocalizedName, languages }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return context;
};

