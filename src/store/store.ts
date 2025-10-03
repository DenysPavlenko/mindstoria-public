import AsyncStorage from "@react-native-async-storage/async-storage";
import { configureStore } from "@reduxjs/toolkit";
import devToolsEnhancer from "redux-devtools-expo-dev-plugin";
import { persistReducer, persistStore } from "redux-persist";
import { trackersDataSlice, uiSlice } from "./slices";
import premiumReducer from "./slices/premium/premiumSlice";

// Persist config for UI slice
const uiPersistConfig = {
  key: "ui",
  storage: AsyncStorage,
};

// Create persisted UI reducer
const persistedUIReducer = persistReducer(uiPersistConfig, uiSlice.reducer);

export const store = configureStore({
  reducer: {
    ui: persistedUIReducer,
    trackersData: trackersDataSlice.reducer,
    premium: premiumReducer,
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
