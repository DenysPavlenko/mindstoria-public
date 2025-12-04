import { TTheme, useTheme } from "@/theme";
import { useMemo } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import NoData from "../../assets/images/no-data.svg";
import { Typography } from "../Typography/Typography";

interface PlaceholderProps {
  title?: string | React.ReactNode;
  content?: string | React.ReactNode;
  style?: StyleProp<ViewStyle>;
  hideIcon?: boolean;
}

export const Placeholder = ({
  title,
  content,
  style,
  hideIcon = false,
}: PlaceholderProps) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const iconSize = 150;

  const renderImage = () => {
    if (hideIcon) return null;
    return (
      <View
        style={{
          height: iconSize,
          width: iconSize,
          overflow: "hidden",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: theme.layout.spacing.md,
        }}
      >
        <NoData
          width={iconSize * 1.2}
          height={iconSize * 1.2}
          fill={theme.colors.outlineVariant}
          color={theme.colors.outlineVariant}
        />
      </View>
    );
  };

  const renderTitle = () => {
    if (typeof title === "string") {
      return (
        <Typography
          variant="h4"
          fontWeight="regular"
          align="center"
          color="outline"
        >
          {title}
        </Typography>
      );
    }
    return title;
  };

  const renderContent = () => {
    if (typeof content === "string") {
      return (
        <Typography
          align="center"
          variant="small"
          color="outline"
          style={styles.content}
        >
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
