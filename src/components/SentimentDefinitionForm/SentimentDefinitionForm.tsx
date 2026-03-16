import {
  DEFAULT_SENTIMENT_CATEGORY_ID,
  MAX_FREE_CUSTOM_SENTIMENT_DEFINITIONS,
} from "@/appConstants";
import { useRevenueCat, useTheme } from "@/providers";
import { TTheme } from "@/theme";
import {
  TEmotionDefinition,
  TImpactDefinition,
  TSentimentCategoryDefinition,
  TSentimentType,
} from "@/types";
import { generateUniqueId, trackEvent } from "@/utils";
import { FeatherIconName } from "@react-native-vector-icons/feather";
import { useNavigation } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, StyleSheet, View } from "react-native";
import { Button } from "../Button/Button";
import { Chip } from "../Chip/Chip";
import { Header } from "../Header/Header";
import { IconButton } from "../IconButton/IconButton";
import { Input } from "../Input/Input";
import { Label } from "../Label/Label";
import { SafeView } from "../SafeView/SafeView";
import { Typography } from "../Typography/Typography";

type TSentimentDefinition = TEmotionDefinition | TImpactDefinition;
type TDefinitions = TSentimentDefinition[];

interface SentimentDefinitionFormProps {
  prefillName?: string;
  prefillCategoryId?: string;
  definitionId?: string;
  definitions: TDefinitions;
  iconList: string[];
  categories: TSentimentCategoryDefinition[];
  sentimentType: TSentimentType;
  translations: {
    headerTitle: string;
    inputLabel: string;
    inputPlaceholder: string;
    duplicateError: string;
  };
  analytics: {
    editCompleted: string;
    createCompleted: string;
  };
  onAdd: (definition: TSentimentDefinition) => void;
  onEdit: (definition: TSentimentDefinition) => void;
}

export const SentimentDefinitionForm = ({
  prefillName,
  prefillCategoryId,
  definitionId,
  definitions,
  iconList,
  categories,
  sentimentType,
  translations,
  analytics,
  onAdd,
  onEdit,
}: SentimentDefinitionFormProps) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { checkPremiumFeature } = useRevenueCat();
  const navigation = useNavigation();
  const [name, setName] = useState(prefillName || "");
  const [icon, setIcon] = useState<string>();
  const defaultCategoryId = categories[0]?.id ?? DEFAULT_SENTIMENT_CATEGORY_ID;
  const [categoryId, setCategoryId] = useState(
    prefillCategoryId ?? defaultCategoryId,
  );
  const [isUserCreated, setIsUserCreated] = useState(true);
  const [isInputTouched, setIsInputTouched] = useState(false);

  const styles = useMemo(() => createStyles(theme), [theme]);

  const createdByUserCount = useMemo(() => {
    return definitions.filter((def) => def.isUserCreated).length;
  }, [definitions]);

  const hasDuplicate = useMemo(() => {
    if (definitionId) return false;
    return definitions.some(
      (def) => def.name.toLowerCase().trim() === name.toLowerCase().trim(),
    );
  }, [name, definitions, definitionId]);

  useEffect(() => {
    if (definitionId) {
      const def = definitions.find((d) => d.id === definitionId);
      if (def) {
        setName(t(def.name));
        setIcon(def.icon);
        setCategoryId(def.categoryId ?? defaultCategoryId);
        setIsUserCreated(def.isUserCreated);
      }
    }
  }, [definitionId, definitions, t, defaultCategoryId]);

  useEffect(() => {
    if (!categoryId && categories[0]?.id) {
      setCategoryId(categories[0].id);
    }
  }, [categoryId, categories]);

  const isValid = useMemo(() => {
    if (!name.trim() || !icon || !categoryId) return false;
    if (hasDuplicate) return false;
    return true;
  }, [name, icon, hasDuplicate, categoryId]);

  const handleAdd = () => {
    const newDefinition = {
      id: generateUniqueId(),
      name: name.trim(),
      icon: icon!,
      categoryId,
      isUserCreated,
    };
    if (createdByUserCount >= MAX_FREE_CUSTOM_SENTIMENT_DEFINITIONS) {
      checkPremiumFeature(() => {
        onAdd(newDefinition);
        navigation.goBack();
      });
    } else {
      onAdd(newDefinition);
      navigation.goBack();
    }
  };

  const handleEdit = () => {
    if (!definitionId) return;
    onEdit({
      id: definitionId,
      name: name.trim(),
      icon: icon!,
      categoryId,
      isUserCreated,
    });
    navigation.goBack();
  };

  const handleSave = () => {
    if (!isValid) return;
    if (definitionId) {
      handleEdit();
      trackEvent(analytics.editCompleted);
    } else {
      handleAdd();
      trackEvent(analytics.createCompleted);
    }
  };

  const renderIcon = (icon: string | FeatherIconName, isSelected: boolean) => {
    const iconProp =
      sentimentType === "emotion"
        ? {
            customIcon: (
              <Typography style={{ fontSize: 16, lineHeight: 24 }}>
                {icon}
              </Typography>
            ),
          }
        : { icon: icon as FeatherIconName };

    return (
      <IconButton
        {...iconProp}
        size="lg"
        radius="lg"
        iconColor={isSelected ? "surface" : "onSurface"}
        color={isSelected ? "primary" : "surface"}
        onPress={() => setIcon(icon)}
        withHaptics={false}
      />
    );
  };

  return (
    <SafeView>
      <Header title={translations.headerTitle} />
      <View style={styles.container}>
        <View style={styles.wrapper}>
          <Input
            label={translations.inputLabel}
            value={name}
            onChangeText={(val) => {
              setName(val);
              setIsInputTouched(true);
            }}
            placeholder={translations.inputPlaceholder}
            error={
              isInputTouched && hasDuplicate
                ? translations.duplicateError
                : undefined
            }
          />
        </View>
        <View>
          <Label style={styles.wrapper} label={t("common.category")} />
          <FlatList
            data={categories}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.categoryList}
            renderItem={({ item }) => (
              <Chip
                label={t(item.name)}
                selected={categoryId === item.id}
                onPress={() => setCategoryId(item.id)}
              />
            )}
          />
        </View>
        <FlatList
          data={iconList}
          numColumns={7}
          keyExtractor={(item) => item}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.wrapper}
          renderItem={({ item }) => (
            <View style={styles.pickerIcon}>
              {renderIcon(item, icon === item)}
            </View>
          )}
        />
        <Button onPress={handleSave} disabled={!isValid}>
          {definitionId ? t("common.save_changes") : t("common.add")}
        </Button>
      </View>
    </SafeView>
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    container: {
      paddingTop: theme.layout.spacing.xs,
      gap: theme.layout.spacing.lg,
      flex: 1,
    },
    wrapper: {
      paddingHorizontal: theme.layout.spacing.lg,
    },
    categoryList: {
      flexDirection: "row",
      gap: theme.layout.spacing.sm,
      paddingHorizontal: theme.layout.spacing.lg,
    },
    pickerIcon: {
      width: `${100 / 7}%`,
      padding: theme.layout.spacing.sm,
      alignItems: "center",
      justifyContent: "center",
    },
  });
