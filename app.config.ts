import { ConfigContext, ExpoConfig } from "expo/config";

const APP_VARIANT = process.env.APP_VARIANT;
const IS_DEV = APP_VARIANT === "development";
const IS_PREVIEW = APP_VARIANT === "preview";

const getUniqueIdentifier = () => {
  if (IS_DEV) {
    return "com.mindstoria.app.dev";
  }
  if (IS_PREVIEW) {
    return "com.mindstoria.app.preview";
  }
  return "com.mindstoria.app";
};

const getAppName = () => {
  if (IS_DEV) {
    return "Mindstoria (Dev)";
  }
  if (IS_PREVIEW) {
    return "Mindstoria (Preview)";
  }
  return "Mindstoria";
};

export default ({ config }: ConfigContext): ExpoConfig => {
  return {
    ...config,
    name: getAppName(),
    slug: "mindstoria",
    version: "1.0.10",
    orientation: "portrait",
    icon: "./src/assets/images/icon.png",
    scheme: "mindstoria",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    platforms: ["ios", "android"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: getUniqueIdentifier(),
      icon: {
        dark: "./src/assets/images/ios-dark.png",
        light: "./src/assets/images/ios-light.png",
        tinted: "./src/assets/images/ios-tinted.png",
      },
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
        CFBundleLocalizations: ["en", "uk"],
        LSApplicationQueriesSchemes: ["mailto"],
      },
      config: {
        usesNonExemptEncryption: false,
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./src/assets/images/adaptive-icon.png",
        monochromeImage: "./src/assets/images/adaptive-icon.png",
        backgroundColor: "#F9F9FF",
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      package: getUniqueIdentifier(),
      blockedPermissions: ["android.permission.READ_PHONE_STATE"],
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./src/assets/images/splash-icon-dark.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#F9F9FF",
          dark: {
            image: "./src/assets/images/splash-icon-light.png",
            backgroundColor: "#111318",
          },
        },
      ],
      [
        "expo-sqlite",
        {
          enableFTS: true,
          useSQLCipher: true,
          android: {
            enableFTS: false,
            useSQLCipher: false,
          },
          ios: {
            customBuildFlags: [
              "-DSQLITE_ENABLE_DBSTAT_VTAB=1 -DSQLITE_ENABLE_SNAPSHOT=1",
            ],
          },
        },
      ],
      [
        "expo-notifications",
        {
          icon: "./src/assets/images/notifications-icon.png",
          color: "#ffffff",
          defaultChannel: "default",
        },
      ],
      ["expo-secure-store", { configureAndroidBackup: true }],
      "expo-localization",
      "expo-web-browser",
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
    extra: {
      router: {},
      APP_VARIANT: APP_VARIANT,
      mixpanelToken: process.env.EXPO_PUBLIC_MIXPANEL_PROJECT_TOKEN,
      eas: {
        projectId: "7c6015c0-d5e3-46b8-85ac-b567bd299cfd",
      },
    },
    runtimeVersion: {
      policy: "appVersion",
    },
    updates: {
      url: "https://u.expo.dev/7c6015c0-d5e3-46b8-85ac-b567bd299cfd",
    },
  };
};
