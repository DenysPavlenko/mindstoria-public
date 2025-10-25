import { TTheme, useTheme, withAlpha } from "@/theme";
import { TColorKeys } from "@/types/common";
import React, { useEffect, useMemo, useRef } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Card } from "../Card/Card";
import { IconButton } from "../IconButton/IconButton";
import { KeyboardAwareView } from "../KeyboardAwareView/KeyboardAwareView";
import { Typography } from "../Typography/Typography";

export interface SlideInViewProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxHeightPercent?: number; // e.g. 0.8 for 80% of screen height
  fixedHeight?: boolean;
  hideCloseButton?: boolean;
  title?: string | React.ReactNode;
  bgColor?: TColorKeys;
  style?: StyleProp<ViewStyle>;
}

export const SlideInView: React.FC<SlideInViewProps> = ({
  visible,
  onClose,
  children,
  maxHeightPercent = 1,
  fixedHeight,
  hideCloseButton,
  title,
  style,
  bgColor = "surface",
}) => {
  const insets = useSafeAreaInsets();
  const screenHeight = Dimensions.get("window").height;
  const translateY = useRef(new Animated.Value(screenHeight)).current;
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  useEffect(() => {
    if (visible) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: screenHeight,
        duration: 200,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }
  }, [visible, screenHeight, translateY]);

  const renderCloseButton = () => {
    if (hideCloseButton) return null;
    return (
      <IconButton
        size="md"
        icon="x"
        onPress={onClose}
        style={styles.headerCloseButton}
      />
    );
  };

  const renderTitle = () => {
    if (!title) return <View />;
    if (typeof title === "string") {
      return (
        <Typography variant="h4" style={styles.headerTitle} numberOfLines={1}>
          {title}
        </Typography>
      );
    }
    return title;
  };

  const renderHeader = () => {
    if (!title && hideCloseButton) return null;
    return (
      <View style={styles.header}>
        {renderTitle()}
        {renderCloseButton()}
      </View>
    );
  };

  const maxHeight = (screenHeight - insets.top) * maxHeightPercent;

  return (
    <>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <Animated.View
        style={[styles.container, { transform: [{ translateY }] }]}
        pointerEvents="box-none"
      >
        <Card
          noPadding
          bgColor={bgColor}
          style={[
            styles.card,
            fixedHeight && { flex: 1 },
            {
              maxHeight,
              height: fixedHeight ? maxHeight : undefined,
              paddingBottom: insets.bottom,
            },
            style,
          ]}
        >
          <KeyboardAwareView
            behavior="padding"
            style={[fixedHeight && { flex: 1 }]}
          >
            {renderHeader()}
            {children}
          </KeyboardAwareView>
        </Card>
      </Animated.View>
    </>
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "flex-end",
    },
    backdrop: {
      position: "absolute",
      flex: 1,
      width: "100%",
      height: "100%",
      backgroundColor: withAlpha(theme.colors.scrim, 0.6),
    },
    card: {
      borderBottomRightRadius: 0,
      borderBottomLeftRadius: 0,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: theme.layout.spacing.lg,
      width: "100%",
    },
    headerTitle: {
      flex: 1,
      paddingRight: theme.layout.spacing.md,
    },
    headerCloseButton: {
      marginLeft: "auto",
    },
  });
