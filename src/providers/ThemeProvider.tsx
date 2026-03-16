import { THEME_STORAGE_KEY } from "@/appConstants";
import { storage } from "@/services";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useColorScheme } from "react-native";
import { darkTheme, lightTheme, TTheme } from "../theme";

interface ThemeContextValue {
  theme: TTheme;
  isDark: boolean;
  toggleTheme: () => void;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemColorScheme === "dark");
  const [isLoading, setIsLoading] = useState(true);

  // Load theme preference from storage on mount
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await storage.getItem(THEME_STORAGE_KEY);
        if (savedTheme !== undefined && savedTheme !== null) {
          setIsDark(savedTheme === "true");
        }
      } catch (error) {
        console.error("Error loading theme preference:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadThemePreference();
  }, []);

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => {
      const newTheme = !prev;
      try {
        storage.setItem(THEME_STORAGE_KEY, newTheme.toString());
      } catch (error) {
        console.error("Error saving theme preference:", error);
      }
      return newTheme;
    });
  }, []);

  const value = useMemo(
    () => ({
      theme: isDark ? darkTheme : lightTheme,
      isDark,
      toggleTheme,
      isLoading,
    }),
    [isDark, isLoading, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
};
