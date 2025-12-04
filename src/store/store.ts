import { configureStore } from "@reduxjs/toolkit";
import { createMMKV } from "react-native-mmkv";
import devToolsEnhancer from "redux-devtools-expo-dev-plugin";
import { persistReducer, persistStore, Storage } from "redux-persist";
import cbtLogsReducer from "./slices/cbtLogs/cbtLogsSlice";
import emotionDefinitionsReducer from "./slices/emotionDefinitions/emotionDefinitionsSlice";
import impactDefinitionsReducer from "./slices/impactDefinitions/impactDefinitionsSlice";
import logMetricsReducer from "./slices/logMetrics/logMetricsSlice";
import logsReducer from "./slices/logs/logsSlice";
import medicationsReducer from "./slices/medications/medicationsSlice";
import medLogsReducer from "./slices/medLogs/medLogsSlice";
import settingsReducer from "./slices/settings/settingsSlice";
import sleepLogsReducer from "./slices/sleepLogs/sleepLogsSlice";
import uiSliceReducer from "./slices/ui/uiSlice";

const storage = createMMKV();

export const reduxStorage: Storage = {
  setItem: (key, value) => {
    storage.set(key, value);
    return Promise.resolve(true);
  },
  getItem: (key) => {
    const value = storage.getString(key);
    return Promise.resolve(value);
  },
  removeItem: (key) => {
    storage.remove(key);
    return Promise.resolve();
  },
};

// Persist config for UI slice
const uiPersistConfig = {
  key: "ui",
  storage: reduxStorage,
};

const settingsPersistConfig = {
  key: "settings",
  storage: reduxStorage,
};

const medicationsPersistConfig = {
  key: "medications",
  storage: reduxStorage,
};

const impactDefinitionsPersistConfig = {
  key: "impactDefinitions",
  storage: reduxStorage,
};

const emotionDefinitionsPersistConfig = {
  key: "emotionDefinitions",
  storage: reduxStorage,
};

// Create persisted reducers
const persistedUIReducer = persistReducer(uiPersistConfig, uiSliceReducer);
const persistedSettingsReducer = persistReducer(
  settingsPersistConfig,
  settingsReducer
);
const persistedMedicationsReducer = persistReducer(
  medicationsPersistConfig,
  medicationsReducer
);
const persistedImpactDefinitionsReducer = persistReducer(
  impactDefinitionsPersistConfig,
  impactDefinitionsReducer
);
const persistedEmotionDefinitionsReducer = persistReducer(
  emotionDefinitionsPersistConfig,
  emotionDefinitionsReducer
);

export const store = configureStore({
  reducer: {
    ui: persistedUIReducer,
    settings: persistedSettingsReducer,
    impactDefinitions: persistedImpactDefinitionsReducer,
    emotionDefinitions: persistedEmotionDefinitionsReducer,
    logMetrics: logMetricsReducer,
    logs: logsReducer,
    medications: persistedMedicationsReducer,
    sleepLogs: sleepLogsReducer,
    medLogs: medLogsReducer,
    cbtLogs: cbtLogsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
  devTools: false,
  enhancers: (getDefaultEnhancers) => {
    return getDefaultEnhancers().concat(devToolsEnhancer());
  },
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
