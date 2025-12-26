import { PaywallModal, Typography } from "@/components";
import { db, expoDb } from "@/db";
import migrations from "@/drizzle/migrations";
import { initI18n } from "@/i18n";
import { persistor, store, useAppSelector } from "@/store";
import { MenuProvider } from "react-native-popup-menu";

import { RevenueCatProvider } from "@/services";
import { selectStartScreenShow } from "@/store/slices";
import { ThemeProvider, useTheme } from "@/theme";
import {
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
  useFonts,
} from "@expo-google-fonts/nunito";
import {
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
  Theme,
} from "@react-navigation/native";
import dayjs from "dayjs";
import "dayjs/locale/uk"; // Ukrainian locale for dayjs
import isoWeek from "dayjs/plugin/isoWeek";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import utc from "dayjs/plugin/utc";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import * as Notifications from "expo-notifications";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import i18n from "i18next";
import { useEffect, useMemo, useState } from "react";
import { I18nextProvider } from "react-i18next";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

// Configure dayjs plugins
dayjs.extend(utc);
dayjs.extend(isoWeek);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: false,
  }),
});

SplashScreen.setOptions({
  fade: true,
});

SplashScreen.preventAutoHideAsync();

const AppContent = () => {
  const { theme, isLoading } = useTheme();
  const { error } = useMigrations(db, migrations);
  const [isTransReady, setIsTransReady] = useState(false);
  const showStartScreen = useAppSelector(selectStartScreenShow);
  let [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
  });

  useDrizzleStudio(expoDb);

  const loaded = useMemo(() => {
    return !isLoading && isTransReady && fontsLoaded;
  }, [isLoading, isTransReady, fontsLoaded]);

  useEffect(() => {
    initI18n().then(() => setIsTransReady(true));
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

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

  // TODO: Better error handling UI
  if (error) {
    return (
      <View>
        <Typography variant="h4" color="error">
          Migration Error
        </Typography>
        <Typography variant="body">
          An error occurred during database migrations: {error.message}
        </Typography>
      </View>
    );
  }

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <I18nextProvider i18n={i18n}>
        <StatusBar style={theme.statusBar} />
        <MenuProvider>
          <NavigationThemeProvider value={navigationTheme}>
            <Stack
              screenOptions={{
                headerBackButtonDisplayMode: "minimal",
                headerShown: false,
              }}
            >
              <Stack.Protected guard={showStartScreen}>
                <Stack.Screen name="start" />
              </Stack.Protected>

              <Stack.Protected guard={!showStartScreen}>
                <Stack.Screen name="(tabs)" />
              </Stack.Protected>
            </Stack>
            <PaywallModal />
          </NavigationThemeProvider>
        </MenuProvider>
      </I18nextProvider>
    </GestureHandlerRootView>
  );
};

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RevenueCatProvider>
          <ThemeProvider>
            <AppContent />
          </ThemeProvider>
        </RevenueCatProvider>
      </PersistGate>
    </Provider>
  );
}
