import { drizzle } from "drizzle-orm/expo-sqlite";
import * as SQLite from "expo-sqlite";

export const expoDb = SQLite.openDatabaseSync("mindstoria.db");

// Enable foreign key constraints
expoDb.execSync("PRAGMA foreign_keys = ON;");

export const db = drizzle(expoDb);
