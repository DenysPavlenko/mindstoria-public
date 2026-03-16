import React, { useMemo } from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";

export interface ISafeViewProps extends ViewProps {
  direction?:
    | "vertical"
    | "horizontal"
    | "top"
    | "right"
    | "bottom"
    | "left"
    | "none";
}

const generatePaddings = (
  direction: ISafeViewProps["direction"],
  insets: EdgeInsets,
) => ({
  ...((direction === "vertical" || direction === "top") && {
    paddingTop: insets.top,
  }),
  ...((direction === "vertical" || direction === "bottom") && {
    paddingBottom: insets.bottom,
  }),
  ...((direction === "horizontal" || direction === "left") && {
    paddingLeft: insets.left,
  }),
  ...((direction === "horizontal" || direction === "right") && {
    paddingRight: insets.right,
  }),
});

export const SafeView = ({
  direction = "bottom",
  children,
  style,
  ...otherProps
}: ISafeViewProps) => {
  const insets = useSafeAreaInsets();

  const paddings = useMemo(() => {
    return generatePaddings(direction, insets);
  }, [insets, direction]);

  return (
    <View style={[styles.container, paddings, style]} {...otherProps}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
