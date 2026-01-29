import { createMMKV } from "react-native-mmkv";

const MMKVStorage = createMMKV();

export const storage = {
  getItem: async (key: string) => {
    return MMKVStorage.getString(key) || null;
  },
  setItem: async (key: string, value: string) => {
    MMKVStorage.set(key, value);
  },
  removeItem: async (key: string) => {
    MMKVStorage.remove(key);
  },
};
