import { Card, MOOD_INPUT_ANIMATION_DURATION } from "@/components";
import { useTheme } from "@/providers";
import { TTheme } from "@/theme";
import { RatingLevel } from "@/types";
import { useIsFocused } from "@react-navigation/native";
import { useEffect, useMemo, useRef, useState } from "react";
import { Dimensions, LayoutChangeEvent, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const FINAL_CONTENT_TOP = 130;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const timingConfig = {
  duration: MOOD_INPUT_ANIMATION_DURATION,
  easing: Easing.inOut(Easing.quad),
};

interface AnimatedContentWrapperProps {
  level: RatingLevel | null;
  header: React.ReactNode;
  moodInput: React.ReactNode;
  mainContent: React.ReactNode;
  shouldAnimate: boolean;
  keyboardHeight: number;
}

export const AnimatedContentWrapper = ({
  level,
  header,
  moodInput,
  mainContent,
  shouldAnimate,
  keyboardHeight,
}: AnimatedContentWrapperProps) => {
  const isFocused = useIsFocused();
  const { theme } = useTheme();
  const [containerHeight, setContainerHeight] = useState(0);
  const [inputOffset, setInputOffset] = useState(0);
  const hasAnimated = useRef(false);
  const inputTransYSV = useSharedValue(0);
  const contentTransYSV = useSharedValue(SCREEN_HEIGHT);
  const contentTopSV = useSharedValue(FINAL_CONTENT_TOP);

  const styles = useMemo(() => createStyles(theme), [theme]);

  const animateKeyboard = isFocused && keyboardHeight > 0;

  const onContainerLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setContainerHeight(height);
    // Adjust content top to be just below the main container
    contentTransYSV.value = height;
  };

  const onInputLayout = (event: LayoutChangeEvent) => {
    const { y } = event.nativeEvent.layout;
    setInputOffset(y);
  };

  useEffect(() => {
    // If not animating, set values immediately to final state
    if (!shouldAnimate && inputOffset > 0) {
      inputTransYSV.value = -inputOffset;
      contentTransYSV.value = 0;
      hasAnimated.current = true;
    }
  }, [shouldAnimate, inputOffset, inputTransYSV, contentTransYSV]);

  useEffect(() => {
    // Animate only the first time a mood is selected
    if (shouldAnimate && !hasAnimated.current && level !== null) {
      inputTransYSV.value = withTiming(-inputOffset, timingConfig);
      contentTransYSV.value = withTiming(0, timingConfig);
      hasAnimated.current = true;
    }
  }, [
    level,
    shouldAnimate,
    inputOffset,
    inputTransYSV,
    contentTransYSV,
    containerHeight,
  ]);

  useEffect(() => {
    if (animateKeyboard) {
      // When keyboard opens, move content top to 0 to fill the screen
      contentTopSV.value = withTiming(0, timingConfig);
    } else if (hasAnimated.current) {
      // Move content back down when keyboard closes
      contentTopSV.value = withTiming(FINAL_CONTENT_TOP, timingConfig);
    }
  }, [animateKeyboard, contentTopSV]);

  const animatedWrapperStyle = useAnimatedStyle(() => {
    const bgColor = level
      ? theme.colors.surfaceContainerLow
      : theme.colors.background;
    return {
      backgroundColor: withTiming(bgColor, timingConfig),
    };
  });

  const animatedMoodInputStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: inputTransYSV.value }],
  }));

  const animatedContentStyle = useAnimatedStyle(() => ({
    top: contentTopSV.value,
    transform: [{ translateY: contentTransYSV.value }],
  }));

  const renderMoodInput = () => {
    return (
      <Animated.View style={animatedMoodInputStyle} onLayout={onInputLayout}>
        {moodInput}
      </Animated.View>
    );
  };

  const renderContent = () => {
    return (
      <Animated.View style={[animatedContentStyle, styles.contentContainer]}>
        <Card
          bgColor="surface"
          noVerticalPadding
          style={styles.contentContainerCard}
        >
          {mainContent}
        </Card>
      </Animated.View>
    );
  };

  return (
    <Animated.View style={[animatedWrapperStyle, styles.wrapper]}>
      {header}
      <View style={styles.container} onLayout={onContainerLayout}>
        {renderMoodInput()}
        {renderContent()}
        {/* Ghost header to maintain layout */}
        <View style={styles.ghostHeader} pointerEvents="none">
          {header}
        </View>
      </View>
    </Animated.View>
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
    },
    container: {
      flex: 1,
      overflow: "hidden",
      justifyContent: "center",
    },
    contentContainer: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      flex: 1,
    },
    contentContainerCard: {
      flex: 1,
      overflow: "hidden",
      borderBottomRightRadius: 0,
      borderBottomLeftRadius: 0,
    },
    ghostHeader: {
      opacity: 0,
    },
  });
