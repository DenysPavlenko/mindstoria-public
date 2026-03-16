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
  // Extended / Fixed roles
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
  // Surface containers
  surfaceDim: string;
  surfaceBright: string;
  surfaceContainerLowest: string;
  surfaceContainerLow: string;
  surfaceContainer: string;
  surfaceContainerHigh: string;
  surfaceContainerHighest: string;
  // Semantic impact scales
  rating: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
  };
  ratingContainer: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
  };
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
    primary: "#415F91",
    surfaceTint: "#415F91",
    onPrimary: "#FFFFFF",
    primaryContainer: "#D6E3FF",
    onPrimaryContainer: "#284777",
    secondary: "#565F71",
    onSecondary: "#FFFFFF",
    secondaryContainer: "#DAE2F9",
    onSecondaryContainer: "#3E4759",
    tertiary: "#705575",
    onTertiary: "#FFFFFF",
    tertiaryContainer: "#FAD8FD",
    onTertiaryContainer: "#573E5C",
    error: "#BA1A1A",
    onError: "#FFFFFF",
    errorContainer: "#FFDAD6",
    onErrorContainer: "#93000A",
    background: "#F9F9FF",
    onBackground: "#191C20",
    surface: "#F9F9FF",
    onSurface: "#191C20",
    surfaceVariant: "#E0E2EC",
    onSurfaceVariant: "#44474E",
    outline: "#74777F",
    outlineVariant: "#C4C6D0",
    shadow: "#000000",
    scrim: "#000000",
    inverseSurface: "#2E3036",
    inverseOnSurface: "#F0F0F7",
    inversePrimary: "#AAC7FF",
    primaryFixed: "#D6E3FF",
    onPrimaryFixed: "#001B3E",
    primaryFixedDim: "#AAC7FF",
    onPrimaryFixedVariant: "#284777",
    secondaryFixed: "#DAE2F9",
    onSecondaryFixed: "#131C2B",
    secondaryFixedDim: "#BEC6DC",
    onSecondaryFixedVariant: "#3E4759",
    tertiaryFixed: "#FAD8FD",
    onTertiaryFixed: "#28132E",
    tertiaryFixedDim: "#DDBCE0",
    onTertiaryFixedVariant: "#573E5C",
    surfaceDim: "#D9D9E0",
    surfaceBright: "#F9F9FF",
    surfaceContainerLowest: "#FFFFFF",
    surfaceContainerLow: "#F3F3FA",
    surfaceContainer: "#EDEDF4",
    surfaceContainerHigh: "#E7E8EE",
    surfaceContainerHighest: "#E2E2E9",
    rating: {
      50: "#D94545",
      100: "#EC7A33",
      200: "#D6B84A",
      300: "#93C96A",
      400: "#5BA85F",
    },
    ratingContainer: {
      50: "#F3B3B3",
      100: "#FFD1B3",
      200: "#F8E6A8",
      300: "#CDE7B8",
      400: "#A3D6A7",
    },
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
    primary: "#AAC7FF",
    surfaceTint: "#AAC7FF",
    onPrimary: "#0A305F",
    primaryContainer: "#284777",
    onPrimaryContainer: "#D6E3FF",
    secondary: "#BEC6DC",
    onSecondary: "#283141",
    secondaryContainer: "#3E4759",
    onSecondaryContainer: "#DAE2F9",
    tertiary: "#DDBCE0",
    onTertiary: "#3F2844",
    tertiaryContainer: "#573E5C",
    onTertiaryContainer: "#FAD8FD",
    error: "#FFB4AB",
    onError: "#690005",
    errorContainer: "#93000A",
    onErrorContainer: "#FFDAD6",
    background: "#111318",
    onBackground: "#E2E2E9",
    surface: "#111318",
    onSurface: "#E2E2E9",
    surfaceVariant: "#44474E",
    onSurfaceVariant: "#C4C6D0",
    outline: "#8E9099",
    outlineVariant: "#44474E",
    shadow: "#000000",
    scrim: "#000000",
    inverseSurface: "#E2E2E9",
    inverseOnSurface: "#2E3036",
    inversePrimary: "#415F91",
    primaryFixed: "#D6E3FF",
    onPrimaryFixed: "#001B3E",
    primaryFixedDim: "#AAC7FF",
    onPrimaryFixedVariant: "#284777",
    secondaryFixed: "#DAE2F9",
    onSecondaryFixed: "#131C2B",
    secondaryFixedDim: "#BEC6DC",
    onSecondaryFixedVariant: "#3E4759",
    tertiaryFixed: "#FAD8FD",
    onTertiaryFixed: "#28132E",
    tertiaryFixedDim: "#DDBCE0",
    onTertiaryFixedVariant: "#573E5C",
    surfaceDim: "#111318",
    surfaceBright: "#37393E",
    surfaceContainerLowest: "#0C0E13",
    surfaceContainerLow: "#191C20",
    surfaceContainer: "#1D2024",
    surfaceContainerHigh: "#282A2F",
    surfaceContainerHighest: "#33353A",
    rating: {
      50: "#FFB4AB",
      100: "#FFB74D",
      200: "#FFD54F",
      300: "#AED581",
      400: "#81C784",
    },
    ratingContainer: {
      50: "#B26A6A",
      100: "#B28536",
      200: "#B2A136",
      300: "#6B8C4F",
      400: "#4B7B57",
    },
  },
  layout: {
    size,
    spacing,
    borderRadius,
  },
};
