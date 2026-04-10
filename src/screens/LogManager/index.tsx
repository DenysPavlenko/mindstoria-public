import {
  Button,
  ConfirmationDialog,
  Header,
  MoodInput,
  Pill,
  SearchInput,
  TimePickerModal,
} from "@/components";
import { useAndroidBackHandler, useKeyboard } from "@/hooks";
import { useTheme } from "@/providers";
import { useAppSelector } from "@/store";
import { selectCBTLogs } from "@/store/slices";
import { TTheme } from "@/theme";
import { isStringEmpty } from "@/utils";
import { useIsFocused } from "@react-navigation/native";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { LayoutChangeEvent, StyleSheet, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AnimatedContentWrapper } from "./components/AnimatedContentWrapper";
import { CBTCard } from "./components/CBTCard";
import { EmotionsCard } from "./components/EmotionsCard";
import { ImpactsCard } from "./components/ImpactsCard";
import { NotesInput } from "./components/NotesInput";
import { SearchResults } from "./components/SearchResults";
import { useLogForm } from "./hooks/useLogForm";
import { useSelectionMaps } from "./hooks/useSelectionMaps";
import { TSentimentSearchResult } from "./hooks/useSentimentSearch";
import { useSentimentToggle } from "./hooks/useSentimentToggle";

export type LogManagerProps = {
  date?: string;
  logId?: string;
};

