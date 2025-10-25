import { TTheme, useTheme } from "@/theme";
import { useMemo } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import NoData from "../../assets/images/no-data.svg";
import { Typography } from "../Typography/Typography";

interface PlaceholderProps {
  title?: string | React.ReactNode;
  content?: string | React.ReactNode;
  style?: StyleProp<ViewStyle>;
  size?: "sm" | "lg";
  hideIcon?: boolean;
}

export const Placeholder = ({
  title,
  content,
  style,
  size = "lg",
  hideIcon = false,
}: PlaceholderProps) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const iconSize = size === "lg" ? 100 : 70;
  const iconWidth = iconSize * 1.5;
  const iconHeight = iconSize;

  const renderImage = () => {
    if (hideIcon) return null;
    return (
      <View
        style={{
          height: iconHeight,
          width: iconWidth,
          overflow: "hidden",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: theme.layout.spacing.md,
        }}
      >
        <NoData
          width={iconWidth * 1.5}
          height={iconHeight * 1.5}
          fill={theme.colors.outlineVariant}
          color={theme.colors.outlineVariant}
        />
      </View>
    );
  };

  const renderTitle = () => {
    if (typeof title === "string") {
      return (
        <Typography variant={size === "lg" ? "h4" : "h5"} align="center">
          {title}
        </Typography>
      );
    }
    return title;
  };

  const renderContent = () => {
    if (typeof content === "string") {
      return (
        <Typography align="center" variant="small" style={styles.content}>
          {content}
        </Typography>
      );
    }
    return <View style={styles.content}>{content}</View>;
  };

  return (
    <View style={[styles.container, style]}>
      {renderImage()}
      {renderTitle()}
      {renderContent()}
    </View>
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    container: {
      justifyContent: "center",
      alignItems: "center",
      maxWidth: 270,
      marginHorizontal: "auto",
    },
    content: {},
    action: {
      marginTop: theme.layout.spacing.lg,
    },
  });
