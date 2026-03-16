export const fonts = {
  regular: "Nunito_400Regular",
  semibold: "Nunito_600SemiBold",
  bold: "Nunito_700Bold",
} as const;

// Helper function to calculate line height
const lineHeight = (fontSize: number, ratio: number = 1.5) => {
  return Math.round(fontSize * ratio);
};

export const typography = {
  h1: {
    fontFamily: fonts.bold,
    fontSize: 28,
    lineHeight: lineHeight(28, 1.29),
  },
  h2: {
    fontFamily: fonts.bold,
    fontSize: 24,
    lineHeight: lineHeight(24, 1.33),
  },
  h3: {
    fontFamily: fonts.bold,
    fontSize: 22,
    lineHeight: lineHeight(22, 1.27),
  },
  h4: {
    fontFamily: fonts.bold,
    fontSize: 20,
    lineHeight: lineHeight(20, 1.4),
  },
  h5: {
    fontFamily: fonts.bold,
    fontSize: 18,
    lineHeight: lineHeight(18, 1.33),
  },
  h6: {
    fontFamily: fonts.bold,
    fontSize: 16,
    lineHeight: lineHeight(16, 1.5),
  },
  body: {
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: lineHeight(16, 1.5),
  },
  bodySemibold: {
    fontFamily: fonts.semibold,
    fontSize: 16,
    lineHeight: lineHeight(16, 1.5),
  },
  bodyBold: {
    fontFamily: fonts.bold,
    fontSize: 16,
    lineHeight: lineHeight(16, 1.5),
  },
  small: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: lineHeight(14, 1.43),
  },
  smallSemibold: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    lineHeight: lineHeight(14, 1.43),
  },
  smallBold: {
    fontFamily: fonts.bold,
    fontSize: 14,
    lineHeight: lineHeight(14, 1.43),
  },
  tiny: {
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: lineHeight(12, 1.33),
  },
  tinySemibold: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    lineHeight: lineHeight(12, 1.33),
  },
  tinyBold: {
    fontFamily: fonts.bold,
    fontSize: 12,
    lineHeight: lineHeight(12, 1.33),
  },
  extraTiny: {
    fontFamily: fonts.regular,
    fontSize: 10,
    lineHeight: lineHeight(10, 1.33),
  },
  extraTinySemibold: {
    fontFamily: fonts.semibold,
    fontSize: 10,
    lineHeight: lineHeight(10, 1.33),
  },
  extraTinyBold: {
    fontFamily: fonts.bold,
    fontSize: 10,
    lineHeight: lineHeight(10, 1.33),
  },
} as const;
