import i18n from "i18next";
import { initReactI18next } from "react-i18next";
// import * as RNLocalize from 'react-native-localize';
import { APP_LANGUAGE_KEY } from "@/appConstants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjs from "dayjs";
import "dayjs/locale/uk";
import en from "./locales/en.json";
import ua from "./locales/ua.json";

const resources = {
  en: { translation: en },
  ua: { translation: ua },
};

const loadLanguage = async () => {
  try {
    const savedLang = await AsyncStorage.getItem(APP_LANGUAGE_KEY);
    return savedLang || "en";
  } catch {
    return "en";
  }
};

// const fallback = { languageTag: 'en', isRTL: false };
// const { languageTag } =
//   RNLocalize.findBestAvailableLanguage(Object.keys(resources)) || fallback;

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

export const setAppLanguage = async (lang: string) => {
  await AsyncStorage.setItem(APP_LANGUAGE_KEY, lang);
  i18n.changeLanguage(lang);
  // Update dayjs locale when language changes
  dayjs.locale(lang === "ua" ? "uk" : "en");
};
