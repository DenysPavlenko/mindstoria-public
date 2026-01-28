import { UNIQUE_USER_ID_KEY } from "@/appConstants";
import * as SecureStore from "expo-secure-store";
import { generateUniqueId } from "./common";

export async function getOrCreateUserId() {
  let id = await SecureStore.getItemAsync(UNIQUE_USER_ID_KEY);

  if (!id) {
    id = generateUniqueId();
    await SecureStore.setItemAsync(UNIQUE_USER_ID_KEY, id);
  }

  return id;
}
