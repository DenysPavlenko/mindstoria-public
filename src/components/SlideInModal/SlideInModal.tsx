import { TTheme, useTheme, withAlpha } from "@/theme";
import React, { useEffect, useMemo, useRef } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Modal,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Card } from "../Card/Card";
import { IconButton } from "../IconButton/IconButton";
import { Typography } from "../Typography/Typography";

interface SlideInModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxHeightPercent?: number; // e.g. 0.8 for 80% of screen height
  fixedHeight?: boolean;
  hideCloseButton?: boolean;
  title?: string | React.ReactNode;
}

export const SlideInModal: React.FC<SlideInModalProps> = ({
  visible,
  onClose,
  children,
  maxHeightPercent = 1,
  fixedHeight,
  hideCloseButton,
  title,
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
        size="sm"
        icon="x"
        onPress={onClose}
        backgroundColor="surfaceContainerHighest"
        iconColor="onSurface"
        style={styles.headerCloseButton}
      />
    );
  };

  const renderTitle = () => {
    if (!title) return null;
    if (typeof title === "string") {
      return (
        <Typography variant="h4" style={styles.headerTitle}>
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
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose} />
      <Animated.View
        style={[styles.container, { transform: [{ translateY }] }]}
        pointerEvents="box-none"
      >
        <Card
          noPadding
          cardStyle={[
            styles.card,
            {
              maxHeight,
              height: fixedHeight ? maxHeight : undefined,
              paddingBottom: insets.bottom,
            },
          ]}
        >
          {renderHeader()}
          {children}
        </Card>
      </Animated.View>
    </Modal>
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
