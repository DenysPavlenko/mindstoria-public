import { MAX_FREE_CUSTOM_SENTIMENT_DEFINITIONS } from "@/appConstants";
import {
  Button,
  Header,
  IconButton,
  Input,
  SafeView,
  SwitchSelector,
} from "@/components";
import { iconList } from "@/data";
import { useTranslatedImpactDefinitions } from "@/hooks";
import { useRevenueCat } from "@/services";
import { useAppDispatch } from "@/store";
import { addImpactDefinition, updateImpactDefinition } from "@/store/slices";
import { TTheme, useTheme } from "@/theme";
import { TImpactDefinition, TSentimentType } from "@/types";
import { generateUniqueId } from "@/utils";
import { FeatherIconName } from "@react-native-vector-icons/feather";
import { useNavigation } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, StyleSheet, View } from "react-native";

interface ImpactDefinitionFormProps {
  prefillName?: string;
  type?: TSentimentType;
  definitionId?: string;
}

export const ImpactDefinitionForm = ({
  prefillName,
  definitionId,
  type,
}: ImpactDefinitionFormProps) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const { checkPremiumFeature } = useRevenueCat();
  const definitions = useTranslatedImpactDefinitions({ activeOnly: true });
  const navigation = useNavigation();
  const [impactType, setImpactType] = useState<TSentimentType>(
    type || "positive"
  );
  const [name, setName] = useState(prefillName || "");
  const [icon, setIcon] = useState<FeatherIconName>();
  const [isUserCreated, setIsUserCreated] = useState(true);
  const [isInputTouched, setIsInputTouched] = useState(false);

  const styles = useMemo(() => createStyles(theme), [theme]);

  const createdByUserCount = useMemo(() => {
    return definitions.filter((def) => def.isUserCreated).length;
  }, [definitions]);

  const hasDuplicate = useMemo(() => {
    if (definitionId) return false;
    return definitions.some(
      (def) => def.name.toLowerCase().trim() === name.toLowerCase().trim()
    );
  }, [name, definitions, definitionId]);

  useEffect(() => {
    if (definitionId) {
      const def = definitions.find((d) => d.id === definitionId);
      if (def) {
        setName(def.name);
        setImpactType(def.type);
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
    const newDefinition: TImpactDefinition = {
      id: generateUniqueId(),
      name: name.trim(),
      type: impactType,
      icon: icon!,
      isUserCreated,
    };
    if (createdByUserCount >= MAX_FREE_CUSTOM_SENTIMENT_DEFINITIONS) {
      checkPremiumFeature(() => {
        dispatch(addImpactDefinition(newDefinition));
        navigation.goBack();
      });
    } else {
      dispatch(addImpactDefinition(newDefinition));
      navigation.goBack();
    }
  };

  const handleEdit = () => {
    if (!definitionId) return;
    dispatch(
      updateImpactDefinition({
        id: definitionId,
        name: name.trim(),
        type: impactType,
        icon: icon!,
        isUserCreated,
      })
    );
    navigation.goBack();
  };

  const handleSave = () => {
    if (!isValid) return;
    if (definitionId) {
      handleEdit();
    } else {
      handleAdd();
    }
  };

  const renderSelector = () => {
    return (
      <View style={{ alignItems: "flex-start" }}>
        <SwitchSelector
          selectedValue={impactType}
          options={[
            { value: "positive", label: t("sentiments.positive") },
            { value: "negative", label: t("sentiments.negative") },
          ]}
          onChange={setImpactType}
        />
      </View>
    );
  };

  const renderInput = () => {
    const showError = isInputTouched && hasDuplicate;
    return (
      <Input
        label={t("impacts.impact_name")}
        value={name}
        onChangeText={(val) => {
          setName(val);
          setIsInputTouched(true);
        }}
        placeholder={
          impactType === "positive"
            ? t("impacts.add_positive_impact_placeholder")
            : t("impacts.add_negative_impact_placeholder")
        }
        error={showError ? t("impacts.duplicate_impact_name") : undefined}
      />
    );
  };

  const renderIconsList = () => {
    return (
      <FlatList
        data={iconList}
        numColumns={7}
        keyExtractor={(item) => item}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          return (
            <View key={item} style={styles.pickerIcon}>
              <IconButton
                icon={item}
                size="lg"
                radius="lg"
                iconColor={icon === item ? "surface" : "onSurface"}
                style={{
                  backgroundColor:
                    icon === item
                      ? theme.colors.sentiment[impactType][400]
                      : theme.colors.surface,
                }}
                onPress={() => setIcon(item)}
              />
            </View>
          );
        }}
      />
    );
  };

  const renderHeader = () => {
    return <Header title={t("impacts.add_impact")} />;
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
