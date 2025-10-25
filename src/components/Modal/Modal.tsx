import { TTheme, useTheme, withAlpha } from "@/theme";
import { TColorKeys } from "@/types/common";
import React, { useEffect, useMemo, useRef } from "react";
import {
  Animated,
  Pressable,
  Modal as RNModal,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Card } from "../Card/Card";
import { KeyboardAwareView } from "../KeyboardAwareView/KeyboardAwareView";

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  transparent?: boolean;
  onShow?: () => void;
  closeOnBackdropPress?: boolean;
  animated?: boolean;
  style?: StyleProp<ViewStyle>;
  maxWidth?: number;
  bgColor?: TColorKeys;
}

export const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  children,
  transparent = true,
  onShow,
  closeOnBackdropPress = true,
  animated = true,
  style,
  maxWidth,
  bgColor = "surface",
}) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const scaleAnimation = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (visible && animated) {
      // Reset initial values
      scaleAnimation.setValue(0.8);
      // Start animations when modal becomes visible
      Animated.spring(scaleAnimation, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start(() => {
        // Call onShow when animation completes
        onShow?.();
      });
    } else if (visible && !animated) {
      // Set to final value immediately if animation is disabled
      scaleAnimation.setValue(1);
      // Call onShow immediately when no animation
      onShow?.();
    }
  }, [visible, scaleAnimation, animated, onShow]);

  const handleBackdropPress = () => {
    if (closeOnBackdropPress) {
      onClose();
    }
  };

  return (
    <RNModal
      visible={visible}
      animationType="fade"
      transparent={transparent}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable style={styles.backdrop} onPress={handleBackdropPress} />
      <KeyboardAwareView style={{ flex: 1 }}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <View style={styles.wrapper}>
            <Animated.View
              style={[
                styles.content,
                { transform: [{ scale: scaleAnimation }] },
              ]}
            >
              <Card
                bgColor={bgColor}
                style={[styles.card, style, { maxWidth }]}
              >
                {children}
              </Card>
            </Animated.View>
          </View>
        </GestureHandlerRootView>
      </KeyboardAwareView>
    </RNModal>
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    backdrop: {
      position: "absolute",
      flex: 1,
      width: "100%",
      height: "100%",
      backgroundColor: withAlpha(theme.colors.scrim, 0.6),
    },
    wrapper: {
      flex: 1,
      justifyContent: "center",
      maxHeight: "100%",
    },
    content: {
      minHeight: 200,
      maxHeight: "80%",
      padding: theme.layout.spacing.xl,
    },
    card: {
      marginHorizontal: "auto",
      paddingVertical: theme.layout.spacing.xl,
      width: "100%",
    },
  });
