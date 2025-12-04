import { COGNITIVE_DISTORTIONS } from "@/data";
import { TTheme, useTheme } from "@/theme";
import { TCognitiveDistortionLog } from "@/types";
import { generateUniqueId } from "@/utils";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, StyleSheet, View } from "react-native";
import { CognitiveDistortionCard } from "../CognitiveDistortionCard/CognitiveDistortionCard";
import { Typography } from "../Typography/Typography";

interface CognitiveDistortionSelectorProps {
  logItems: TCognitiveDistortionLog[];
  onChange: (items: TCognitiveDistortionLog[]) => void;
}

export const CognitiveDistortionSelector = ({
  logItems,
  onChange,
}: CognitiveDistortionSelectorProps) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const cognitiveDistortionLogsMap = useMemo(() => {
    return logItems.reduce((acc, item) => {
      acc[item.definitionId] = item;
      return acc;
    }, {} as Record<string, TCognitiveDistortionLog>);
  }, [logItems]);

  const handleDistortionPress = (definitionId: string) => {
    const isSelected = !!cognitiveDistortionLogsMap[definitionId];

    if (isSelected) {
      // Remove the distortion
      const filteredItems = logItems.filter(
        (item) => item.definitionId !== definitionId
      );
      onChange(filteredItems);
    } else {
      // Add the distortion
      const newItem: TCognitiveDistortionLog = {
        id: generateUniqueId(),
        definitionId,
      };
      onChange([...logItems, newItem]);
    }
  };

  const renderDistortionItem = ({
    item,
  }: {
    item: (typeof COGNITIVE_DISTORTIONS)[0];
  }) => {
    const isSelected = !!cognitiveDistortionLogsMap[item.id];

    return (
      <CognitiveDistortionCard
        name={t(item.name)}
        description={t(item.description)}
        icon={item.icon}
        isSelected={isSelected}
        onPress={() => handleDistortionPress(item.id)}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Typography variant="h3">{t("cbt.cognitive_distortions")}</Typography>
      <FlatList
        data={COGNITIVE_DISTORTIONS}
        renderItem={renderDistortionItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      gap: theme.layout.spacing.lg,
      paddingHorizontal: theme.layout.spacing.lg,
    },
    listContainer: {
      gap: theme.layout.spacing.sm,
      paddingBottom: theme.layout.spacing.lg,
    },
  });
