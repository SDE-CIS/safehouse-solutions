import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from 'i18next-browser-languagedetector';
import {store} from "@/app/store.ts";

const getInitialLanguage = () => {
    const reduxLanguage = store.getState().languageSlice?.language;
    return reduxLanguage || 'en';
};

i18n
    .use(Backend) // Enables loading translation files via HTTP
    .use(LanguageDetector) // Detects language from browser settings, cookies, etc.
    .use(initReactI18next) // Passes i18n down to react-i18next
    .init({
        lng: getInitialLanguage(), // Initialize with the selected language
        fallbackLng: "en", // Fallback language if the selected one is not available
        debug: false, // Enable debug logs for troubleshooting

        interpolation: {
            escapeValue: false // React already safes from XSS
        }
    });

export default i18n;
