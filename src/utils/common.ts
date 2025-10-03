import * as Crypto from "expo-crypto";

export const generateRandomId = (): string => {
  return Crypto.randomUUID();
};
