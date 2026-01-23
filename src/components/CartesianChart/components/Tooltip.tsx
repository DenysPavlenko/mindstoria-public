import { Nunito_400Regular } from "@expo-google-fonts/nunito";
import {
  Circle,
  Group,
  RoundedRect,
  Line as SkiaLine,
  Text as SkiaText,
  useFont,
  vec,
} from "@shopify/react-native-skia";
import { SharedValue, useDerivedValue } from "react-native-reanimated";

interface ActiveIndicatorProps {
  xPosition: SharedValue<number>;
  yPosition: SharedValue<number>;
  activeValue: SharedValue<number> | SharedValue<string>;
  activeXValue: SharedValue<string>; // Add X value (date)
  bottom: number;
  textColor: string;
  lineColor: string;
  indicatorColor: string;
  backgroundColor: string;
  topOffset?: number;
  showLine?: boolean;
  isYearly?: boolean;
  showBottomText?: boolean; // Make bottom text (Y value) optional
  chartBounds: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  };
}

const FONT_SIZE = 14;

export const Tooltip = ({
  xPosition,
  yPosition,
  activeValue,
  activeXValue,
  bottom,
  textColor,
  lineColor,
  isYearly,
  indicatorColor,
  backgroundColor,
  showBottomText = true,
  chartBounds,
}: ActiveIndicatorProps) => {
  const font = useFont(Nunito_400Regular, FONT_SIZE);
  const start = useDerivedValue(() => {
    // Only show line if we have valid position data
    if (isNaN(xPosition.value) || isNaN(yPosition.value)) {
      return vec(NaN, NaN); // This will hide the line
    }
    return vec(xPosition.value, bottom);
  });
  const end = useDerivedValue(() => {
    // Only show line if we have valid position data
    if (isNaN(xPosition.value) || isNaN(yPosition.value)) {
      return vec(NaN, NaN); // This will hide the line
    }
    return vec(xPosition.value, chartBounds.top);
  });

  // Format Y value (data value)
  const yValueDisplay = useDerivedValue(() => {
    if (typeof activeValue.value === "number") {
      const value = activeValue.value;
      if (isNaN(value)) return "N/A";
      if (isYearly) {
        return `Avg: ${value}`;
      }
      return String(value);
    }
    return "N/A";
  });

  // Format X value (date)
  const xValueDisplay = useDerivedValue(() => {
    if (typeof activeXValue.value === "string") {
      const date = new Date(activeXValue.value);
      const formatter = new Intl.DateTimeFormat("en-US", {
        month: isYearly ? "long" : "short",
        day: isYearly ? undefined : "numeric",
      });
      return formatter.format(date);
    }
    return "";
  });

  // Calculate text width (use the longer line for width calculation)
  const textWidth = useDerivedValue(() => {
    if (!font) return 0;
    const xWidth = font.measureText(xValueDisplay.value).width;
    if (!showBottomText) return xWidth;
    const yWidth = font.measureText(yValueDisplay.value).width;
    return Math.max(xWidth, yWidth);
  });

  // Background rect dimensions (adjusted for one or two lines)
  const bgPadding = 8;
  const lineHeight = FONT_SIZE + 2; // Small spacing between lines
  const bgWidth = useDerivedValue(() => textWidth.value + bgPadding * 2);
  const bgHeight = showBottomText
    ? lineHeight * 2 + bgPadding
    : FONT_SIZE + bgPadding;

  // Calculate constrained position for the shared background
  const constrainedBgX = useDerivedValue(() => {
    const idealBgX = xPosition.value - bgWidth.value / 2;

    if (!chartBounds) return idealBgX;

    // Check left boundary
    if (idealBgX < chartBounds.left) {
      return chartBounds.left;
    }

    // Check right boundary
    if (idealBgX + bgWidth.value > chartBounds.right) {
      return chartBounds.right - bgWidth.value;
    }

    return idealBgX;
  });

  // Center each text line within the background
  const xTextX = useDerivedValue(() => {
    if (!font) return xPosition.value;
    const xWidth = font.measureText(xValueDisplay.value).width;
    const bgCenter = constrainedBgX.value + bgWidth.value / 2;
    return bgCenter - xWidth / 2;
  });

  const yTextX = useDerivedValue(() => {
    if (!font) return xPosition.value;
    const yWidth = font.measureText(yValueDisplay.value).width;
    const bgCenter = constrainedBgX.value + bgWidth.value / 2;
    return bgCenter - yWidth / 2;
  });

  const textY = useDerivedValue(() => {
    // Only show at top if we have valid position data (not NaN)
    if (isNaN(xPosition.value) || isNaN(yPosition.value)) {
      return NaN; // This will hide the tooltip
    }
    return chartBounds.top + bgPadding / 2 + FONT_SIZE - 2;
  });

  const secondLineY = useDerivedValue(() => textY.value + lineHeight);

  const bgY = useDerivedValue(() => {
    // Only show background if we have valid text position
    if (isNaN(textY.value)) {
      return NaN; // This will hide the background
    }
    return chartBounds.top;
  });

  return (
    <Group>
      <SkiaLine
        p1={start}
        p2={end}
        color={lineColor}
        strokeWidth={1}
      ></SkiaLine>
      <Circle cx={xPosition} cy={yPosition} r={6} color={indicatorColor} />
      <Circle
        cx={xPosition}
        cy={yPosition}
        r={8}
        color="hsla(0, 0, 100%, 0.25)"
      />
      {/* Background rectangle */}
      <RoundedRect
        x={constrainedBgX}
        y={bgY}
        width={bgWidth}
        height={bgHeight}
        color={backgroundColor}
        r={8}
      />
      {/* Date text (first line) */}
      <SkiaText
        x={xTextX}
        y={textY}
        text={xValueDisplay}
        font={font}
        color={textColor}
      />
      {/* Value text (second line) - conditional */}
      {showBottomText && (
        <SkiaText
          x={yTextX}
          y={secondLineY}
          text={yValueDisplay}
          font={font}
          color={textColor}
        />
      )}
    </Group>
  );
};
