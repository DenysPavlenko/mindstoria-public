import { Typography } from "@/components";
import { getTemplates, TTrackerTemplateData } from "@/data/templates";
import { TOUCHABLE_ACTIVE_OPACITY, TTheme, useTheme } from "@/theme";
import Feather from "@react-native-vector-icons/feather";
import { useMemo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface TemplatesListProps {
  onSelect: (template: TTrackerTemplateData) => void;
}

export const TemplatesList = ({ onSelect }: TemplatesListProps) => {
  const { theme } = useTheme();

  const styles = useMemo(() => createStyles(theme), [theme]);
  const templates = useMemo(() => getTemplates(), []);

  const renderTemplatesList = () => {
    return templates.map((template, index) => {
      const isLastItem = index === templates.length - 1;
      return (
        <TouchableOpacity
          key={template.name}
          style={[styles.item, isLastItem && styles.itemLast]}
          onPress={() => onSelect(template)}
          activeOpacity={TOUCHABLE_ACTIVE_OPACITY}
        >
          <View style={styles.icon}>
            <Feather
              name={template.iconName}
              size={theme.layout.size.lg * 0.5}
              color={theme.colors.onPrimary}
            />
          </View>
          <Typography variant="body" style={styles.title}>
            {template.name}
          </Typography>
        </TouchableOpacity>
      );
    });
  };

  return renderTemplatesList();
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    title: {
      flex: 1,
      padding: theme.layout.spacing.lg,
    },
    item: {
      padding: theme.layout.spacing.lg,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderBottomColor: theme.colors.outlineVariant,
      borderBottomWidth: 1,
    },
    itemLast: {
      borderBottomWidth: 0,
    },
    icon: {
      width: theme.layout.size.lg,
      height: theme.layout.size.lg,
      borderRadius: theme.layout.borderRadius.lg,
      backgroundColor: theme.colors.primary,
      justifyContent: "center",
      alignItems: "center",
      marginRight: theme.layout.spacing.md,
    },
  });