export const LogManager = ({ date, logId }: LogManagerProps) => {
  const { t } = useTranslation();
  const { keyboardHeight } = useKeyboard();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const isFocused = useIsFocused();
  const { theme } = useTheme();
  const cbtLogs = useAppSelector(selectCBTLogs);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [footerHeight, setFooterHeight] = useState(0);

  const {
    fields,
    setField,
    setAllFields,
    resetForm,
    currentLog,
    isValid,
    formattedTime,
    initialTime,
    saveLog,
  } = useLogForm(logId);
  const handleSentimentToggle = useSentimentToggle(fields, setField);
  const { selectedImpactsMap, selectedEmotionsMap, selectedLogsMap } =
    useSelectionMaps(fields.impacts, fields.emotions);

  const styles = useMemo(() => createStyles(theme), [theme]);

  useEffect(() => {
    if (currentLog) {
      setAllFields({
        ...currentLog.values,
        timestamp: currentLog.timestamp,
      });
    } else {
      const now = dayjs();
      const timestamp = date
        ? dayjs(date).hour(now.hour()).minute(now.minute()).toISOString()
        : now.toISOString();
      setField("timestamp", timestamp);
    }
  }, [currentLog, setAllFields, setField, date]);

  // Reset form when navigating away from the screen
  useEffect(() => {
    return () => {
      resetForm();
    };
  }, [resetForm]);

  const handleSave = useCallback(() => {
    const id = saveLog();
    router.back();
    return id;
  }, [saveLog, router]);

  const handleBackPress = useCallback(() => {
    if (showExitConfirmation) return true;
    if (isValid) {
      setShowExitConfirmation(true);
      return true;
    }
    router.back();
    return true;
  }, [isValid, router, showExitConfirmation]);

  const handleExitWithoutSaving = useCallback(() => {
    setShowExitConfirmation(false);
    router.back();
  }, [router]);

  useAndroidBackHandler(() => {
    if (isFocused) {
      return handleBackPress();
    }
  });

  const connectedCBTLogId = useMemo(() => {
    if (!logId) return null;
    return cbtLogs.find((log) => log.wellbeingLogId === logId)?.id || null;
  }, [cbtLogs, logId]);

  const onFooterLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setFooterHeight(height);
  };

  const handleSearchResultPress = (item: TSentimentSearchResult) => {
    handleSentimentToggle(item.sentimentType, item.id);
  };

  const renderHeader = () => {
    return (
      <Header
        onBack={handleBackPress}
        preventBackNavigation
        rightContent={
          <Pill label={formattedTime} onPress={() => setShowTimePicker(true)} />
        }
      />
    );
  };

  const renderModalInput = () => {
    return (
      <MoodInput
        value={fields.wellbeing}
        onChange={(value) => setField("wellbeing", value)}
      />
    );
  };

  const renderFooterButton = () => {
    if (searchQuery) {
      return (
        <Button onPress={() => setSearchQuery("")}>{t("common.done")}</Button>
      );
    }
    return (
      <Button disabled={!isValid} onPress={handleSave}>
        {t("common.save")}
      </Button>
    );
  };

  const contentList = useMemo(
    () => [
      {
        id: "search",
        render: () => (
          <SearchInput value={searchQuery} onChangeText={setSearchQuery} />
        ),
      },
      {
        id: "impacts",
        render: () => (
          <ImpactsCard
            selectedMap={selectedImpactsMap}
            onButtonPress={(id) => handleSentimentToggle("impact", id)}
          />
        ),
      },
      {
        id: "emotions",
        render: () => (
          <EmotionsCard
            selectedMap={selectedEmotionsMap}
            onButtonPress={(id) => handleSentimentToggle("emotion", id)}
          />
        ),
      },
      {
        id: "notes",
        render: () => (
          <NotesInput
            value={fields.notes || ""}
            onChangeText={(text) => setField("notes", text)}
          />
        ),
      },
      {
        id: "cbt",
        render: () => (
          <CBTCard
            date={fields.timestamp}
            cbtLogId={connectedCBTLogId}
            canConnect={fields.wellbeing !== null}
            onSave={handleSave}
          />
        ),
      },
    ],
    [
      searchQuery,
      setField,
      connectedCBTLogId,
      fields.notes,
      fields.timestamp,
      fields.wellbeing,
      handleSave,
      handleSentimentToggle,
      selectedEmotionsMap,
      selectedImpactsMap,
    ],
  );

  const renderMainContent = () => {
    const hasSearchResults = !isStringEmpty(searchQuery);
    const paddingBottom = keyboardHeight ? keyboardHeight - footerHeight : 0;
    return (
      <View style={[styles.contentContainer, { paddingBottom: insets.bottom }]}>
        <View style={[styles.contentWrapper, { paddingBottom }]}>
          <FlatList
            data={contentList}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => item.render()}
            contentContainerStyle={styles.contentListContainer}
            showsVerticalScrollIndicator={false}
            scrollEnabled={!hasSearchResults}
          />
          {hasSearchResults && (
            <SearchResults
              query={searchQuery}
              selectedMap={selectedLogsMap}
              onPress={handleSearchResultPress}
              paddingBottom={paddingBottom}
            />
          )}
        </View>
        <View style={styles.footer} onLayout={onFooterLayout}>
          {renderFooterButton()}
        </View>
      </View>
    );
  };

  return (
    <>
      <AnimatedContentWrapper
        shouldAnimate={!Boolean(currentLog)}
        level={fields.wellbeing}
        header={renderHeader()}
        moodInput={renderModalInput()}
        mainContent={renderMainContent()}
        keyboardHeight={keyboardHeight}
      />
      <TimePickerModal
        visible={showTimePicker}
        onClose={() => setShowTimePicker(false)}
        onConfirm={(hours, minutes) => {
          setShowTimePicker(false);
          setField(
            "timestamp",
            dayjs(fields.timestamp).hour(hours).minute(minutes).toISOString(),
          );
        }}
        hours={initialTime.hours}
        minutes={initialTime.minutes}
      />
      <ConfirmationDialog
        visible={showExitConfirmation}
        title={t("common.leave_without_saving_title")}
        content={t("common.leave_without_saving_content")}
        actionText={t("common.leave")}
        onClose={() => setShowExitConfirmation(false)}
        onConfirm={handleExitWithoutSaving}
      />
    </>
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    contentContainer: {
      flex: 1,
    },
    contentWrapper: {
      flex: 1,
    },
    contentListContainer: {
      gap: theme.layout.spacing.lg,
      paddingTop: theme.layout.spacing.xl,
      paddingBottom: theme.layout.spacing.sm,
    },
    footer: {
      paddingVertical: theme.layout.spacing.lg,
    },
  });
