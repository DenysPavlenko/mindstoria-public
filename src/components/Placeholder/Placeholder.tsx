import { TTheme, useTheme } from "@/theme";
import { useMemo } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { IconButton } from "../IconButton/IconButton";
import { Typography } from "../Typography/Typography";

interface PlaceholderProps {
  title: string | React.ReactNode;
  content?: string | React.ReactNode;
  action?: {
    onPress: () => void;
  };
  style?: StyleProp<ViewStyle>;
}

export const Placeholder = ({
  title,
  content,
  action,
  style,
}: PlaceholderProps) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const renderTitle = () => {
    if (typeof title === "string") {
      return (
        <Typography variant="h2" align="center">
          {title}
        </Typography>
      );
    }
    return title;
  };

  const renderContent = () => {
    if (typeof content === "string") {
      return (
        <Typography align="center" style={styles.content}>
          {content}
        </Typography>
      );
    }
    return <View style={styles.content}>{content}</View>;
  };

  const renderAction = () => {
    if (action) {
      return (
        <IconButton
          onPress={action.onPress}
          variant="outlined"
          icon="plus"
          style={styles.action}
          borderColor="onBackground"
          iconColor="onBackground"
          size="xl"
        />
      );
    }
    return null;
  };

  return (
    <View style={[styles.container, style]}>
      {renderTitle()}
      {renderContent()}
      {renderAction()}
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
    content: {
      marginTop: theme.layout.spacing.xs,
    },
    action: {
      marginTop: theme.layout.spacing.lg,
    },
  });
