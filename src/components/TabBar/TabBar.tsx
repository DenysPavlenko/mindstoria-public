import {
  TAB_BAR_CBT_LOG_BUTTON_PRESS,
  TAB_BAR_LOG_BUTTON_PRESS,
} from "@/appConstants";
import { useTheme } from "@/providers";
import { TOUCHABLE_ACTIVE_OPACITY, TTheme, withAlpha } from "@/theme";
import Feather, { FeatherIconName } from "@react-native-vector-icons/feather";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { DeviceEventEmitter, StyleSheet, View } from "react-native";
import { LinearGradient } from "react-native-linear-gradient";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CustomPressable } from "../CustomPressable/CustomPressable";
import { IconButton } from "../IconButton/IconButton";
import { Typography } from "../Typography/Typography";

const TAB_BAR_PADDING = 4;
const TAB_ITEM_HEIGHT = 52;
const TAB_ITEM_WIDTH = TAB_ITEM_HEIGHT * 1.6;
export const TAB_BAR_HEIGHT = TAB_ITEM_HEIGHT + TAB_BAR_PADDING * 2;
const ADD_BUTTON_SIZE = TAB_BAR_HEIGHT;

type TTabDataItem = {
  icon: FeatherIconName;
  label: string;
};

const TABS_DATA: Record<string, TTabDataItem> = {
  index: {
    icon: "home",
    label: "common.home",
  },
  "cbt-logs": {
    icon: "book-open",
    label: "common.thoughts",
  },
  settings: {
    icon: "settings",
    label: "settings.title",
  },
};

export const TabBar = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  const { t } = useTranslation();
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  const styles = useMemo(() => createStyles(theme, isDark), [theme, isDark]);

  const bottom = insets.bottom + theme.layout.spacing.xs;

  const tabPositionX = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: tabPositionX.value }],
    };
  });

  const showAddButton =
    state.routes[state.index]?.name === "index" ||
    state.routes[state.index]?.name === "cbt-logs";

  const throttledEmitEvent = useMemo(() => {
    let lastEmitTime = 0;
    return (eventName: string) => {
      const now = Date.now();
      if (now - lastEmitTime >= 500) {
        lastEmitTime = now;
        DeviceEventEmitter.emit(eventName);
      }
    };
  }, []);

  const handleLogButtonPress = () => {
    const eventName =
      state.routes[state.index]?.name === "index"
        ? TAB_BAR_LOG_BUTTON_PRESS
        : TAB_BAR_CBT_LOG_BUTTON_PRESS;
    throttledEmitEvent(eventName);
  };

  const renderTabs = () => {
    return (
      <View style={[styles.tabsContainer, styles.shadow]}>
        <Animated.View
          style={[
            animatedStyle,
            {
              position: "absolute",
              backgroundColor: theme.colors.secondaryContainer,
              borderRadius: TAB_ITEM_HEIGHT / 2,
              width: TAB_ITEM_WIDTH,
              height: TAB_ITEM_HEIGHT,
              left: TAB_BAR_PADDING,
            },
          ]}
        />
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key]!;
          const tabData = TABS_DATA[route.name];
          if (!tabData) return null;
          const isFocused = state.index === index;
          const onPress = () => {
            tabPositionX.value = withSpring(TAB_ITEM_WIDTH * index, {
              damping: 70,
              stiffness: 900,
            });
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };
          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };
          return (
            <CustomPressable
              key={route.name}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabItem}
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarButtonTestID}
              activeOpacity={TOUCHABLE_ACTIVE_OPACITY}
            >
              <Feather
                size={theme.layout.size.xs}
                name={tabData.icon}
                color={
                  isFocused
                    ? theme.colors.onSecondaryContainer
                    : theme.colors.onSurface
                }
              />
              <Typography
                variant="extraTiny"
                align="center"
                color={isFocused ? "onSecondaryContainer" : "onSurface"}
              >
                {t(tabData.label)}
              </Typography>
            </CustomPressable>
          );
        })}
      </View>
    );
  };

  const renderAddButton = () => {
    if (!showAddButton) return null;
    return (
      <IconButton
        icon="plus"
        size={ADD_BUTTON_SIZE}
        color="primary"
        iconColor="onPrimary"
        style={[styles.shadow]}
        onPress={handleLogButtonPress}
        activeOpacity={1}
      />
    );
  };

  return (
    <View style={[styles.container, { paddingBottom: bottom }]}>
      <View style={styles.content}>
        {renderTabs()}
        {renderAddButton()}
      </View>
      <LinearGradient
        colors={[withAlpha(theme.colors.surface, 0.1), theme.colors.surface]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[styles.gradient, { height: TAB_ITEM_HEIGHT + bottom }]}
        pointerEvents="none"
      />
    </View>
  );
};

const createStyles = (theme: TTheme, isDark: boolean) =>
  StyleSheet.create({
    container: {
      position: "absolute",
      paddingHorizontal: theme.layout.spacing.lg,
      bottom: 0,
      left: 0,
      right: 0,
    },
    content: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: theme.layout.spacing.md,
      zIndex: 2,
    },
    tabsContainer: {
      backgroundColor: isDark
        ? theme.colors.surfaceContainer
        : theme.colors.surface,
      flexDirection: "row",
      alignItems: "center",
      height: TAB_BAR_HEIGHT,
      padding: TAB_BAR_PADDING,
      borderRadius: TAB_BAR_HEIGHT / 2,
    },
    tabItem: {
      alignItems: "center",
      justifyContent: "center",
      gap: theme.layout.spacing.xxs,
      height: TAB_ITEM_HEIGHT,
      width: TAB_ITEM_WIDTH,
      zIndex: 2,
    },
    shadow: {
      shadowColor: theme.colors.shadow,
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowRadius: 20,
      shadowOpacity: 0.25,
      elevation: 4,
    },
    gradient: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1,
    },
  });
