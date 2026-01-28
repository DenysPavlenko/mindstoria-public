import { ANALYTICS_EVENTS } from "@/analytics-constants";
import { MAX_FREE_CUSTOM_SENTIMENT_DEFINITIONS } from "@/appConstants";
import {
  Button,
  Header,
  IconButton,
  Input,
  SafeView,
  SwitchSelector,
  Typography,
} from "@/components";
import { emojiList } from "@/data";
import { useTranslatedEmotionDefinitions } from "@/hooks";
import { useRevenueCat, useTheme } from "@/providers";
import { useAppDispatch } from "@/store";
import { addEmotionDefinition, updateEmotionDefinition } from "@/store/slices";
import { TTheme } from "@/theme";
import { TEmotionDefinition, TSentimentType } from "@/types";
import { generateUniqueId, trackEvent } from "@/utils";
import { useNavigation } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, StyleSheet, View } from "react-native";

interface EmotionDefinitionFormProps {
  prefillName?: string;
  type?: TSentimentType;
  definitionId?: string;
}

export const EmotionDefinitionForm = ({
  prefillName,
  definitionId,
  type,
}: EmotionDefinitionFormProps) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const definitions = useTranslatedEmotionDefinitions({ activeOnly: true });
  const navigation = useNavigation();
  const { checkPremiumFeature } = useRevenueCat();
  const [emotionType, setEmotionType] = useState<TSentimentType>(
    type || "positive",
  );
  const [name, setName] = useState(prefillName || "");
  const [icon, setIcon] = useState<string>();
  const [isInputTouched, setIsInputTouched] = useState(false);
  const [isUserCreated, setIsUserCreated] = useState(true);

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
        setEmotionType(def.type);
        setIcon(def.icon);
        setIsUserCreated(def.isUserCreated);
      }
    }
  }, [definitionId, definitions, t]);

  const isValid = useMemo(() => {
    if (!name.trim() || !icon) return false;
    if (hasDuplicate) return false;
    return true;
  }, [name, icon, hasDuplicate]);

  const handleAdd = () => {
    const newDefinition: TEmotionDefinition = {
      id: generateUniqueId(),
      name: name.trim(),
      type: emotionType,
      icon: icon!,
      isUserCreated,
    };
    if (createdByUserCount >= MAX_FREE_CUSTOM_SENTIMENT_DEFINITIONS) {
      checkPremiumFeature(() => {
        dispatch(addEmotionDefinition(newDefinition));
        navigation.goBack();
      });
    } else {
      dispatch(addEmotionDefinition(newDefinition));
      navigation.goBack();
    }
  };

  const handleEdit = () => {
    if (!definitionId) return;
    dispatch(
      updateEmotionDefinition({
        id: definitionId,
        name: name.trim(),
        type: emotionType,
        icon: icon!,
        isUserCreated,
      }),
    );
    navigation.goBack();
  };

  const handleSave = () => {
    if (!isValid) return;
    if (definitionId) {
      handleEdit();
      trackEvent(ANALYTICS_EVENTS.EMOTION_EDIT_COMPLETED, {
        type: emotionType,
      });
    } else {
      handleAdd();
      trackEvent(ANALYTICS_EVENTS.EMOTION_CREATE_COMPLETED, {
        type: emotionType,
      });
    }
  };

  const renderSelector = () => {
    return (
      <View style={{ alignItems: "flex-start" }}>
        <SwitchSelector
          selectedValue={emotionType}
          options={[
            { value: "positive", label: t("sentiments.positive") },
            { value: "negative", label: t("sentiments.negative") },
          ]}
          onChange={setEmotionType}
        />
      </View>
    );
  };

  const renderInput = () => {
    const showError = isInputTouched && hasDuplicate;
    return (
      <Input
        label={t("emotions.emotion_name")}
        value={name}
        onChangeText={(val) => {
          setName(val);
          setIsInputTouched(true);
        }}
        placeholder={
          emotionType === "positive"
            ? t("emotions.add_positive_emotion_placeholder")
            : t("emotions.add_negative_emotion_placeholder")
        }
        error={showError ? t("emotions.duplicate_emotion_name") : undefined}
      />
    );
  };

  const renderIconsList = () => {
    return (
      <FlatList
        data={emojiList}
        numColumns={7}
        keyExtractor={(item) => item}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const positiveBg = theme.colors.rating["400"];
          const negativeBg = theme.colors.rating["50"];
          const selectedBg =
            emotionType === "positive" ? positiveBg : negativeBg;
          const defaultBg = theme.colors.surface;
          return (
            <View key={item} style={styles.pickerIcon}>
              <IconButton
                customContent={
                  <Typography style={{ fontSize: 28, lineHeight: 38 }}>
                    {item}
                  </Typography>
                }
                size="lg"
                radius="lg"
                iconColor={icon === item ? "surface" : "onSurface"}
                style={{
                  backgroundColor: icon === item ? selectedBg : defaultBg,
                }}
                onPress={() => setIcon(item)}
                withHaptics={false}
              />
            </View>
          );
        }}
      />
    );
  };

  const renderHeader = () => {
    return <Header title={t("emotions.add_emotion")} />;
  };

  return (
    <SafeView>
      {renderHeader()}
      <View style={styles.wrapper}>
        {renderSelector()}
        {renderInput()}
        {renderIconsList()}
        <Button onPress={handleSave} disabled={!isValid}>
          {definitionId ? t("common.save_changes") : t("common.add")}
        </Button>
      </View>
    </SafeView>
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    wrapper: {
      paddingHorizontal: theme.layout.spacing.lg,
      paddingTop: theme.layout.spacing.lg,
      gap: theme.layout.spacing.lg,
      flex: 1,
    },
    pickerIcons: {
      flexDirection: "row",
      flexWrap: "wrap",
    },
    pickerIcon: {
      width: `${100 / 7}%`,
      padding: theme.layout.spacing.sm,
      alignItems: "center",
      justifyContent: "center",
    },
  });
