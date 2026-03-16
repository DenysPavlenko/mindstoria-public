import { useTheme } from "@/providers";
import { TTheme } from "@/theme";
import Feather, { FeatherIconName } from "@react-native-vector-icons/feather";
import { useMemo } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { Typography } from "../Typography/Typography";

interface PlaceholderProps {
  title?: string | React.ReactNode;
  icon?: FeatherIconName;
  content?: string | React.ReactNode;
  style?: StyleProp<ViewStyle>;
  hideIcon?: boolean;
}

export const Placeholder = ({
  title,
  icon = "heart",
  content,
  style,
  hideIcon = false,
}: PlaceholderProps) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const renderImage = () => {
    if (hideIcon) return null;
    return (
      <Feather
        name={icon}
        size={theme.layout.size.xl}
        color={theme.colors.outlineVariant}
        style={styles.icon}
      />
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
        <Typography align="center" variant="small" color="outline">
          {content}
        </Typography>
      );
    }
    return <View>{content}</View>;
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
    icon: {
      marginBottom: theme.layout.spacing.md,
    },
    action: {
      marginTop: theme.layout.spacing.lg,
    },
  });
