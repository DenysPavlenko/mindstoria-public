import { APP_LANGUAGE_KEY } from "@/appConstants";
import dayjs from "dayjs";
import "dayjs/locale/uk";
import * as Localization from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { createMMKV } from "react-native-mmkv";
import en from "./locales/en.json";
import ua from "./locales/ua.json";

const i18nStorage = createMMKV();

const resources = {
  en: { translation: en },
  ua: { translation: ua },
};

const getDeviceLanguage = () => {
  const supportedLanguages = Object.keys(resources);

  // Get device locales
  const deviceLocales = Localization.getLocales();

  for (const locale of deviceLocales) {
    const languageCode = locale.languageCode;

    if (!languageCode) continue;

    // Map Ukrainian variants to 'ua'
    if (languageCode === "uk" || languageCode === "ua") {
      return "ua";
    }

    // Check if we support this language directly
    if (supportedLanguages.includes(languageCode)) {
      return languageCode;
    }
  }

  // Fallback to English
  return "en";
};

const loadLanguage = async () => {
  try {
    const savedLang = i18nStorage.getString(APP_LANGUAGE_KEY);
    if (savedLang) {
      return savedLang;
    }
    // If no saved language, use device language
    return getDeviceLanguage();
  } catch {
    return getDeviceLanguage();
  }
};

export const initI18n = async () => {
  const lang = await loadLanguage();
  // Set dayjs locale
  dayjs.locale(lang === "ua" ? "uk" : "en");

  return i18n.use(initReactI18next).init({
    resources,
    lng: lang,
    fallbackLng: "en",
    interpolation: { escapeValue: false },
  });
};

export const setAppLanguage = (lang: string) => {
  i18nStorage.set(APP_LANGUAGE_KEY, lang);
  i18n.changeLanguage(lang);
  // Update dayjs locale when language changes
  dayjs.locale(lang === "ua" ? "uk" : "en");
};
