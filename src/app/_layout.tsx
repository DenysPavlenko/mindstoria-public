import { PaywallModal } from "@/components";
import { db, expoDb } from "@/db";
import migrations from "@/drizzle/migrations";
import { initI18n } from "@/i18n";
import { persistor, store, useAppDispatch } from "@/store";
import { setPremiumStatus } from "@/store/slices";
import { ThemeProvider, useTheme } from "@/theme";
import { Manrope_400Regular } from "@expo-google-fonts/manrope/400Regular";
import { Manrope_600SemiBold } from "@expo-google-fonts/manrope/600SemiBold";
import { Manrope_700Bold } from "@expo-google-fonts/manrope/700Bold";
import { useFonts } from "@expo-google-fonts/manrope/useFonts";
import {
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
  Theme,
} from "@react-navigation/native";
import dayjs from "dayjs";
import "dayjs/locale/uk"; // Ukrainian locale for dayjs
import utc from "dayjs/plugin/utc";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import i18n from "i18next";
import { useEffect, useMemo, useState } from "react";
import { I18nextProvider } from "react-i18next";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

// Configure dayjs plugins
dayjs.extend(utc);

const IS_DEV = __DEV__;

SplashScreen.setOptions({
  duration: 500,
  fade: true,
});

SplashScreen.preventAutoHideAsync();

const AppContent = () => {
  const dispatch = useAppDispatch();
  const { theme, isLoading } = useTheme();
  const { success } = useMigrations(db, migrations);
  const [isTransReady, setIsTransReady] = useState(false);
  let [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_600SemiBold,
    Manrope_700Bold,
  });

  useDrizzleStudio(expoDb);

  const loaded = useMemo(() => {
    return !isLoading && isTransReady && success && fontsLoaded;
  }, [isLoading, isTransReady, success, fontsLoaded]);

  useEffect(() => {
    initI18n().then(() => setIsTransReady(true));
  }, []);

  useEffect(() => {
    if (success && IS_DEV) {
      // clearAndSeedDatabase();
    }
  }, [success]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        // TODO: Replace with actual subscription service call
        // const isPremium = await SubscriptionService.checkPremiumStatus();
        // dispatch(setPremiumStatus(isPremium));
        // Dummy logic for now - set to false to test paywall
        dispatch(setPremiumStatus(true));
      } catch (error) {
        console.error("Failed to check subscription:", error);
        dispatch(setPremiumStatus(false));
      }
    };
    checkSubscription();
  }, [dispatch]);

  const navigationTheme: Theme = useMemo(
    () => ({
      ...DefaultTheme,
      dark: theme.mode === "dark",
      colors: {
        ...DefaultTheme.colors,
        primary: theme.colors.onBackground, // Header title color
        background: theme.colors.background,
        card: theme.colors.background,
        text: theme.colors.onBackground,
        border: theme.colors.outline,
        notification: theme.colors.primary,
      },
    }),
    [theme]
  );

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView>
      <I18nextProvider i18n={i18n}>
        <StatusBar style={theme.statusBar} />
        <NavigationThemeProvider value={navigationTheme}>
          <Stack
            screenOptions={{
              headerBackButtonDisplayMode: "minimal",
            }}
          />
          <PaywallModal />
        </NavigationThemeProvider>
      </I18nextProvider>
    </GestureHandlerRootView>
  );
};

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}
