import React, { createContext, useContext, ReactNode, useCallback, useEffect, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export interface Language {
    code: string;
    name: string;
    short: string;
    dir: 'ltr' | 'rtl';
}

export const languages: Language[] = [
    { code: 'fr', name: 'Français', short: 'FR', dir: 'ltr' },
    { code: 'en', name: 'English', short: 'EN', dir: 'ltr' },
    { code: 'ar', name: 'العربية', short: 'AR', dir: 'rtl' },
    { code: 'es', name: 'Español', short: 'ES', dir: 'ltr' },
    { code: 'de', name: 'Deutsch', short: 'DE', dir: 'ltr' },
    { code: 'tr', name: 'Türkçe', short: 'TR', dir: 'ltr' },
    { code: 'zh', name: '中文', short: 'ZH', dir: 'ltr' },
];

interface I18nContextType {
  language: Language;
  setLanguage: (langCode: string) => void;
  availableLanguages: Language[];
  t: (key: string, options?: { [key: string]: string | number }) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [languageCode, setLanguageCode] = useLocalStorage<string>('language', 'fr');
    const [translations, setTranslations] = useState<any>(null);

    const language = languages.find(l => l.code === languageCode) || languages[0];

    useEffect(() => {
        document.documentElement.lang = language.code;
        document.documentElement.dir = language.dir;
        
        const fetchTranslations = async () => {
            try {
                const res = await fetch(`./locales/${language.code}.json`);
                if (!res.ok) {
                    console.error(`Failed to load translations for ${language.code}, falling back to 'fr'`);
                    const fallbackRes = await fetch('./locales/fr.json');
                    setTranslations(await fallbackRes.json());
                    return;
                }
                const data = await res.json();
                setTranslations(data);
            } catch (error) {
                console.error("Error fetching translation file:", error);
                setTranslations({}); 
            }
        };

        fetchTranslations();
    }, [language]);

    const setLanguage = (langCode: string) => {
        setLanguageCode(langCode);
    };

    const t = useCallback((key: string, options?: { [key: string]: string | number }): string => {
        if (!translations) {
            return key;
        }
        
        const keys = key.split('.');
        let result: any = translations;
        for (const k of keys) {
            result = result?.[k];
        }

        if (typeof result !== 'string') {
            console.warn(`Translation key not found: ${key}`);
            return key;
        }

        if (options) {
            Object.keys(options).forEach(optKey => {
                result = result.replace(new RegExp(`{{${optKey}}}`, 'g'), String(options[optKey]));
            });
        }

        return result;
    }, [translations]);
    
    if (!translations) {
        return null;
    }

    const value = { language, setLanguage, availableLanguages: languages, t };

    return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = (): I18nContextType => {
    const context = useContext(I18nContext);
    if (context === undefined) {
        throw new Error('useI18n must be used within an I18nProvider');
    }
    return context;
};
