export type TTextTheme = {
  text: string;
  textSecondary: string;
  textLight: string;
};

export interface TColorsTheme {
  primary: string;
  surfaceTint: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  secondary: string;
  onSecondary: string;
  secondaryContainer: string;
  onSecondaryContainer: string;
  tertiary: string;
  onTertiary: string;
  tertiaryContainer: string;
  onTertiaryContainer: string;
  error: string;
  onError: string;
  errorContainer: string;
  onErrorContainer: string;
  background: string;
  onBackground: string;
  surface: string;
  onSurface: string;
  surfaceVariant: string;
  onSurfaceVariant: string;
  outline: string;
  outlineVariant: string;
  shadow: string;
  scrim: string;
  inverseSurface: string;
  inverseOnSurface: string;
  inversePrimary: string;

  /** Extended / Fixed roles */
  primaryFixed: string;
  onPrimaryFixed: string;
  primaryFixedDim: string;
  onPrimaryFixedVariant: string;
  secondaryFixed: string;
  onSecondaryFixed: string;
  secondaryFixedDim: string;
  onSecondaryFixedVariant: string;
  tertiaryFixed: string;
  onTertiaryFixed: string;
  tertiaryFixedDim: string;
  onTertiaryFixedVariant: string;

  /** Surface containers */
  surfaceDim: string;
  surfaceBright: string;
  surfaceContainerLowest: string;
  surfaceContainerLow: string;
  surfaceContainer: string;
  surfaceContainerHigh: string;
  surfaceContainerHighest: string;
}

const size = {
  xxs: 16,
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 56,
  xxl: 64,
} as const;

const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

const borderRadius = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export type TTheme = {
  mode: "light" | "dark";
  statusBar: "dark" | "light";
  colors: TColorsTheme;
  layout: {
    spacing: typeof spacing;
    borderRadius: typeof borderRadius;
    size: typeof size;
  };
};

export const lightTheme: TTheme = {
  mode: "light",
  statusBar: "dark",
  colors: {
    primary: "#00687A",
    surfaceTint: "#00687A",
    onPrimary: "#FFFFFF",
    primaryContainer: "#ADECFF",
    onPrimaryContainer: "#004E5D",
    secondary: "#4B6269",
    onSecondary: "#FFFFFF",
    secondaryContainer: "#CEE7EF",
    onSecondaryContainer: "#334A51",
    tertiary: "#575C7E",
    onTertiary: "#FFFFFF",
    tertiaryContainer: "#DDE1FF",
    onTertiaryContainer: "#3F4565",
    error: "#BA1A1A",
    onError: "#FFFFFF",
    errorContainer: "#FFDAD6",
    onErrorContainer: "#93000A",
    background: "#F5FAFC",
    onBackground: "#171C1E",
    surface: "#F5FAFC",
    onSurface: "#171C1E",
    surfaceVariant: "#DBE4E7",
    onSurfaceVariant: "#3F484B",
    outline: "#70797C",
    outlineVariant: "#BFC8CB",
    shadow: "#000000",
    scrim: "#000000",
    inverseSurface: "#2C3133",
    inverseOnSurface: "#ECF2F4",
    inversePrimary: "#85D2E7",
    primaryFixed: "#ADECFF",
    onPrimaryFixed: "#001F26",
    primaryFixedDim: "#85D2E7",
    onPrimaryFixedVariant: "#004E5D",
    secondaryFixed: "#CEE7EF",
    onSecondaryFixed: "#061F25",
    secondaryFixedDim: "#B2CBD2",
    onSecondaryFixedVariant: "#334A51",
    tertiaryFixed: "#DDE1FF",
    onTertiaryFixed: "#131937",
    tertiaryFixedDim: "#BFC4EB",
    onTertiaryFixedVariant: "#3F4565",
    surfaceDim: "#D5DBDD",
    surfaceBright: "#F5FAFC",
    surfaceContainerLowest: "#FFFFFF",
    surfaceContainerLow: "#EFF4F7",
    surfaceContainer: "#E9EFF1",
    surfaceContainerHigh: "#E4E9EB",
    surfaceContainerHighest: "#DEE3E5",
  },
  layout: {
    size,
    spacing,
    borderRadius,
  },
};

export const darkTheme: TTheme = {
  mode: "dark",
  statusBar: "light",
  colors: {
    primary: "#85D2E7",
    surfaceTint: "#85D2E7",
    onPrimary: "#003640",
    primaryContainer: "#004E5D",
    onPrimaryContainer: "#ADECFF",
    secondary: "#B2CBD2",
    onSecondary: "#1D343A",
    secondaryContainer: "#334A51",
    onSecondaryContainer: "#CEE7EF",
    tertiary: "#BFC4EB",
    onTertiary: "#292E4D",
    tertiaryContainer: "#3F4565",
    onTertiaryContainer: "#DDE1FF",
    error: "#FFB4AB",
    onError: "#690005",
    errorContainer: "#93000A",
    onErrorContainer: "#FFDAD6",
    background: "#0F1416",
    onBackground: "#DEE3E5",
    surface: "#0F1416",
    onSurface: "#DEE3E5",
    surfaceVariant: "#3F484B",
    onSurfaceVariant: "#BFC8CB",
    outline: "#899295",
    outlineVariant: "#3F484B",
    shadow: "#000000",
    scrim: "#000000",
    inverseSurface: "#DEE3E5",
    inverseOnSurface: "#2C3133",
    inversePrimary: "#00687A",
    primaryFixed: "#ADECFF",
    onPrimaryFixed: "#001F26",
    primaryFixedDim: "#85D2E7",
    onPrimaryFixedVariant: "#004E5D",
    secondaryFixed: "#CEE7EF",
    onSecondaryFixed: "#061F25",
    secondaryFixedDim: "#B2CBD2",
    onSecondaryFixedVariant: "#334A51",
    tertiaryFixed: "#DDE1FF",
    onTertiaryFixed: "#131937",
    tertiaryFixedDim: "#BFC4EB",
    onTertiaryFixedVariant: "#3F4565",
    surfaceDim: "#0F1416",
    surfaceBright: "#343A3C",
    surfaceContainerLowest: "#090F11",
    surfaceContainerLow: "#171C1E",
    surfaceContainer: "#1B2022",
    surfaceContainerHigh: "#252B2D",
    surfaceContainerHighest: "#303638",
  },
  layout: {
    size,
    spacing,
    borderRadius,
  },
};

export const DISABLED_ALPHA = 0.38;

export const TOUCHABLE_ACTIVE_OPACITY = 0.54;

// Utility function to add alpha to hex colors
export const withAlpha = (color: string, alpha: number): string => {
  // Handle hex colors
  if (color.startsWith("#")) {
    const hex = color.slice(1);
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  // Handle rgb colors
  if (color.startsWith("rgb(")) {
    return color.replace("rgb(", "rgba(").replace(")", `, ${alpha})`);
  }
  // Handle rgba colors
  if (color.startsWith("rgba(")) {
    return color.replace(/,\s*[\d.]+\)$/, `, ${alpha})`);
  }
  // Fallback for named colors (convert to rgba)
  return `rgba(0, 0, 0, ${alpha})`;
};

export const disabledColor = (color: string) => {
  return withAlpha(color, DISABLED_ALPHA);
};
